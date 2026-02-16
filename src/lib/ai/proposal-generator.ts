import { createAdminClient } from "@/lib/supabase/admin";
import { promptClaude } from "@/lib/ai/client";
import type { CreateProposalInput } from "@/lib/validations/proposal";
import type { Profile, GenerationMetadata, ScopeItem, Deliverable, TimelinePhase, LineItem } from "@/types";
import type { TemplateContent } from "@/lib/templates/types";

function buildJsonSystemPrompt(template?: TemplateContent): string {
  let prompt = `You are an expert business consultant and proposal writer with 15+ years of experience helping agencies and freelancers win deals. You write proposals that are:

- Specific to the client's brief — no generic filler
- Professional and confident in tone, not salesy or fluffy
- Structured for clarity and easy scanning
- Priced realistically for the described work
- Focused on the client's goals and outcomes, not just deliverables

Every section must add value. If it doesn't help close the deal, cut it.
Always respond with valid JSON only. No markdown, no code blocks, just the JSON object.`;

  if (template?.ai_guidance) {
    prompt += `\n\nTONE AND STYLE GUIDANCE:\n${template.ai_guidance.tone}`;
    if (template.ai_guidance.style_notes) {
      prompt += `\n\nADDITIONAL STYLE NOTES:\n${template.ai_guidance.style_notes}`;
    }
  }

  return prompt;
}

function buildTextSystemPrompt(template?: TemplateContent): string {
  let prompt = `You are an expert business consultant and proposal writer with 15+ years of experience helping agencies and freelancers win deals. You write proposals that are:

- Specific to the client's brief — no generic filler
- Professional and confident in tone, not salesy or fluffy
- Structured for clarity and easy scanning
- Focused on the client's goals and outcomes, not just deliverables

Every section must add value. If it doesn't help close the deal, cut it.
Respond with plain text only. No JSON, no markdown formatting, no code blocks, no bold/italic markers. Use line breaks to separate paragraphs and sections. Use ALL CAPS for section headings if needed.`;

  if (template?.ai_guidance) {
    prompt += `\n\nTONE AND STYLE GUIDANCE:\n${template.ai_guidance.tone}`;
    if (template.ai_guidance.style_notes) {
      prompt += `\n\nADDITIONAL STYLE NOTES:\n${template.ai_guidance.style_notes}`;
    }
  }

  return prompt;
}

/** Strip JSON wrappers and markdown formatting if the AI ignores instructions */
function cleanTextResponse(text: string): string {
  let cleaned = text.trim();

  // If response is JSON, extract the first string value
  if (cleaned.startsWith("{")) {
    try {
      const parsed = JSON.parse(cleaned);
      const firstValue = Object.values(parsed).find((v) => typeof v === "string");
      if (typeof firstValue === "string") {
        cleaned = firstValue;
      }
    } catch {
      // Not valid JSON, continue with raw text
    }
  }

  // Strip markdown bold/italic markers
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  cleaned = cleaned.replace(/\*(.*?)\*/g, "$1");

  // Convert literal \n to actual newlines (in case of escaped strings)
  cleaned = cleaned.replace(/\\n/g, "\n");

  // Strip markdown code blocks wrapper
  cleaned = cleaned.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");

  return cleaned.trim();
}

interface ProposalPlan {
  title: string;
  client_analysis: string;
  client_name: string | null;
  client_email: string | null;
  client_company: string | null;
  scope_items: { title: string; description: string }[];
  deliverables: { title: string; description: string }[];
  timeline_phases: { phase: string; duration: string; description: string }[];
  suggested_investment_cents: number;
  line_items: { description: string; amount_cents: number }[];
  key_selling_points: string[];
}

async function updateGenerationStatus(
  proposalId: string,
  step: string,
  completedSteps: string[],
  progress: number
): Promise<void> {
  const supabase = createAdminClient();
  const metadata: GenerationMetadata = {
    current_step: step,
    completed_steps: completedSteps,
    progress,
  };

  await supabase
    .from("proposals")
    .update({ generation_metadata: metadata } as Record<string, unknown>)
    .eq("id", proposalId);
}

