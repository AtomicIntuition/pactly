export type PricingModel = "fixed" | "hourly" | "retainer" | "milestone" | "tiered";

export type ProposalLayout = "modern" | "classic" | "bold" | "minimal";

export interface TemplateColorScheme {
  primary: string;
  accent: string;
}

export interface TemplateAIGuidance {
  tone: string;
  industry_context: string;
  pricing_guidance: string;
  pricing_model: PricingModel;
  style_notes: string;
}

export interface TemplateContent {
  color_scheme: TemplateColorScheme;
  layout: ProposalLayout;
  terms: string;
  ai_guidance: TemplateAIGuidance;
  section_config: {
    include_understanding: boolean;
    include_about_us: boolean;
  };
}

export interface SystemTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  content: TemplateContent;
}
