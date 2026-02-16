export type ProposalStatus =
  | "generating"
  | "draft"
  | "review"
  | "sent"
  | "accepted"
  | "declined"
  | "expired";

export type PlanType = "free" | "pro" | "agency";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  company_logo_url: string | null;
  brand_color: string;
  brand_accent: string;
  website: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  plan: PlanType;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  proposal_count: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  company: string | null;
  website: string | null;
  industry: string | null;
  phone: string | null;
  notes: string | null;
  proposal_count: number;
  total_value_cents: number;
  created_at: string;
  updated_at: string;
}

export interface LineItem {
  description: string;
  amount_cents: number;
}

export interface Investment {
  line_items: LineItem[];
  total_cents: number;
  currency: string;
}

export interface ScopeItem {
  title: string;
  description: string;
}

export interface Deliverable {
  title: string;
  description: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  description: string;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface GenerationMetadata {
  current_step: string;
  completed_steps: string[];
  progress: number;
  error?: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  status: ProposalStatus;
  client_brief: string | null;
  client_company: string | null;
  client_name: string | null;
  client_email: string | null;
  executive_summary: string | null;
  understanding: string | null;
  scope_of_work: ScopeItem[];
  deliverables: Deliverable[];
  timeline: TimelinePhase[];
  investment: Investment;
  terms: string | null;
  about_us: string | null;
  custom_sections: CustomSection[];
  valid_until: string | null;
  share_token: string | null;
  share_enabled: boolean;
  pdf_url: string | null;
  template_id: string | null;
  layout: string | null;
  template_color_primary: string | null;
  template_color_accent: string | null;
  generation_metadata: GenerationMetadata | null;
  sent_at: string | null;
  viewed_at: string | null;
  responded_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  is_default: boolean;
  content: Record<string, unknown>;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export type { TemplateContent, SystemTemplate } from "@/lib/templates/types";

export interface ActivityLog {
  id: string;
  user_id: string;
  proposal_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  totalProposals: number;
  pendingReview: number;
  acceptedThisMonth: number;
  revenueThisMonth: number;
  proposalsThisWeek: number;
  acceptanceRate: number;
  revenueChange: number;
}
