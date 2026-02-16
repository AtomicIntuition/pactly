/**
 * Sample client briefs for generating real proposals from each system template.
 *
 * Usage: Select a template → New Proposal → paste the matching brief → generate.
 * Export the PDF and save to public/template-pdfs/{template-id}.pdf
 */
export const SAMPLE_BRIEFS: Record<string, { clientName: string; clientCompany: string; brief: string }> = {
  "web-development": {
    clientName: "Sarah Chen",
    clientCompany: "Bloom Botanicals",
    brief: `We're Bloom Botanicals, a specialty indoor plant shop based in Portland with a growing online following. Our current website is a basic Squarespace template that loads painfully slow and doesn't reflect our brand at all. We have about 400 products (plants, pots, care kits) and need a completely custom site.

Key needs:
- Gorgeous product pages with care guides built in
- Mobile-first — 70% of our traffic is mobile
- Fast load times (current site is 6+ seconds)
- Integration with our Square POS for real-time inventory
- Blog for plant care content (we publish weekly)
- Accessible design — we care about WCAG compliance

Our brand is premium but approachable. Think warm, earthy tones with lots of whitespace. We want photography to be the hero.

Budget is in the $25-35K range. We'd love to launch in about 10 weeks. Contact: Sarah Chen, Founder.`,
  },

  "mobile-app": {
    clientName: "Marcus Rivera",
    clientCompany: "PeakForm Athletics",
    brief: `PeakForm Athletics is a chain of 8 boutique fitness studios with about 2,800 active members across Los Angeles. We need a mobile app that extends our in-person experience into our members' daily routines.

What we need the app to do:
- Members can log workouts and track their progress over time
- Personal trainers can create and assign workout programs
- Push notifications for workout reminders and achievements
- Offline mode (members work out in areas with bad signal)
- Sync between the app and our internal trainer management system
- Works on both iOS and Android

Our members range from 25-45, tech-savvy, and expect a polished experience. Think Nike Training Club meets Strava but focused on our gym community. We want to hit a 40%+ 30-day retention rate.

Budget: around $40-50K for the MVP. Timeline: we'd like to be in the app stores within 15 weeks. Contact: Marcus Rivera, Head of Digital.`,
  },

  "brand-identity": {
    clientName: "Aisha Patel",
    clientCompany: "Solstice Wellness",
    brief: `We're launching Solstice Wellness — a new brand of premium wellness retreats targeting busy professionals who need a reset. Think 3-5 day immersive experiences combining yoga, nutrition workshops, and executive coaching in beautiful natural settings.

We need a complete brand identity from scratch:
- Logo and visual identity system
- Color palette that feels warm, premium, and grounding (not clinical or woo-woo)
- Typography selection
- Brand guidelines document so our team can apply the brand consistently
- Starter templates (business cards, social media, email signature, presentation deck)

Our competitors (Canyon Ranch, Six Senses) feel either too clinical or too spiritual. We want to occupy the space between — evidence-based wellness that feels luxurious and inviting.

Target audience: professionals ages 30-55 with household income $150K+. They value aesthetics and quality.

Budget is $10-15K for the complete brand package. We're targeting a 7-week timeline from kickoff to final delivery. Contact: Aisha Patel, Founder.`,
  },

  "digital-marketing": {
    clientName: "James Okafor",
    clientCompany: "Northside Dental Group",
    brief: `Northside Dental Group is expanding from 1 to 3 locations across Chicago's north side. We've grown entirely through word-of-mouth referrals, but that won't scale with 3 offices to fill.

We need a digital marketing partner who can help us:
- Fix our Google Business profiles (they're incomplete and inconsistent)
- Run Google Ads targeting people searching for dentists near our locations
- Build up our Google reviews (we have great patient satisfaction but only ~40 reviews per location)
- Create social media content (before/after cases, team introductions, patient testimonials)
- Monthly reporting so we know what's working

We're especially interested in targeting cosmetic dentistry, dental implants, and emergency dental searches — these are our highest-value services.

Current metrics: ~200 new patients/month across all locations, mostly from referrals. Goal: 300+ new patients/month within 6 months. Target CPA under $100 per new patient.

Budget: $4-5K/month management fee plus $3-4K/month ad spend. Contact: James Okafor, Practice Manager.`,
  },

  "consulting-advisory": {
    clientName: "Linda Nakamura",
    clientCompany: "Heritage Manufacturing Co.",
    brief: `Heritage Manufacturing is a 45-year-old precision parts manufacturer doing $28M in annual revenue. We've been successful but we know we're falling behind on technology. Our competitors have modernized and we're starting to lose bids.

Problems we're facing:
- Procurement is still done via spreadsheets and phone calls
- Quality control relies on manual inspection with a 3.2% defect rate (industry avg is 1%)
- Order fulfillment times have increased 40% in 2 years
- We have no real-time visibility into production status
- Our ERP system is 15 years old and barely maintained

What we need: A comprehensive assessment of our operations and a realistic technology roadmap. Not a sales pitch for some vendor's platform — we want honest, vendor-neutral advice on what to modernize first, what the ROI looks like, and what the realistic timeline and budget would be.

We have 4 departments (procurement, production, QA, fulfillment) with about 120 employees total. Leadership is committed to change but the shop floor is skeptical of technology.

Budget for the assessment: $20-25K. We want it completed in 5 weeks. Contact: Linda Nakamura, VP Operations.`,
  },

  "content-strategy": {
    clientName: "Elena Vasquez",
    clientCompany: "GreenLeaf Financial",
    brief: `GreenLeaf Financial is an independent wealth management firm specializing in sustainable and ESG investing. We manage about $340M in assets for high-net-worth individuals who want their money aligned with their values.

Our content problem: The ESG space is full of greenwashing and jargon. Our clients (and prospects) are intelligent people who want evidence-based information about sustainable investing — not marketing fluff or moral lectures. We need content that educates and builds trust.

What we need:
- A content strategy with defined pillars and editorial calendar
- 4 long-form blog articles per month (1,500+ words, research-backed)
- 2 email newsletters per month for our client base and prospects
- LinkedIn content for our 3 partners (8 posts/month)
- SEO optimization on everything — we're barely ranking for terms we should own

Target audience: HNW individuals ages 35-55, $1M+ investable assets, interested in impact without sacrificing returns. They read the Financial Times, listen to Planet Money, and are skeptical of hype.

Budget: $5-6K/month ongoing, plus $4K setup for strategy and voice guide. Contact: Elena Vasquez, Director of Marketing.`,
  },

  "ecommerce": {
    clientName: "David Kim",
    clientCompany: "Craftsman Leather Goods",
    brief: `Craftsman Leather Goods is a premium handmade leather goods company. We've been selling through wholesale and pop-up markets for 5 years, but we need to go direct-to-consumer online. Our products range from $45 wallets to $425 bags, all made by hand in our Portland workshop.

What we need:
- A beautiful e-commerce site that conveys the premium quality of handmade leather goods
- Product customization tool — customers love choosing leather type, color, thread, and adding monograms
- Integration with our Square POS so inventory stays synced between online and market sales
- About 200 products to start with
- Shipping integration (we use ShipStation)
- The checkout needs to be fast and mobile-friendly

Our biggest concern is that online shopping doesn't let people feel the leather. The website needs to compensate with incredible photography, zoom, and product storytelling. Every product has a story.

Budget: $25-30K. Timeline: 11 weeks to launch. Contact: David Kim, Owner.`,
  },

  "saas-product": {
    clientName: "Tomoko Sato",
    clientCompany: "FlowState Labs",
    brief: `We're FlowState Labs, a pre-seed startup building a project management tool for small teams (5-15 people). We've done 45 user interviews and validated that our target users waste ~6 hours/week switching between 4+ tools (Asana, Slack, Google Docs, Toggl). Our thesis: one unified workspace eliminates the context-switching tax.

What we need built for our MVP:
- Project boards with task management and dependencies
- Real-time collaboration (presence indicators, live updates)
- Basic team communication (comments on tasks, @mentions)
- Time tracking built into tasks (not a separate tool)
- Stripe Billing for subscription management (freemium model)
- Clean, fast interface — our differentiator is simplicity

Technical preferences:
- Next.js + TypeScript frontend
- We want this on AWS for scalability
- Multi-tenant architecture from day one
- CI/CD pipeline with staging environment
- The architecture must scale to 10K users without a rewrite

Budget: $40-50K for the MVP. Timeline: 12 weeks. We're targeting a demo for Series A conversations. Contact: Tomoko Sato, CEO.`,
  },

  "social-media": {
    clientName: "Rachel Torres",
    clientCompany: "Urban Plate Kitchen",
    brief: `Urban Plate Kitchen is a farm-to-table restaurant in Austin with 85 seats. We opened 2 years ago and have great reviews (4.7 on Google, 4.5 on Yelp) but our social media is basically nonexistent. We post maybe 3 times a month, zero video content, and we're not engaging with anyone.

Meanwhile our competitors are killing it on Instagram and TikTok — and we know 78% of diners check social before choosing a restaurant.

What we want:
- A real social media strategy across Instagram, TikTok, and Facebook
- Monthly content shoots at the restaurant (food, team, behind-the-scenes)
- Consistent posting schedule — at least 4-5 posts per week across platforms
- Short-form video content (Reels, TikToks) — our chef has great personality
- Community management (responding to comments, DMs, reviews)
- Monthly reporting tied to actual business metrics (reservations, not just likes)

Our goal: 50% follower growth in 6 months, and measurably more weekend reservations from social. We're especially strong on weeknights and need to drive weekend traffic.

Budget: about $5-7K/month including content shoots. Contact: Rachel Torres, Owner.`,
  },

  "video-production": {
    clientName: "Michael Chang",
    clientCompany: "Apex Outdoor Gear",
    brief: `Apex Outdoor Gear is an outdoor equipment company launching our DTC channel. We make rugged, high-performance gear (backpacks, tents, technical outerwear) tested in real expedition conditions. We need video content that shows our products being used in the wild — not studio shots, real outdoor adventure.

What we need:
- A 90-second hero brand film that captures the spirit of our brand
- 4 product showcase videos (30 seconds each) highlighting specific products in action
- Motion graphics kit (animated logo, lower thirds, end cards, social templates)
- Everything shot in 4K with versions cut for YouTube, Instagram, TikTok, and our website
- Two outdoor locations — we're thinking Pacific Northwest mountains and coastline

Our brand personality is rugged but premium. Think Patagonia meets Arc'teryx. We want cinematic quality — drone shots, golden hour, macro details on materials. Not influencer-style phone footage.

Budget: $15-20K. Timeline: shooting in 5 weeks, everything delivered in 7. Contact: Michael Chang, Head of Marketing.`,
  },

  "ui-ux-design": {
    clientName: "Dr. Nora Langford",
    clientCompany: "ClearPath Health",
    brief: `ClearPath Health is a multi-specialty medical practice with 45,000 patients using our online portal. The problem: our patient portal has a -12 NPS score. Patients constantly call our support line because they can't find basic things like lab results, appointment scheduling, or prescription refills.

We need a complete UX redesign of the portal:
- User research — talk to patients AND our clinicians to understand pain points
- Complete information architecture overhaul
- New visual design with a proper design system our dev team can implement
- WCAG 2.1 AA accessibility (our patient base includes elderly users)
- Usability testing to validate the redesign before we build it
- Design handoff with developer specs

Current pain points from support tickets:
- Patients can't find their lab results (takes avg 4.2 minutes for a task that should be 90 seconds)
- Appointment scheduling flow has a 35% abandonment rate
- Mobile experience is essentially broken
- The interface was built by engineers without UX input

Budget: $35-40K. Timeline: 10 weeks from research to final handoff. Contact: Dr. Nora Langford, Chief Medical Officer.`,
  },

  "seo-analytics": {
    clientName: "Ben Hargrove",
    clientCompany: "Trailhead Outfitters",
    brief: `Trailhead Outfitters is an outdoor retail e-commerce store doing $2.4M/year online. Problem: only 18% of our revenue comes from organic search, which is way below the 35-45% benchmark for outdoor retail. We know we're leaving money on the table.

Specific issues we're aware of:
- 340+ indexing errors (we've never had a technical SEO audit)
- No structured data on any product pages
- We're still on Universal Analytics and haven't migrated to GA4
- Our product descriptions are mostly manufacturer copy (duplicate content everywhere)
- We rank on page 1 for almost nothing despite having 2,000+ products

What we need:
- Full technical SEO audit with prioritized fix list
- GA4 migration and proper e-commerce tracking setup
- Content optimization for our top 50 product and category pages
- Keyword gap analysis vs. competitors (REI, Backcountry, Moosejaw)
- Ongoing monthly SEO management and reporting

Goal: 80% increase in organic traffic and 2.5x organic revenue within 12 months.

Budget: $4-5K for initial audit + GA4 setup, then $4-5K/month ongoing. Contact: Ben Hargrove, E-Commerce Director.`,
  },

  "photography": {
    clientName: "Camille Durand",
    clientCompany: "Maison Terre Ceramics",
    brief: `Maison Terre Ceramics is a handmade ceramics studio. I make everything by hand — bowls, plates, vases, mugs — and sell at farmers markets. I'm about to launch an online store and I need professional product photography that actually conveys the quality of my work. My current photos are iPhone shots on my kitchen counter and they make $95 bowls look like $15 bowls.

What I need:
- Clean studio product shots of all 35 SKUs (white background, consistent lighting)
- Lifestyle photos in a real home setting — tabletop styling, shelf vignettes, kitchen scenes
- About 60 final images total
- Versions optimized for web and social (Instagram, Pinterest)
- The images need to show the texture and detail of handmade ceramics

My aesthetic is minimal, earthy, and warm. Think Kinfolk magazine or East Fork Pottery's website. Natural light, simple compositions, raw textures.

Budget: $6-10K for the complete shoot. I need everything in 2.5 weeks (launching the site in 3 weeks). Contact: Camille Durand, Founder.`,
  },

  "public-relations": {
    clientName: "Kai Yoshida",
    clientCompany: "Ember Robotics",
    brief: `Ember Robotics just closed an $18M Series B for our warehouse automation technology. We've been in stealth mode for 2 years building robots that achieve 40% faster pick rates than anything else on the market. Now we need to go public with this story.

Our goals:
- Get coverage in tier-1 publications (TechCrunch, Forbes, Bloomberg, WSJ)
- Position our CEO and CTO as thought leaders in logistics automation
- Build credibility with enterprise buyers who won't evaluate vendors they haven't seen in the press
- Target 15+ earned media placements in 6 months
- Get speaking slots at key conferences (MODEX, ProMat, Robotics Summit)

We need:
- Core messaging and narrative development
- Media training for our spokespeople (2 sessions)
- Proactive media outreach to tech, business, and logistics trade publications
- Ghostwritten thought leadership (byline articles, LinkedIn)
- Monthly coverage reports and competitive share-of-voice tracking

Competition: Locus Robotics, 6 River Systems, Fetch Robotics. We need to be in every conversation they're in.

Budget: $6-8K/month retainer plus $5K onboarding. Contact: Kai Yoshida, VP Marketing.`,
  },

  "event-production": {
    clientName: "Diana Osei",
    clientCompany: "Nexus Ventures",
    brief: `Nexus Ventures is a seed-stage VC fund. We want to produce our first Annual Tech Summit — a 2-day conference for about 400 people including our portfolio founders, LPs, industry leaders, and select founders we're evaluating.

This is our first large event and we need a production partner who can own everything:
- Venue sourcing and management (thinking boutique hotel or unique space, not a convention center)
- Full AV and staging for a main stage + 3 breakout rooms
- Catering for 2 full days (breakfast, lunch, 2 snack breaks, cocktail reception day 1)
- Speaker coordination (travel logistics, AV needs, green room)
- Sponsor fulfillment (we have 5 confirmed sponsors who need booth space and branding)
- Registration platform and badging system
- Livestreaming for 2 keynote sessions
- On-site production staff for the full event

The vibe should be premium but not stuffy. Think tech-forward and founder-friendly, not corporate conference. We want 90+ NPS.

Budget: $80-90K total (management fee + vendors). Planning starts now, event is in 13 weeks. Contact: Diana Osei, Head of Platform.`,
  },

  "podcast-audio": {
    clientName: "Priya Mehta",
    clientCompany: "Foundry Capital",
    brief: `Foundry Capital is an early-stage VC fund and we want to launch a podcast that differentiates us from the 200+ seed funds competing for the same founders. The idea: a conversational interview show where our managing partners talk to successful founders about the decisions that actually mattered — not the usual startup origin story but the specific moments that changed everything.

What we need:
- Show concept development and format design (thinking 30-minute episodes, bi-weekly)
- Custom audio branding (intro music, outro, transitions, sonic logo)
- Cover art design
- A pilot episode produced end-to-end so we can see the quality and refine
- Then full production of Season 1 (12 episodes)
- Each episode needs editing, mixing, mastering, show notes, and transcripts
- Distribution setup on all major platforms

Quality bar: We want it to sound like an Acquired or Invest Like the Best episode, not a Zoom recording with a free intro. Our brand is premium and the audio should match.

Budget: about $18-22K for concept through Season 1. Contact: Priya Mehta, Partner.`,
  },
};