export async function generateProposal(
  proposalId: string,
  input: CreateProposalInput,
  profile: Profile,
  templateContent?: TemplateContent
): Promise<void> {
  const supabase = createAdminClient();
  const completedSteps: string[] = [];

  const jsonSystemPrompt = buildJsonSystemPrompt(templateContent);
  const textSystemPrompt = buildTextSystemPrompt(templateContent);

  try {
    // Step 1: Analyze client brief
    await updateGenerationStatus(proposalId, "Analyzing client brief", completedSteps, 10);

    completedSteps.push("Analyzing client brief");

    // Step 2: Research client company
    await updateGenerationStatus(proposalId, "Researching client company", completedSteps, 20);

    completedSteps.push("Researching client company");

    // Step 3: Create proposal plan with extended thinking
    await updateGenerationStatus(proposalId, "Drafting scope of work", completedSteps, 30);

    let planPrompt = `Create a detailed proposal plan for the following client brief:

Client Brief: ${input.client_brief}
${input.client_name ? `Client Name: ${input.client_name}` : ""}
${input.client_company ? `Client Company: ${input.client_company}` : ""}
${input.service_type ? `Service Type: ${input.service_type}` : ""}

My Company: ${profile.company_name || profile.full_name}
${profile.bio ? `About My Company: ${profile.bio}` : ""}`;

    if (templateContent?.ai_guidance) {
      planPrompt += `\n\nINDUSTRY CONTEXT:\n${templateContent.ai_guidance.industry_context}`;
      planPrompt += `\n\nPRICING GUIDANCE:\n${templateContent.ai_guidance.pricing_guidance}`;
      planPrompt += `\nPreferred pricing model: ${templateContent.ai_guidance.pricing_model}`;
    }

    planPrompt += `

Respond with a JSON object containing:
{
  "title": "Proposal title (e.g., 'Website Redesign Proposal for Acme Corp')",
  "client_analysis": "2-3 sentence analysis of the client's needs",
  "client_name": "Full name of the client contact extracted from the brief, or null if not found",
  "client_email": "Email address extracted from the brief, or null if not found",
  "client_company": "Company/organization name extracted from the brief, or null if not found",
  "scope_items": [{"title": "...", "description": "..."}],
  "deliverables": [{"title": "...", "description": "..."}],
  "timeline_phases": [{"phase": "Phase name", "duration": "e.g., 2 weeks", "description": "..."}],
  "suggested_investment_cents": 850000,
  "line_items": [{"description": "...", "amount_cents": 250000}],
  "key_selling_points": ["point 1", "point 2", "point 3"]
}`;

    const planResponse = await promptClaude(jsonSystemPrompt, planPrompt, {
      useExtendedThinking: true,
      budgetTokens: 8192,
    });

    let plan: ProposalPlan;
    try {
      plan = JSON.parse(planResponse);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = planResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse proposal plan from AI response");
      }
    }

    completedSteps.push("Drafting scope of work");

    // Extract client info from plan and auto-create client record
    const clientName = plan.client_name || input.client_name || null;
    const clientEmail = plan.client_email || input.client_email || null;
    const clientCompany = plan.client_company || input.client_company || null;

    let clientId: string | null = null;
    if (clientName || clientCompany) {
      try {
        // Check for existing client by email or company
        let existingClient = null;
        if (clientEmail) {
          const { data } = await supabase
            .from("clients")
            .select("id")
            .eq("user_id", profile.id)
            .eq("email", clientEmail)
            .limit(1)
            .maybeSingle();
          existingClient = data;
        }
        if (!existingClient && clientCompany) {
          const { data } = await supabase
            .from("clients")
            .select("id")
            .eq("user_id", profile.id)
            .eq("company", clientCompany)
            .limit(1)
            .maybeSingle();
          existingClient = data;
        }

        if (existingClient) {
          clientId = (existingClient as { id: string }).id;
        } else {
          const { data: newClient } = await supabase
            .from("clients")
            .insert({
              user_id: profile.id,
              name: clientName || clientCompany,
              email: clientEmail,
              company: clientCompany,
            })
            .select("id")
            .single();
          if (newClient) clientId = (newClient as { id: string }).id;
        }

        // Update proposal with extracted client info
        await supabase
          .from("proposals")
          .update({
            client_name: clientName,
            client_email: clientEmail,
            client_company: clientCompany,
            client_id: clientId,
          } as Record<string, unknown>)
          .eq("id", proposalId);
      } catch (err) {
        console.error("Auto-client creation during generation failed:", err);
      }
    }

    // Step 4: Generate sections in parallel
    await updateGenerationStatus(proposalId, "Creating timeline", completedSteps, 50);

    // Determine which sections to generate
    const includeUnderstanding = templateContent?.section_config?.include_understanding !== false;
    const includeAboutUs = templateContent?.section_config?.include_about_us !== false;
    const useTemplateTerms = templateContent?.terms && templateContent.terms.length > 0;

    const sectionPromises: Promise<string>[] = [
      // Executive summary — always generated
      promptClaude(
        textSystemPrompt,
        `Write a compelling executive summary (2-3 paragraphs) for this proposal. It should be client-focused and highlight the value they'll receive.

Client Analysis: ${plan.client_analysis}
Scope: ${plan.scope_items.map((s) => s.title).join(", ")}
Investment: $${(plan.suggested_investment_cents / 100).toFixed(0)}

Write just the executive summary text. Plain text only, no JSON wrapping, no markdown.`
      ),
    ];

    // Understanding — optional per template config
    if (includeUnderstanding) {
      sectionPromises.push(
        promptClaude(
          textSystemPrompt,
          `Write a "Understanding of Your Needs" section (2-3 paragraphs) that demonstrates deep understanding of the client's challenges and goals.

Client Brief: ${input.client_brief}
Client Analysis: ${plan.client_analysis}

Write just the text. Plain text only, no JSON wrapping, no markdown.`
        )
      );
    } else {
      sectionPromises.push(Promise.resolve(""));
    }

    // Terms — use template terms directly if available (skip AI call)
    if (useTemplateTerms) {
      sectionPromises.push(Promise.resolve(templateContent!.terms));
    } else {
      sectionPromises.push(
        promptClaude(
          textSystemPrompt,
          `Write professional terms and conditions for a ${input.service_type || "consulting"} proposal. Include these sections separated by blank lines:

Payment Terms - 50% upfront, 50% on completion
Revisions - what's included
Intellectual Property - transfer upon payment
Confidentiality - mutual obligations
Cancellation - notice period and refund terms

Use section headings in ALL CAPS followed by the content. Plain text only, no JSON wrapping, no markdown, no bold markers.`
        )
      );
    }

    // About Us — optional per template config
    if (includeAboutUs) {
      sectionPromises.push(
        promptClaude(
          textSystemPrompt,
          `Write a compelling "About Us / Why Choose Us" section for a proposal.

Company: ${profile.company_name || profile.full_name}
Bio: ${profile.bio || "Experienced professional"}
Key selling points: ${plan.key_selling_points.join(", ")}

Write 2-3 paragraphs. Plain text only, no JSON wrapping, no markdown.`
        )
      );
    } else {
      sectionPromises.push(Promise.resolve(""));
    }

    const [executiveSummaryRaw, understandingRaw, termsRaw, aboutUsRaw] = await Promise.all(sectionPromises);

    const executiveSummary = cleanTextResponse(executiveSummaryRaw);
    const understanding = includeUnderstanding ? cleanTextResponse(understandingRaw) : null;
    const terms = useTemplateTerms ? termsRaw : cleanTextResponse(termsRaw);
    const aboutUs = includeAboutUs ? cleanTextResponse(aboutUsRaw) : null;

    completedSteps.push("Creating timeline");
    completedSteps.push("Calculating investment");

    // Step 5: Writing executive summary
    await updateGenerationStatus(proposalId, "Writing executive summary", completedSteps, 80);

    completedSteps.push("Writing executive summary");

    // Step 6: Finalize
    await updateGenerationStatus(proposalId, "Finalizing proposal", completedSteps, 90);

    // Update the proposal with all generated content
    await supabase
      .from("proposals")
      .update({
        title: plan.title,
        status: "draft",
        executive_summary: executiveSummary,
        understanding: understanding,
        scope_of_work: plan.scope_items as ScopeItem[],
        deliverables: plan.deliverables as Deliverable[],
        timeline: plan.timeline_phases as TimelinePhase[],
        investment: {
          line_items: plan.line_items as LineItem[],
          total_cents: plan.suggested_investment_cents,
          currency: "usd",
        },
        terms: terms,
        about_us: aboutUs,
        generation_metadata: {
          current_step: "Complete",
          completed_steps: [...completedSteps, "Finalizing proposal"],
          progress: 100,
        },
      } as Record<string, unknown>)
      .eq("id", proposalId);

    // Update client proposal_count if a client was linked
    if (clientId) {
      const { count } = await supabase
        .from("proposals")
        .select("id", { count: "exact" })
        .eq("client_id", clientId);
      await supabase
        .from("clients")
        .update({ proposal_count: count ?? 1 } as Record<string, unknown>)
        .eq("id", clientId);
    }
  } catch (error) {
    console.error("Proposal generation error:", error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    await supabase
      .from("proposals")
      .update({
        status: "draft",
        generation_metadata: {
          current_step: "Error",
          completed_steps: completedSteps,
          progress: 0,
          error: errorMessage,
        },
      } as Record<string, unknown>)
      .eq("id", proposalId);
  }
}
