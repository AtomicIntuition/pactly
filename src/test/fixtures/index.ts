import type { Profile, Proposal, Client } from "@/types";

export function mockProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    full_name: "Test User",
    email: "test@example.com",
    company_name: "Test Agency",
    company_logo_url: null,
    website: "https://testagency.com",
    phone: "+1234567890",
    address: "123 Test St",
    bio: "We are an experienced agency.",
    brand_color: "#d4a853",
    brand_accent: "#e5b868",
    plan: "free",
    stripe_customer_id: null,
    stripe_subscription_id: null,
    proposal_count: 2,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function mockProposal(overrides: Partial<Proposal> = {}): Proposal {
  return {
    id: "proposal-1",
    user_id: "user-1",
    title: "Website Redesign Proposal",
    status: "draft",
    client_brief: "We need a complete website redesign for our SaaS product.",
    client_name: "John Smith",
    client_email: "john@acme.com",
    client_company: "Acme Corp",
    client_id: null,
    template_id: null,
    template_color_primary: null,
    template_color_accent: null,
    layout: "modern",
    executive_summary: "This proposal outlines our approach to redesigning your website.",
    understanding: "We understand your need for a modern, responsive website.",
    scope_of_work: [
      { title: "UX Research", description: "User interviews and competitive analysis" },
      { title: "UI Design", description: "Wireframes and high-fidelity mockups" },
    ],
    deliverables: [
      { title: "Design System", description: "Complete design system in Figma" },
      { title: "Responsive Website", description: "Fully coded responsive site" },
    ],
    timeline: [
      { phase: "Discovery", duration: "2 weeks", description: "Research and planning" },
      { phase: "Design", duration: "3 weeks", description: "UI/UX design" },
      { phase: "Development", duration: "4 weeks", description: "Frontend development" },
    ],
    investment: {
      line_items: [
        { description: "UX Research", amount_cents: 500000 },
        { description: "UI Design", amount_cents: 800000 },
        { description: "Development", amount_cents: 1200000 },
      ],
      total_cents: 2500000,
      currency: "usd",
    },
    terms: "Payment: 50% upfront, 50% upon completion.",
    about_us: "We are a full-service digital agency.",
    custom_sections: [],
    valid_until: "2025-03-01",
    share_token: null,
    share_enabled: false,
    pdf_url: null,
    view_count: 0,
    viewed_at: null,
    sent_at: null,
    signature_name: null,
    signature_ip: null,
    signed_at: null,
    responded_at: null,
    generation_metadata: null,
    created_at: "2025-01-15T10:00:00.000Z",
    updated_at: "2025-01-15T10:00:00.000Z",
    ...overrides,
  };
}

export function mockClient(overrides: Partial<Client> = {}): Client {
  return {
    id: "client-1",
    user_id: "user-1",
    name: "John Smith",
    email: "john@acme.com",
    company: "Acme Corp",
    website: "https://acme.com",
    industry: "Technology",
    phone: "+1234567890",
    notes: "Key decision maker",
    proposal_count: 3,
    total_value_cents: 7500000,
    created_at: "2025-01-01T00:00:00.000Z",
    updated_at: "2025-01-01T00:00:00.000Z",
    ...overrides,
  };
}
