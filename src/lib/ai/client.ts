import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });
  }
  return anthropicClient;
}

export async function promptClaude(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    maxTokens?: number;
    useExtendedThinking?: boolean;
    budgetTokens?: number;
  }
): Promise<string> {
  const client = getAnthropicClient();
  const maxTokens = options?.maxTokens ?? 4096;

  if (options?.useExtendedThinking) {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 16000,
      thinking: {
        type: "enabled",
        budget_tokens: options.budgetTokens ?? 8192,
      },
      messages: [
        { role: "user", content: `${systemPrompt}\n\n${userPrompt}` },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock ? textBlock.text : "";
}
