import type { SystemTemplate, ProposalLayout } from "./types";
import type { Proposal, Profile } from "@/types";

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    id: "web-development",
    name: "Web Development",
    description: "Modern websites, web apps, and full-stack development projects with milestone-based pricing.",
    category: "Web Development",
    icon: "Globe",
    content: {
      color_scheme: { primary: "#0f172a", accent: "#3b82f6" },
      layout: "modern",
      terms: `PAYMENT SCHEDULE
A 30% deposit is required before work begins. 30% is due upon completion of the development milestone, and the remaining 40% upon final delivery and launch sign-off. Invoices are net-14.

CHANGE ORDERS
Two rounds of design revisions and one round of development revisions are included. Additional revisions or feature changes are quoted separately and require written approval via our change-order process before implementation begins.

INTELLECTUAL PROPERTY
All custom source code, design files, and content produced for this project transfer to the client upon receipt of final payment. Third-party licenses (fonts, stock imagery, plugins) remain subject to their respective terms.

PERFORMANCE & ACCESSIBILITY
We target a Lighthouse performance score of 90+ and WCAG 2.1 AA compliance. Post-launch performance is subject to the client's hosting environment and content additions.

HOSTING & MAINTENANCE
This proposal covers development only. Hosting, DNS, SSL, and ongoing maintenance are the client's responsibility unless a separate retainer is arranged. We will recommend infrastructure suited to the project's traffic profile.

CANCELLATION
Either party may terminate with 14 days written notice. Completed work is invoiced at the pro-rated milestone value and is non-refundable. All deliverables completed to that point transfer to the client upon payment.`,
      ai_guidance: {
        tone: "Technical yet approachable. Demonstrate deep knowledge of web technologies while keeping explanations accessible to non-technical stakeholders. Use specific technology names confidently.",
        industry_context: "Web development project. Address Core Web Vitals targets (LCP < 2.5s, CLS < 0.1), responsive breakpoints, WCAG 2.1 AA accessibility, semantic HTML, SSR/SSG trade-offs, CI/CD pipeline, and CDN strategy. Mention framework choices only when they solve a stated problem.",
        pricing_guidance: "Milestone-based pricing tied to Discovery/Design, Frontend Development, Backend/Integration, and Testing/Launch. Weight the development phase at ~35% of total. Include a separate line for QA/launch support. Typical range for a custom site: $15K-$40K.",
        pricing_model: "milestone",
        style_notes: "Open the executive summary with a quantified business problem, not a service description. Lead with outcomes (conversion lift, page-speed gains) before listing technologies. Include a success-metrics section after the timeline.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "mobile-app",
    name: "Mobile App Development",
    description: "iOS, Android, and cross-platform mobile applications with iterative development milestones.",
    category: "Mobile App",
    icon: "Smartphone",
    content: {
      color_scheme: { primary: "#1e1b4b", accent: "#818cf8" },
      layout: "bold",
      terms: `PAYMENT SCHEDULE
25% deposit upon signing. 25% upon design and prototype approval. 25% upon feature-complete build. 25% upon app-store submission and final delivery. Invoices are net-14.

REVISIONS & SCOPE
Two rounds of UI/UX design revisions are included. Feature changes after sprint development begins are assessed for scope impact and quoted via a change-order document. All change requests must be submitted in writing.

APP STORE SUBMISSION
We prepare and submit the application to the Apple App Store and/or Google Play Store. Review timelines are controlled by Apple and Google and cannot be guaranteed. The client maintains developer accounts and pays associated annual fees.

INTELLECTUAL PROPERTY
All source code and design assets become the client's property upon final payment. We retain the right to showcase the project in our portfolio unless otherwise agreed in writing.

WARRANTY & POST-LAUNCH SUPPORT
A 30-day warranty covers bugs directly caused by our development. OS updates, third-party SDK breaking changes, and feature enhancements are excluded and can be arranged under a maintenance retainer.

CANCELLATION
Either party may terminate with 21 days written notice. Completed sprints are invoiced in full. Source code transfers only after all outstanding invoices are settled.`,
      ai_guidance: {
        tone: "Innovative and product-minded. Emphasize user experience, performance budgets, and modern mobile development. Balance technical depth with product vision and user empathy.",
        industry_context: "Mobile app development. Reference platform guidelines (Apple HIG, Material Design 3), app-store review requirements, push notification architecture, offline-first patterns, deep linking, and analytics SDK integration (Firebase, Mixpanel). Consider accessibility (VoiceOver, TalkBack).",
        pricing_guidance: "Iterative milestone payments across sprints: UX/UI Design, Core Feature Development, Integration & Testing, App Store Submission. Cross-platform builds (React Native, Flutter) typically save 30-40% vs native dual-platform. Typical MVP range: $30K-$60K.",
        pricing_model: "milestone",
        style_notes: "Emphasize user engagement metrics and retention benchmarks. Reference specific platforms and their guidelines. Include a post-launch roadmap section showing the path from MVP to v2.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "brand-identity",
    name: "Brand & Identity Design",
    description: "Logo design, brand guidelines, visual identity systems, and creative direction.",
    category: "Design",
    icon: "Palette",
    content: {
      color_scheme: { primary: "#1c1917", accent: "#f59e0b" },
      layout: "minimal",
      terms: `PAYMENT SCHEDULE
This is a fixed-fee engagement. 50% is due upon signing to begin discovery and concept development. 50% is due upon delivery of the final brand package. Invoices are net-14.

CREATIVE PROCESS & REVISIONS
The process includes a discovery workshop, three initial concept directions, and two rounds of refinement on the selected direction. Additional concepts or refinement rounds beyond this scope are billed at our standard day rate.

INTELLECTUAL PROPERTY
Upon full payment, all original artwork, logos, and brand assets become the client's exclusive property. Preliminary concepts not selected remain the designer's property. We retain portfolio usage rights.

USAGE RIGHTS
The final brand package includes unlimited usage rights across all media. Licensed typefaces or stock imagery included in the system may require the client to purchase extended licenses separately.

BRAND GUIDELINES
Deliverables include a comprehensive brand-guidelines document covering logo usage rules, color palette (Pantone, CMYK, RGB, HEX), typography hierarchy, imagery direction, and real-world application examples.

CANCELLATION
Cancellation during the concept phase retains 50% of the total fee. Cancellation after concept approval requires payment in full. All completed work transfers upon payment.`,
      ai_guidance: {
        tone: "Creative and visionary. Speak to the strategic power of brand identity beyond aesthetics. Use design vocabulary naturally — kerning, visual hierarchy, brand architecture — without being pretentious.",
        industry_context: "Brand identity project. Consider brand strategy, competitive audit, audience personas, cross-platform consistency (digital, print, environmental), color psychology, and trademark clearance. Think about responsive logo systems and motion identity.",
        pricing_guidance: "Fixed-fee for the complete brand package. Break deliverables clearly: logo suite (primary, secondary, icon, responsive), color system (Pantone + digital), typography (2 families), brand guidelines (40+ pages), and starter templates. Typical range: $8K-$25K.",
        pricing_model: "fixed",
        style_notes: "Lead with brand strategy and competitive positioning. Describe the creative process as a structured journey, not an artistic whim. Quantify deliverables precisely.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing Campaign",
    description: "SEO, PPC, social media campaigns, and digital marketing strategy with monthly retainer pricing.",
    category: "Marketing",
    icon: "TrendingUp",
    content: {
      color_scheme: { primary: "#052e16", accent: "#22c55e" },
      layout: "modern",
      terms: `PAYMENT SCHEDULE
Monthly retainer billed on the 1st. The first month's retainer is due upon signing. Ad-spend budgets are billed separately and require written pre-approval for any spend exceeding the agreed monthly allocation.

REPORTING & METRICS
Monthly performance reports are delivered by the 5th, covering KPIs, channel performance, spend breakdowns, and next-month recommendations. Quarterly business reviews provide deeper analysis and strategy pivots.

AD SPEND & MEDIA BUYING
Media budgets are separate from the management retainer. All ad spend is invoiced at cost — we do not mark up media. Client-owned ad accounts are preferred; we will manage them via delegated access.

MINIMUM ENGAGEMENT
The minimum engagement period is three months to allow for proper optimization cycles. After the initial period, either party may terminate with 30 days written notice.

INTELLECTUAL PROPERTY
Campaign strategies, ad creatives, and content produced during the engagement belong to the client. Proprietary tools, frameworks, and methodologies remain our property.

RESULTS DISCLAIMER
We commit to best-in-class execution and continuous optimization, but specific outcomes (rankings, conversion rates, revenue) cannot be guaranteed. Performance depends on market conditions, competition, budget levels, and product-market fit.`,
      ai_guidance: {
        tone: "Data-driven and results-oriented. Use marketing metrics fluently — CPA, ROAS, MQL, LTV:CAC. Balance strategic thinking with tactical specifics. Every claim should imply measurability.",
        industry_context: "Digital marketing. Address channel mix (SEO, PPC, paid social, email, programmatic), attribution modeling, GA4 event tracking, conversion-rate optimization, landing-page strategy, and competitive SERP analysis. Reference platform-specific best practices (Google Ads Quality Score, Meta Advantage+).",
        pricing_guidance: "Monthly retainer with clear scope per month. Separate ad spend from management fees. Include a one-time setup/audit fee in month one. Typical retainer range: $3K-$8K/month plus ad spend.",
        pricing_model: "retainer",
        style_notes: "Open with business KPIs and current baseline metrics. Present a measurement framework early. Include a 90-day ramp plan showing expected progression from audit to optimization to scale.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "consulting-advisory",
    name: "Consulting & Advisory",
    description: "Strategic consulting, business advisory, and professional services billed hourly.",
    category: "Consulting",
    icon: "Briefcase",
    content: {
      color_scheme: { primary: "#1e293b", accent: "#94a3b8" },
      layout: "classic",
      terms: `PAYMENT SCHEDULE
Consulting services are billed at the agreed hourly rate in 15-minute increments. Invoices are issued bi-weekly and payable within 14 days. Travel and pre-approved expenses are billed at cost.

SCOPE & ENGAGEMENT
This proposal outlines expected scope and estimated hours. Actual hours may vary based on findings. We communicate proactively if the engagement trends beyond estimate and seek written approval before exceeding it by more than 10%.

SCHEDULING & CANCELLATION POLICY
Sessions are scheduled at mutually convenient times. Cancellations within 24 hours are billed at 50% of scheduled time. No-shows are billed in full.

DELIVERABLES
Key findings and recommendations are documented in written deliverables as specified. Verbal advice and working sessions are included in the hourly rate. Additional documentation is quoted separately.

CONFIDENTIALITY
All information shared is treated as strictly confidential. Neither party will disclose the other's proprietary information without written consent. A mutual NDA is available upon request.

LIMITATION OF LIABILITY
Advisory services are provided in good faith based on professional expertise. Implementation decisions remain the client's responsibility. Liability is limited to fees paid for the specific engagement phase in question.`,
      ai_guidance: {
        tone: "Authoritative and strategic. Project executive-level thinking and deep expertise. Be direct, concise, and value-focused. Avoid jargon for jargon's sake — use business terminology only when it adds precision.",
        industry_context: "Strategic consulting. Consider the client's competitive landscape, organizational readiness, regulatory environment, and implementation feasibility. Reference frameworks (Porter's Five Forces, Jobs-to-be-Done, RICE scoring) only when directly applicable.",
        pricing_guidance: "Hourly rate with estimated total hours. Break down by activity phase: discovery interviews, analysis, strategy development, executive presentation, and optional implementation support. Provide a not-to-exceed cap. Typical senior rates: $200-$400/hr.",
        pricing_model: "hourly",
        style_notes: "Lead with a crisp diagnosis of the client's strategic challenge. Demonstrate industry knowledge through specific, relevant observations. Focus on actionable recommendations, not theoretical frameworks. Every section should answer 'so what?'.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "content-strategy",
    name: "Content & Copywriting",
    description: "Content strategy, copywriting, blog content, and editorial services with tiered packages.",
    category: "Writing",
    icon: "PenTool",
    content: {
      color_scheme: { primary: "#431407", accent: "#f97316" },
      layout: "classic",
      terms: `PAYMENT SCHEDULE
Tiered packages are billed monthly on the 1st. One-time projects require 50% upfront and 50% upon delivery. The first month is due upon signing.

CONTENT APPROVAL WORKFLOW
All content follows a structured workflow: outline, first draft, revision, final approval. The client has 5 business days to provide feedback at each stage. Delays in client approval may shift the delivery schedule accordingly.

REVISIONS
Each content piece includes one round of revisions based on the original brief. Requests that constitute a new direction (different audience, topic, or format) are treated as a new piece and quoted separately.

CONTENT OWNERSHIP
Upon payment, all content becomes the client's exclusive property. Ghostwritten content is never attributed to us. We may reference the engagement (not the content itself) in our portfolio.

BRAND VOICE & STYLE
We develop or adopt a brand-voice guide at engagement start. Mid-engagement voice pivots may require an additional discovery session billed at our standard rate.

CANCELLATION
Monthly engagements may be cancelled with 30 days notice. Content in production at cancellation will be completed and invoiced. Pre-paid but unproduced content is refunded.`,
      ai_guidance: {
        tone: "Articulate and compelling. Demonstrate mastery of language and audience psychology. Show how strategic content drives pipeline and revenue, not just 'brand awareness.' The proposal itself should exemplify the writing quality on offer.",
        industry_context: "Content strategy and copywriting. Address content pillars, audience segmentation, SEO keyword clusters, editorial calendar cadence, distribution channels (owned, earned, paid), content repurposing strategy, and performance metrics (organic sessions, time-on-page, conversion-assisted revenue).",
        pricing_guidance: "Tiered packages with clear value progression: Starter (4 blog posts/mo), Growth (+ email sequences + social), Scale (+ whitepapers + thought leadership). Show per-piece unit economics. Typical blog post: $500-$1,200; monthly retainer: $3K-$8K.",
        pricing_model: "tiered",
        style_notes: "Demonstrate writing quality in the proposal itself — no filler sentences. Include a content-strategy framework diagram. Reference specific content types and map them to funnel stages (TOFU, MOFU, BOFU).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "ecommerce",
    name: "E-Commerce Solution",
    description: "Online stores, payment integration, and e-commerce platforms with milestone delivery.",
    category: "Web Development",
    icon: "ShoppingCart",
    content: {
      color_scheme: { primary: "#0c2340", accent: "#06b6d4" },
      layout: "modern",
      terms: `PAYMENT SCHEDULE
Milestone-based: 25% upon signing, 25% upon design approval, 25% upon development completion, 25% upon launch. Invoices are net-14.

PLATFORM & INTEGRATIONS
The solution includes integration with the specified payment gateway and shipping providers. Additional third-party integrations (ERP, CRM, marketplace feeds) are quoted separately via change order.

PRODUCT DATA
The client provides product data (descriptions, images, pricing, SKUs, categories) in the agreed template format. Data migration from an existing platform can be arranged for an additional fee.

PCI DSS COMPLIANCE & SECURITY
The store is built with PCI DSS compliance requirements in mind — tokenized payment processing, TLS encryption, and secure admin access. The client is responsible for maintaining PCI compliance post-launch, including annual SAQ completion.

TESTING & LAUNCH
QA includes payment-flow testing (including refund paths), cross-browser compatibility, mobile responsiveness, and load testing. A staging environment is provided for UAT before go-live.

CANCELLATION
Either party may terminate with 14 days written notice. Completed work is invoiced at the pro-rated milestone value. Code and assets transfer upon payment.`,
      ai_guidance: {
        tone: "Business-savvy and technically sharp. Focus on revenue impact, AOV growth, and conversion-rate optimization. Balance technical architecture with commercial outcomes.",
        industry_context: "E-commerce development. Address PCI DSS compliance, payment-gateway selection (Stripe, PayPal, Klarna), shipping API integration, inventory sync, faceted search, product-information management, checkout abandonment reduction, and mobile conversion optimization. Consider headless vs monolithic architecture trade-offs.",
        pricing_guidance: "Milestone-based: Discovery, Design, Core Commerce Build, Integrations & QA, Launch & Optimization. Factor in payment-gateway setup fees and data migration. Typical custom e-commerce build: $20K-$50K.",
        pricing_model: "milestone",
        style_notes: "Open with revenue opportunity and conversion benchmarks. Reference specific e-commerce metrics (AOV, cart abandonment rate, mobile conversion gap). Include a post-launch optimization roadmap.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "saas-product",
    name: "SaaS / Product Development",
    description: "Software-as-a-service products, MVPs, and full product development with sprint-based milestones.",
    category: "Mobile App",
    icon: "Layers",
    content: {
      color_scheme: { primary: "#0c0a09", accent: "#a855f7" },
      layout: "modern",
      terms: `PAYMENT SCHEDULE
20% deposit upon signing covers discovery and architecture. Subsequent payments are invoiced at the end of each 2-week sprint. Invoices are net-14.

AGILE PROCESS
We follow a modified Scrum process with 2-week sprints. Each sprint includes planning, daily stand-ups (async optional), development, review, and retrospective. The client participates in sprint reviews and has backlog-refinement input.

SCOPE MANAGEMENT
The product backlog is a living document. Features may be re-prioritized between sprints. Significant scope additions mid-sprint are deferred to the next planning session to protect velocity.

SOURCE CODE & IP
All source code, documentation, and product assets are the client's exclusive property upon payment. Code is pushed to the client's repository throughout development. We retain the right to use general, non-proprietary techniques.

INFRASTRUCTURE
Development and staging environments are included. Production infrastructure (cloud hosting, databases, CDN, monitoring, error tracking) is provisioned on the client's cloud accounts. Estimated monthly infrastructure costs are provided separately.

CANCELLATION
Either party may terminate with 30 days notice, aligned to a sprint boundary. Completed sprints are invoiced in full. In-progress sprints are billed pro-rata.`,
      ai_guidance: {
        tone: "Product-minded and strategic. Think like a fractional CTO. Focus on user problems, market validation, and technical scalability. Use lean/startup vocabulary naturally without being preachy.",
        industry_context: "SaaS product development. Address user research findings, MVP scoping (MoSCoW prioritization), multi-tenant architecture, subscription billing (Stripe Billing), onboarding flows, feature flags, observability (error tracking, APM), and scalability path from 100 to 10K users.",
        pricing_guidance: "Sprint-based with a discovery phase upfront. Phases: Discovery & Architecture, MVP Core (2-3 sprints), Iteration & Polish (1-2 sprints), Launch Prep. Show sprint cost and expected velocity. Typical MVP: $40K-$80K over 10-14 weeks.",
        pricing_model: "milestone",
        style_notes: "Lead with the user problem and market insight, not technology. Reference lean methodology. Include a technical-architecture summary and a scalability section. Show the path from MVP to product-market fit.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "social-media",
    name: "Social Media Management",
    description: "Social media strategy, content creation, community management, and analytics with monthly retainers.",
    category: "Marketing",
    icon: "Share2",
    content: {
      color_scheme: { primary: "#831843", accent: "#ec4899" },
      layout: "bold",
      terms: `PAYMENT SCHEDULE
Monthly retainer billed on the 1st. The first month is due upon signing. Paid promotion budgets are separate and require written pre-approval for spend above the agreed allocation.

CONTENT CREATION & POSTING
The retainer includes the agreed number of posts per platform per month. Content is produced in advance and submitted via a shared content calendar. The client has 48 hours to approve or request changes before the scheduled publish date.

COMMUNITY MANAGEMENT
We monitor and respond to comments, messages, and mentions during business hours (Mon-Fri, 9am-6pm local). After-hours and crisis-communication coverage is available as an add-on.

PLATFORM ACCESS
We manage agreed platforms via delegated business-manager access. We never request personal login credentials. The client retains full ownership of all accounts.

REPORTING
Monthly analytics reports are delivered by the 5th covering engagement, reach, follower growth, content performance, and competitive benchmarks. Quarterly strategy reviews reassess direction and tactics.

CANCELLATION
Minimum engagement is two months. After the initial period, either party may terminate with 30 days notice. Scheduled content at cancellation is completed as planned.`,
      ai_guidance: {
        tone: "Creative, trend-aware, and data-informed. Speak to community building and brand personality. Balance creative ambition with measurable outcomes. Use platform-native language naturally.",
        industry_context: "Social media management. Address platform-specific strategies (Reels vs TikTok vs Shorts), content formats (carousels, Stories, live), community engagement tactics, influencer collaboration frameworks, paid social amplification, and social listening tools. Reference algorithm signals that drive organic reach.",
        pricing_guidance: "Monthly retainer with deliverables per platform. Separate content creation from paid-media management. Include onboarding/audit costs in month one. Typical retainer: $2K-$6K/month depending on platform count and posting frequency.",
        pricing_model: "retainer",
        style_notes: "Reference specific platforms, formats, and posting cadences. Include a sample week from the content calendar. Lead with community and brand-building outcomes over vanity metrics (reach without engagement is meaningless).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "video-production",
    name: "Video & Motion Production",
    description: "Video production, motion graphics, and multimedia content with fixed project pricing.",
    category: "Media",
    icon: "Video",
    content: {
      color_scheme: { primary: "#171717", accent: "#ef4444" },
      layout: "bold",
      terms: `PAYMENT SCHEDULE
Fixed-fee project: 40% upon signing (pre-production), 30% upon completion of principal photography or animation, 30% upon delivery of final masters. Invoices are net-14.

PRE-PRODUCTION
Pre-production includes concept development, scriptwriting, storyboarding, location scouting, casting, and crew coordination. Client approval on the creative concept is required before production begins.

PRODUCTION & SHOOT DAYS
The proposal includes the specified number of shoot days. Additional days are available at the standard day rate. Weather delays for outdoor shoots are rescheduled at no additional cost (one reschedule included).

POST-PRODUCTION & REVISIONS
Post-production includes editing, color grading, sound design/mix, and motion graphics as specified. Two revision rounds are included. Additional rounds are billed at the hourly post rate.

RAW FOOTAGE & PROJECT FILES
Final deliverables are included in the project fee. Raw footage and editable project files can be provided for an additional archival/transfer fee. We retain raw footage for 90 days post-delivery.

USAGE & LICENSING
The client receives unlimited usage rights for the platforms specified in scope. Expanded usage (broadcast, theatrical, third-party licensing) is quoted separately. Talent usage rights beyond the agreed term require re-licensing.

CANCELLATION
Cancellation during pre-production retains 40% of the total. Cancellation during or after production requires the full production milestone. Post-production cancellation requires payment in full. Completed materials transfer upon payment.`,
      ai_guidance: {
        tone: "Cinematic and professional. Convey creative vision while demonstrating production expertise. Balance artistic ambition with logistical precision. Use production terminology naturally — shot lists, color LUTs, sound mix, deliverable specs.",
        industry_context: "Video and motion production. Address concept development, scripting, storyboarding, production logistics (crew, gear, locations), post-production workflow (offline edit, online conform, color, audio), deliverable formats (4K ProRes masters, H.264 web, vertical social cuts), and distribution strategy. Consider LUFS standards for broadcast vs web.",
        pricing_guidance: "Fixed project pricing across pre-production, production (day rate x days), and post-production. Factor in equipment, crew, talent, locations, music licensing, and post complexity. Typical brand video package: $12K-$25K.",
        pricing_model: "fixed",
        style_notes: "Paint the creative vision vividly in the executive summary. Include a detailed deliverables spec (resolution, codec, aspect ratios, duration). Reference distribution strategy and format optimization per channel.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "ui-ux-design",
    name: "UI/UX Design",
    description: "User research, interface design, prototyping, and design systems for digital products.",
    category: "Design",
    icon: "Layout",
    content: {
      color_scheme: { primary: "#172554", accent: "#38bdf8" },
      layout: "minimal",
      terms: `PAYMENT SCHEDULE
Fixed-fee engagement: 40% upon signing to begin research and discovery, 30% upon delivery of wireframes and prototype, 30% upon delivery of final high-fidelity designs and design system. Invoices are net-14.

RESEARCH & DISCOVERY
The research phase includes stakeholder interviews, user interviews or surveys, competitive analysis, and heuristic evaluation. Findings are documented in a research report that informs all subsequent design decisions.

DESIGN PROCESS & REVISIONS
The design process follows: research, information architecture, wireframes, interactive prototype, visual design, and handoff. Two rounds of revisions are included at the wireframe stage and two at the visual-design stage. Additional rounds are billed at the standard day rate.

USABILITY TESTING
If included in scope, usability testing covers recruitment of 5-8 participants, moderated sessions, analysis, and a findings report with prioritized recommendations.

DESIGN SYSTEM & HANDOFF
Final deliverables include a component-based design system in Figma with developer-ready specs, spacing tokens, and interaction annotations. We provide a developer walkthrough session at handoff.

INTELLECTUAL PROPERTY
All design files, prototypes, and research artifacts become the client's property upon final payment. We retain portfolio usage rights.

CANCELLATION
Cancellation during research retains 40% of the total fee. After wireframe delivery, 70% is retained. After visual design delivery, full payment is required.`,
      ai_guidance: {
        tone: "Empathetic and evidence-based. Center every recommendation on user needs and usability data. Use UX vocabulary precisely — heuristics, cognitive load, information scent, task-completion rate — without being academic.",
        industry_context: "UI/UX design. Address user research methods (interviews, surveys, usability testing), information architecture, wireframing, interactive prototyping (Figma), visual design systems (tokens, components), accessibility (WCAG 2.1 AA), and developer handoff. Consider HIPAA or ADA compliance if relevant to the client's industry.",
        pricing_guidance: "Fixed-fee across phases: Research & Discovery, IA & Wireframes, Visual Design & Prototype, Design System & Handoff. Optional add-on for usability testing. Typical product redesign: $25K-$50K.",
        pricing_model: "fixed",
        style_notes: "Lead with the user problem and research methodology, not deliverables. Include a process diagram showing the design phases. Reference specific usability metrics (task success rate, SUS score). Quantify the business impact of better UX (support-ticket reduction, conversion lift).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "seo-analytics",
    name: "SEO & Analytics",
    description: "Technical SEO audits, analytics implementation, content optimization, and organic growth strategy.",
    category: "Marketing",
    icon: "Search",
    content: {
      color_scheme: { primary: "#1a2e05", accent: "#84cc16" },
      layout: "classic",
      terms: `PAYMENT SCHEDULE
One-time audit and setup fees are due upon signing. Monthly management is billed on the 1st. The minimum engagement for ongoing management is three months.

REPORTING & ACCESS
Monthly SEO performance reports are delivered by the 5th, covering rankings, organic traffic, technical health, and content performance. The client will provide Google Search Console and GA4 access via delegated permissions.

TECHNICAL IMPLEMENTATION
Technical SEO recommendations (schema markup, page-speed fixes, crawl-budget optimization) may require developer resources on the client's side. We provide detailed implementation specifications; the client is responsible for deploying changes unless development support is included in scope.

CONTENT OPTIMIZATION
Content recommendations (new pages, rewrites, meta-tag updates) are provided as briefs. Content writing is included only if explicitly scoped. We do not guarantee specific ranking positions — SEO is influenced by hundreds of factors outside our control.

LINK BUILDING
Any link-building activities follow white-hat practices in compliance with Google's spam policies. We do not purchase links, use PBNs, or engage in manipulative link schemes.

CANCELLATION
After the minimum three-month period, either party may cancel with 30 days notice. Final reports and documentation are delivered upon termination.`,
      ai_guidance: {
        tone: "Analytical and authoritative. Speak in data, not promises. Use SEO terminology precisely — crawl budget, index bloat, topical authority, E-E-A-T, search intent — and back every recommendation with a rationale.",
        industry_context: "SEO and analytics. Address technical SEO (Core Web Vitals, crawlability, structured data, international SEO if applicable), GA4 event-based tracking model, content gap analysis, SERP feature targeting (featured snippets, People Also Ask), and competitive keyword mapping. Reference Google's latest algorithm updates and quality guidelines.",
        pricing_guidance: "Setup fee for audit + GA4 configuration, then monthly retainer for ongoing management. Typical audit: $3K-$6K. Monthly management: $3K-$6K/month. Break out technical SEO, content strategy, and reporting as separate line items.",
        pricing_model: "retainer",
        style_notes: "Open with current organic performance baseline and opportunity gap. Include a keyword-opportunity matrix or traffic-projection model. Present a 6-month roadmap with expected milestones (indexation fixes in month 1, content velocity in month 2-3, ranking momentum in month 4-6).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "photography",
    name: "Photography",
    description: "Product photography, lifestyle shoots, headshots, and visual content creation.",
    category: "Design",
    icon: "Camera",
    content: {
      color_scheme: { primary: "#1a1a1a", accent: "#2dd4bf" },
      layout: "minimal",
      terms: `PAYMENT SCHEDULE
Fixed-fee project: 50% deposit upon signing to reserve the shoot date(s), 50% upon delivery of the final edited images. Invoices are net-14.

USAGE RIGHTS
The standard package includes digital usage rights for the client's own marketing channels (website, social media, email, print collateral). Extended licensing for third-party use, advertising, or resale is quoted separately. The photographer retains copyright and grants a license — this is industry standard.

MODEL RELEASES
If the shoot involves recognizable individuals, model releases are required. We provide standard release forms. The client is responsible for obtaining releases from their employees or customers. Professional talent model releases are handled by us.

RAW FILES
Edited, high-resolution final images are included. RAW/unedited files are not included in the standard package but may be purchased separately. We retain RAW files for 12 months post-delivery.

SHOOT LOGISTICS
The quoted fee covers the specified shoot days, equipment, and post-processing. Location fees, permits, prop rentals, styling, and professional talent are the client's responsibility unless explicitly included in scope.

CANCELLATION & RESCHEDULING
Cancellations more than 14 days before the shoot date receive a full deposit refund minus a 15% booking fee. Cancellations within 14 days forfeit the deposit. One reschedule is permitted at no charge with 7+ days notice.

WEATHER
For outdoor shoots, one weather-delay reschedule is included at no additional cost. The photographer makes the call on weather suitability.`,
      ai_guidance: {
        tone: "Visual and precise. Communicate a strong creative eye while being practical about logistics. Reference composition, lighting, and post-processing style in concrete terms — not vague descriptors like 'stunning' or 'beautiful.'",
        industry_context: "Photography. Address shoot planning (mood boards, shot lists, location scouting), lighting setups (natural, studio strobe, continuous), post-processing workflow (culling, retouching, color grading), deliverable specs (resolution, color profile, file format), and usage-rights licensing structure. For product photography, consider e-commerce requirements (white background, lifestyle context, 360-degree).",
        pricing_guidance: "Fixed project fee covering shoot day(s) + post-processing. Break out: creative direction, shoot day rate, post-processing per final image, and any add-ons (styling, talent, location). Typical product shoot: $3K-$8K for 40-60 final images.",
        pricing_model: "fixed",
        style_notes: "Lead with the visual concept and mood direction. Include a sample shot list or mood board description. Specify deliverable count, resolution, and turnaround time. Reference the client's brand aesthetic and how the photography will reinforce it.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "public-relations",
    name: "Public Relations",
    description: "Media relations, press strategy, thought leadership, and reputation management.",
    category: "Marketing",
    icon: "Megaphone",
    content: {
      color_scheme: { primary: "#312e81", accent: "#fbbf24" },
      layout: "classic",
      terms: `PAYMENT SCHEDULE
Monthly retainer billed on the 1st. A one-time onboarding fee covers messaging development and media-list building. The minimum engagement period is three months.

NO PLACEMENT GUARANTEES
PR is earned media — we cannot guarantee specific placements, publication dates, or editorial outcomes. We guarantee effort, strategy, and access to our media network. We will provide transparent activity reports showing pitches sent, responses received, and coverage secured.

MEDIA RELATIONS
We pitch stories on the client's behalf and manage all journalist relationships. All media inquiries are routed through us during the engagement. The client agrees to make spokespeople available for interviews with reasonable notice (48 hours for non-urgent, 4 hours for breaking news).

CRISIS COMMUNICATIONS
Standard retainer does not include crisis communications. Crisis support is available as an add-on with a dedicated SLA: initial response plan within 2 hours, holding statement within 4 hours, and ongoing management at the crisis day rate.

APPROVAL PROCESS
All press materials (releases, statements, bylines) require client approval before distribution. The client commits to a 24-hour review turnaround to maintain media momentum.

CONTENT & THOUGHT LEADERSHIP
Byline articles and thought-leadership pieces are ghostwritten and placed under the client spokesperson's name. The client retains all rights to published content.

CANCELLATION
After the three-month minimum, either party may terminate with 30 days notice. We provide a transition document including media contacts, pending pitches, and outstanding opportunities.`,
      ai_guidance: {
        tone: "Strategic, media-savvy, and candid. Speak like a seasoned publicist — confident but never promising what can't be delivered. Reference media landscape realities and newsworthiness criteria honestly.",
        industry_context: "Public relations. Address media strategy, press release cadence, journalist relationship building, thought-leadership positioning, speaking opportunities, award submissions, crisis preparedness, and media monitoring/measurement (share of voice, sentiment analysis, domain authority of placements). Reference current media-consumption trends and the shift to digital-first outlets.",
        pricing_guidance: "Monthly retainer with onboarding setup fee. Break out: media strategy, proactive pitching, reactive media management, content creation (press releases, bylines), and reporting. Typical PR retainer: $5K-$10K/month. Crisis add-on: $2K-$5K/incident.",
        pricing_model: "retainer",
        style_notes: "Lead with the narrative angle — what makes the client newsworthy right now? Include a target media list outline (tier 1, tier 2, trade). Present a 90-day launch plan with specific milestones (messaging approved week 1, media outreach begins week 3, first placements expected month 2).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "event-production",
    name: "Event Production",
    description: "Conferences, summits, corporate events, and experiential productions.",
    category: "Events",
    icon: "CalendarDays",
    content: {
      color_scheme: { primary: "#3b0764", accent: "#e879f9" },
      layout: "bold",
      terms: `PAYMENT SCHEDULE
25% deposit upon signing to secure vendors and venue. 25% due 60 days before the event. 25% due 14 days before the event. Final 25% plus any overages due within 14 days post-event. All vendor deposits are non-refundable once committed.

VENDOR MANAGEMENT
We source, negotiate, and manage all third-party vendors (AV, catering, decor, entertainment, security) on the client's behalf. Vendor contracts are between the vendor and the client unless otherwise specified. We provide transparent cost breakdowns with no hidden markups — our fee is the management retainer.

CANCELLATION TIERS
Cancellation 90+ days out: deposit retained, remaining refunded. 60-89 days: 50% of total fee retained. 30-59 days: 75% retained. Under 30 days: full fee retained. Vendor cancellation penalties are passed through at cost.

FORCE MAJEURE
Neither party is liable for cancellation or postponement due to events beyond reasonable control (natural disasters, government restrictions, pandemic orders). In such cases, we work to reschedule or negotiate vendor credits. Our management fee for work completed to date is non-refundable.

STAFFING & DAY-OF MANAGEMENT
The fee includes the specified number of on-site production staff for setup, event duration, and teardown. Additional staff are available at the day rate. Overtime beyond 12 hours on event day is billed at 1.5x.

INSURANCE & LIABILITY
The client is responsible for event insurance (general liability, cancellation). We carry our own professional liability insurance. Venue insurance requirements are the client's responsibility to fulfill.

CHANGES & ADDITIONS
Scope changes within 30 days of the event may incur rush fees. Changes within 7 days are subject to vendor availability and may not be possible.`,
      ai_guidance: {
        tone: "Confident, detail-oriented, and logistically commanding. Speak like a veteran event producer who has run dozens of large-scale events. Balance creative vision with operational precision. Every promise should be specific and actionable.",
        industry_context: "Event production. Address venue sourcing and negotiation, production timelines (12-month, 6-month, 3-month milestones), AV and staging requirements, catering and F&B planning, registration and badging technology, speaker management, sponsor fulfillment, on-site logistics (load-in/load-out, floor plans, run-of-show), and post-event reporting (attendance, NPS, sponsor ROI).",
        pricing_guidance: "Fixed management fee plus pass-through vendor costs at cost. Break out: creative/strategy, vendor management, on-site production staff, and post-event reporting. Show vendor budget as a separate estimated range. Typical management fee for a 200-400 person event: $15K-$30K plus vendor costs.",
        pricing_model: "fixed",
        style_notes: "Lead with the event vision and attendee experience. Include a high-level production timeline with key milestones. Break the budget into management fee vs estimated vendor costs for full transparency. Reference specific logistics (load-in times, AV specs, F&B per-head estimates).",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
  {
    id: "podcast-audio",
    name: "Podcast & Audio",
    description: "Podcast production, audio branding, show development, and episode production.",
    category: "Media",
    icon: "Mic",
    content: {
      color_scheme: { primary: "#292524", accent: "#f43f5e" },
      layout: "minimal",
      terms: `PAYMENT SCHEDULE
Launch package is a one-time fixed fee: 50% upon signing, 50% upon delivery of the first episode. Ongoing episode production is billed per episode or as a monthly retainer, due on the 1st of each month.

SHOW CONCEPT & BRANDING
The launch package includes show concept development, naming consultation, format design, audio branding (intro, outro, transition sounds), and cover-art design. These are the client's property upon payment.

EPISODE PRODUCTION
Per-episode production includes recording coordination, editing, mixing, mastering to broadcast standards (-16 LUFS integrated, -1 dBTP), show notes, transcript, and distribution to all major platforms. Episode length and complexity affect per-episode pricing.

RECORDING
We provide remote recording guidance and can supply equipment recommendations. Studio sessions, if required, are quoted separately. The client is responsible for providing a quiet recording environment and reliable internet for remote sessions.

HOSTING & DISTRIBUTION
We set up and manage the podcast hosting account (client-owned). Distribution to Apple Podcasts, Spotify, YouTube Music, and other major directories is included. The client retains full ownership of the RSS feed and hosting account.

MUSIC & LICENSING
Original audio branding is included and fully licensed. Any third-party music requires separate licensing — we can source and negotiate on the client's behalf.

CANCELLATION
The launch package is non-refundable once concept development begins. Ongoing episode production may be paused or cancelled with 14 days notice. Episodes in production at cancellation are completed and invoiced.`,
      ai_guidance: {
        tone: "Creative and technically fluent. Speak like a producer who lives in DAWs and understands both the art of storytelling and the science of audio engineering. Reference specific technical standards while keeping the creative vision front and center.",
        industry_context: "Podcast and audio production. Address show-concept development (format, segment structure, episode cadence), audio branding (sonic identity, intro/outro, transition beds), recording best practices (mic selection, room treatment, remote recording via Riverside/Squadcast), post-production workflow (editing, noise reduction, EQ, compression, limiting), mastering standards (-16 LUFS for streaming), hosting platforms (Buzzsprout, Transistor), and distribution/growth strategy (SEO titles, audiograms, cross-promotion, guest strategy).",
        pricing_guidance: "Two-part pricing: launch package (concept + branding + pilot episode) as fixed fee, then per-episode production. Launch package: $3K-$6K. Per-episode: $800-$1,500 depending on length and complexity. Monthly retainer option for 4+ episodes/month at a discount.",
        pricing_model: "tiered",
        style_notes: "Lead with the show concept and why it will resonate with the target audience. Include a sample episode outline. Specify technical deliverables (file format, loudness standard, metadata). Present a launch plan covering the first 4-6 episodes and growth strategy.",
      },
      section_config: { include_understanding: true, include_about_us: true },
    },
  },
];

export function getSystemTemplate(id: string): SystemTemplate | undefined {
  const slug = id.startsWith("system:") ? id.slice(7) : id;
  return SYSTEM_TEMPLATES.find((t) => t.id === slug);
}

export function isSystemTemplateId(id: string): boolean {
  return id.startsWith("system:");
}

export function resolveProposalLayout(
  proposal: Pick<Proposal, "template_id" | "layout">
): ProposalLayout {
  // Explicit layout choice takes priority
  if (proposal.layout && ["modern", "classic", "bold", "minimal"].includes(proposal.layout)) {
    return proposal.layout as ProposalLayout;
  }
  // Fall back to template's default layout
  const tid = proposal.template_id;
  if (tid && isSystemTemplateId(tid)) {
    const st = getSystemTemplate(tid);
    if (st) return st.content.layout;
  }
  return "modern";
}

export function getTemplatesByCategory(): { category: string; templates: SystemTemplate[] }[] {
  const categoryMap = new Map<string, SystemTemplate[]>();
  for (const t of SYSTEM_TEMPLATES) {
    const list = categoryMap.get(t.category) ?? [];
    list.push(t);
    categoryMap.set(t.category, list);
  }
  return Array.from(categoryMap.entries()).map(([category, templates]) => ({
    category,
    templates,
  }));
}

export function resolveProposalColors(
  proposal: Pick<Proposal, "template_color_primary" | "template_color_accent">,
  profile: Pick<Profile, "brand_color" | "brand_accent">
): { primary: string; accent: string } {
  return {
    primary: proposal.template_color_primary || profile.brand_color || "#1e40af",
    accent: proposal.template_color_accent || profile.brand_accent || "#3b82f6",
  };
}
