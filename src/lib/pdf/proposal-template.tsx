import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { resolveProposalColors } from "@/lib/templates";
import type { ProposalLayout } from "@/lib/templates/types";
import type { Proposal, Profile } from "@/types";

/* ── Helpers ─────────────────────────────────────────────── */

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Strip the section title that the AI sometimes includes at the start of content */
function stripLeadingTitle(text: string, ...titles: string[]): string {
  let result = text;
  for (const title of titles) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`^\\s*${escaped}\\s*[:：]?\\s*\\n+`, "i"), "");
  }
  return result.trim();
}

/* ── Shared styles ───────────────────────────────────────── */

const s = StyleSheet.create({
  /* Content page */
  contentPage: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.7,
    color: "#292524",
    paddingTop: 55,
    paddingBottom: 55,
    paddingHorizontal: 50,
  },
  /* Fixed header on content pages */
  header: {
    position: "absolute",
    top: 20,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d6d3d1",
  },
  headerText: {
    fontSize: 7.5,
    color: "#78716c",
    fontFamily: "Helvetica",
  },
  /* Footer styles are inline on individual fixed Text elements */
  /* Body text */
  paragraph: {
    fontSize: 10,
    lineHeight: 1.7,
    color: "#292524",
    marginBottom: 8,
  },
  smallText: {
    fontSize: 9,
    color: "#78716c",
  },
  /* Table */
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
  },
  tableDesc: {
    flex: 1,
    fontSize: 10,
  },
  tableAmount: {
    width: 100,
    fontSize: 10,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },
  termsText: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: "#78716c",
  },
});

/* ── Props ───────────────────────────────────────────────── */

interface ProposalPdfProps {
  proposal: Proposal;
  profile: Profile;
  layout?: ProposalLayout;
}

/* ── Cover Pages ─────────────────────────────────────────── */

function CoverModern({ proposal, profile, colors }: {
  proposal: Proposal;
  profile: Profile;
  colors: { primary: string; accent: string };
}): React.ReactElement {
  const companyName = profile.company_name || profile.full_name;
  return (
    <Page size="A4" style={{ padding: 0 }}>
      {/* Dark background */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.primary,
      }} />
      {/* Faint accent overlay top-left */}
      <View style={{
        position: "absolute", top: 0, left: 0,
        width: 250, height: 250,
        backgroundColor: hexToRgba(colors.accent, 0.08),
        borderBottomRightRadius: 250,
      }} />
      {/* Content — vertically centered with slight downward bias */}
      <View style={{
        position: "absolute", top: 0, bottom: 0, left: 55, right: 55,
        justifyContent: "center", paddingTop: 120,
      }}>
        <Text style={{
          fontSize: 32, fontFamily: "Helvetica-Bold", color: "#ffffff",
          marginBottom: 10,
        }}>
          {proposal.title}
        </Text>
        <Text style={{
          fontSize: 12, color: hexToRgba("#ffffff", 0.7), marginBottom: 30,
        }}>
          {companyName}
        </Text>
        <View style={{ flexDirection: "row", gap: 50 }}>
          {proposal.client_name && (
            <View>
              <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared For</Text>
              <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{proposal.client_name}</Text>
              {proposal.client_company && (
                <Text style={{ fontSize: 9, color: hexToRgba("#ffffff", 0.6), marginTop: 2 }}>{proposal.client_company}</Text>
              )}
            </View>
          )}
          <View>
            <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared By</Text>
            <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{companyName}</Text>
          </View>
          {proposal.valid_until && (
            <View>
              <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Valid Until</Text>
              <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{proposal.valid_until}</Text>
            </View>
          )}
        </View>
      </View>
      {/* Accent stripe at bottom */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 5, backgroundColor: colors.accent,
      }} />
    </Page>
  );
}

function CoverClassic({ proposal, profile, colors }: {
  proposal: Proposal;
  profile: Profile;
  colors: { primary: string; accent: string };
}): React.ReactElement {
  const companyName = profile.company_name || profile.full_name;
  return (
    <Page size="A4" style={{ padding: 0 }}>
      {/* White background is default */}
      {/* Accent bar at top */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 6, backgroundColor: colors.accent,
      }} />
      {/* Centered content */}
      <View style={{
        flex: 1, justifyContent: "center", alignItems: "center",
        paddingHorizontal: 70,
      }}>
        <Text style={{
          fontSize: 28, fontFamily: "Helvetica-Bold", color: colors.primary,
          textAlign: "center", marginBottom: 8,
        }}>
          {proposal.title}
        </Text>
        {/* Accent underline */}
        <View style={{
          width: 50, height: 2, backgroundColor: colors.accent, marginBottom: 24,
        }} />
        <Text style={{
          fontSize: 12, color: "#78716c", textAlign: "center", marginBottom: 40,
        }}>
          {companyName}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 50 }}>
          {proposal.client_name && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared For</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: colors.primary }}>{proposal.client_name}</Text>
              {proposal.client_company && (
                <Text style={{ fontSize: 9, color: "#78716c", marginTop: 2 }}>{proposal.client_company}</Text>
              )}
            </View>
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared By</Text>
            <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: colors.primary }}>{companyName}</Text>
          </View>
          {proposal.valid_until && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Valid Until</Text>
              <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", color: colors.primary }}>{proposal.valid_until}</Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

function CoverBold({ proposal, profile, colors }: {
  proposal: Proposal;
  profile: Profile;
  colors: { primary: string; accent: string };
}): React.ReactElement {
  const companyName = profile.company_name || profile.full_name;
  return (
    <Page size="A4" style={{ padding: 0 }}>
      {/* Dark background */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: colors.primary,
      }} />
      {/* Large accent circle top-right */}
      <View style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: 160,
        backgroundColor: hexToRgba(colors.accent, 0.2),
      }} />
      {/* Small accent circle bottom-right */}
      <View style={{
        position: "absolute", bottom: 60, right: 40,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: hexToRgba(colors.accent, 0.1),
      }} />
      {/* Content — vertically centered with slight downward bias */}
      <View style={{
        position: "absolute", top: 0, bottom: 0, left: 55, right: 55,
        justifyContent: "center", paddingTop: 100,
      }}>
        {/* Company pill */}
        <View style={{
          backgroundColor: colors.accent,
          borderRadius: 12,
          paddingHorizontal: 14, paddingVertical: 5,
          alignSelf: "flex-start",
          marginBottom: 20,
        }}>
          <Text style={{ fontSize: 9, color: "#ffffff", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1 }}>
            {companyName}
          </Text>
        </View>
        <Text style={{
          fontSize: 36, fontFamily: "Helvetica-Bold", color: "#ffffff",
          marginBottom: 24,
        }}>
          {proposal.title}
        </Text>
        <View style={{ flexDirection: "row", gap: 50 }}>
          {proposal.client_name && (
            <View>
              <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared For</Text>
              <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{proposal.client_name}</Text>
              {proposal.client_company && (
                <Text style={{ fontSize: 9, color: hexToRgba("#ffffff", 0.6), marginTop: 2 }}>{proposal.client_company}</Text>
              )}
            </View>
          )}
          <View>
            <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Prepared By</Text>
            <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{companyName}</Text>
          </View>
          {proposal.valid_until && (
            <View>
              <Text style={{ fontSize: 8, color: hexToRgba("#ffffff", 0.5), textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Valid Until</Text>
              <Text style={{ fontSize: 11, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>{proposal.valid_until}</Text>
            </View>
          )}
        </View>
      </View>
      {/* Thick accent bar bottom */}
      <View style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 8, backgroundColor: colors.accent,
      }} />
    </Page>
  );
}

function CoverMinimal({ proposal, profile, colors }: {
  proposal: Proposal;
  profile: Profile;
  colors: { primary: string; accent: string };
}): React.ReactElement {
  const companyName = profile.company_name || profile.full_name;
  return (
    <Page size="A4" style={{ padding: 0 }}>
      {/* Thin accent line at top */}
      <View style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: 2, backgroundColor: colors.accent,
      }} />
      {/* Content - compact, upper area */}
      <View style={{
        paddingTop: 100, paddingHorizontal: 60,
      }}>
        <Text style={{
          fontSize: 8, color: "#a8a29e", textTransform: "uppercase",
          letterSpacing: 2, marginBottom: 14,
        }}>
          {companyName}
        </Text>
        <Text style={{
          fontSize: 26, fontFamily: "Helvetica-Bold", color: colors.primary,
          marginBottom: 30,
        }}>
          {proposal.title}
        </Text>
        <View style={{
          width: 30, height: 1, backgroundColor: "#d6d3d1", marginBottom: 30,
        }} />
        <View style={{ gap: 18 }}>
          {proposal.client_name && (
            <View>
              <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Prepared For</Text>
              <Text style={{ fontSize: 10, color: "#292524", fontFamily: "Helvetica-Bold" }}>{proposal.client_name}</Text>
              {proposal.client_company && (
                <Text style={{ fontSize: 9, color: "#78716c", marginTop: 2 }}>{proposal.client_company}</Text>
              )}
            </View>
          )}
          <View>
            <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Prepared By</Text>
            <Text style={{ fontSize: 10, color: "#292524", fontFamily: "Helvetica-Bold" }}>{companyName}</Text>
          </View>
          {proposal.valid_until && (
            <View>
              <Text style={{ fontSize: 8, color: "#a8a29e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Valid Until</Text>
              <Text style={{ fontSize: 10, color: "#292524", fontFamily: "Helvetica-Bold" }}>{proposal.valid_until}</Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  );
}

/* ── Section Heading ─────────────────────────────────────── */

function SectionHeading({ title, layout, accent }: {
  title: string;
  layout: ProposalLayout;
  accent: string;
}): React.ReactElement {
  if (layout === "classic") {
    return (
      <View style={{ marginTop: 28, marginBottom: 14 }}>
        <Text style={{
          fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
          letterSpacing: 1.5, color: "#78716c", marginBottom: 5,
        }}>
          {title}
        </Text>
        <View style={{ width: 40, height: 2, backgroundColor: accent }} />
      </View>
    );
  }
  if (layout === "bold") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 28, marginBottom: 14 }}>
        <View style={{ width: 5, height: 20, backgroundColor: accent, borderRadius: 2 }} />
        <Text style={{
          fontSize: 11, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
          letterSpacing: 1.5, color: "#292524",
        }}>
          {title}
        </Text>
      </View>
    );
  }
  if (layout === "minimal") {
    return (
      <View style={{ marginTop: 28, marginBottom: 14 }}>
        <Text style={{
          fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
          letterSpacing: 1.5, color: "#a8a29e",
        }}>
          {title}
        </Text>
      </View>
    );
  }
  /* modern (default) */
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 28, marginBottom: 14 }}>
      <View style={{ width: 3, height: 18, backgroundColor: accent, borderRadius: 2 }} />
      <Text style={{
        fontSize: 10, fontFamily: "Helvetica-Bold", textTransform: "uppercase",
        letterSpacing: 1.5, color: "#78716c",
      }}>
        {title}
      </Text>
    </View>
  );
}

/* ── Scope of Work ───────────────────────────────────────── */

function ScopeSection({ items, layout, accent }: {
  items: Proposal["scope_of_work"];
  layout: ProposalLayout;
  accent: string;
}): React.ReactElement {
  if (layout === "modern" || layout === "bold") {
    /* 2-column flexbox rows */
    const rows: Proposal["scope_of_work"][] = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }
    return (
      <View>
        {rows.map((row, ri) => (
          <View key={ri} style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
            {row.map((item, ci) => (
              <View key={ci} wrap={false} style={
                layout === "modern"
                  ? { flex: 1, borderWidth: 1, borderColor: "#e7e5e4", borderRadius: 6, padding: 12 }
                  : { flex: 1, borderLeftWidth: 3, borderLeftColor: accent, backgroundColor: "#f5f5f4", padding: 12 }
              }>
                <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 }}>{item.title}</Text>
                {item.description ? (
                  <Text style={s.smallText}>{item.description}</Text>
                ) : null}
              </View>
            ))}
            {/* Spacer if odd count */}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </View>
    );
  }

  if (layout === "classic") {
    return (
      <View>
        {items.map((item, i) => (
          <View key={i} wrap={false} style={{
            paddingBottom: 10, marginBottom: 10,
            borderBottomWidth: i < items.length - 1 ? 1 : 0,
            borderBottomColor: "#e7e5e4",
          }}>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{item.title}</Text>
            {item.description ? (
              <Text style={s.smallText}>{item.description}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  }

  /* minimal */
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} wrap={false} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 2 }}>{item.title}</Text>
          {item.description ? (
            <Text style={s.smallText}>{item.description}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

/* ── Deliverables ────────────────────────────────────────── */

function DeliverablesSection({ items, layout, accent }: {
  items: Proposal["deliverables"];
  layout: ProposalLayout;
  accent: string;
}): React.ReactElement {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} wrap={false} style={
          layout === "minimal"
            ? { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 6 }
            : { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 4, backgroundColor: "#fafaf9", padding: 8, borderRadius: 4 }
        }>
          <Text style={{ fontSize: 10, color: accent, fontFamily: "Helvetica-Bold" }}>&#x2713;</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>{item.title}</Text>
            {item.description ? (
              <Text style={s.smallText}>{item.description}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ── Timeline ────────────────────────────────────────────── */

function TimelineSection({ phases, layout, accent }: {
  phases: Proposal["timeline"];
  layout: ProposalLayout;
  accent: string;
}): React.ReactElement {
  if (layout === "minimal") {
    return (
      <View>
        {phases.map((phase, i) => (
          <View key={i} wrap={false} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
            <Text style={{ width: 20, fontSize: 9, color: "#a8a29e", fontFamily: "Helvetica-Bold" }}>{i + 1}.</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
                {phase.phase}{" "}
                <Text style={{ fontSize: 9, color: "#78716c", fontFamily: "Helvetica" }}>({phase.duration})</Text>
              </Text>
              {phase.description ? (
                <Text style={{ fontSize: 9, color: "#292524", marginTop: 2 }}>{phase.description}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    );
  }

  /* modern / classic / bold — accent numbered circles */
  return (
    <View>
      {phases.map((phase, i) => (
        <View key={i} wrap={false} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 14 }}>
          {/* Numbered circle */}
          <View style={{
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: accent,
            justifyContent: "center", alignItems: "center",
            marginRight: 12,
          }}>
            <Text style={{ fontSize: 10, color: "#ffffff", fontFamily: "Helvetica-Bold", textAlign: "center", lineHeight: 22 }}>
              {i + 1}
            </Text>
          </View>
          {/* Faint connecting line (except last) */}
          {i < phases.length - 1 && (
            <View style={{
              position: "absolute", left: 10, top: 24,
              width: 1, height: 14,
              backgroundColor: hexToRgba(accent, 0.25),
            }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold" }}>
              {phase.phase}{" "}
              <Text style={{ fontSize: 9, color: "#78716c", fontFamily: "Helvetica" }}>({phase.duration})</Text>
            </Text>
            {phase.description ? (
              <Text style={{ fontSize: 9, color: "#292524", marginTop: 2 }}>{phase.description}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ── Investment ──────────────────────────────────────────── */

function InvestmentSection({ investment, layout, primary, accent }: {
  investment: Proposal["investment"];
  layout: ProposalLayout;
  primary: string;
  accent: string;
}): React.ReactElement {
  const totalBg =
    layout === "bold" ? accent
    : layout === "minimal" ? "transparent"
    : primary;

  return (
    <View>
      {investment.line_items.map((item, i) => (
        <View key={i} style={s.tableRow}>
          <Text style={s.tableDesc}>{item.description}</Text>
          <Text style={s.tableAmount}>{formatCurrency(item.amount_cents)}</Text>
        </View>
      ))}
      {/* Total row */}
      {layout === "minimal" ? (
        <View style={{
          flexDirection: "row", paddingVertical: 10, marginTop: 4,
          borderTopWidth: 2, borderTopColor: "#d6d3d1",
        }}>
          <Text style={{ flex: 1, fontSize: 12, fontFamily: "Helvetica-Bold", color: "#292524" }}>Total</Text>
          <Text style={{ width: 100, fontSize: 14, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#292524" }}>
            {formatCurrency(investment.total_cents)}
          </Text>
        </View>
      ) : (
        <View style={{
          flexDirection: "row", alignItems: "center",
          paddingVertical: 10, paddingHorizontal: 12, marginTop: 8,
          backgroundColor: totalBg, borderRadius: 4,
        }}>
          <Text style={{ flex: 1, fontSize: 12, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>Total</Text>
          <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: "#ffffff" }}>
            {formatCurrency(investment.total_cents)}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export function ProposalPdf({ proposal, profile, layout = "modern" }: ProposalPdfProps): React.ReactElement {
  const colors = resolveProposalColors(proposal, profile);
  const companyName = profile.company_name || profile.full_name;

  /* Cover page per layout */
  const coverProps = { proposal, profile, colors };
  const cover =
    layout === "classic" ? <CoverClassic {...coverProps} />
    : layout === "bold" ? <CoverBold {...coverProps} />
    : layout === "minimal" ? <CoverMinimal {...coverProps} />
    : <CoverModern {...coverProps} />;

  return (
    <Document>
      {cover}

      {/* All content in a single wrapping page */}
      <Page size="A4" style={s.contentPage} wrap>
        {/* ── Executive Summary ── */}
        {proposal.executive_summary ? (
          <View>
            <SectionHeading title="Executive Summary" layout={layout} accent={colors.accent} />
            <Text style={s.paragraph}>
              {stripLeadingTitle(proposal.executive_summary, "Executive Summary")}
            </Text>
          </View>
        ) : null}

        {/* ── Understanding ── */}
        {proposal.understanding ? (
          <View>
            <SectionHeading title="Understanding of Your Needs" layout={layout} accent={colors.accent} />
            <Text style={s.paragraph}>
              {stripLeadingTitle(proposal.understanding, "Understanding of Your Needs", "Understanding")}
            </Text>
          </View>
        ) : null}

        {/* ── Scope of Work ── */}
        {proposal.scope_of_work?.length > 0 ? (
          <View>
            <SectionHeading title="Scope of Work" layout={layout} accent={colors.accent} />
            <ScopeSection items={proposal.scope_of_work} layout={layout} accent={colors.accent} />
          </View>
        ) : null}

        {/* ── Deliverables ── */}
        {proposal.deliverables?.length > 0 ? (
          <View>
            <SectionHeading title="Deliverables" layout={layout} accent={colors.accent} />
            <DeliverablesSection items={proposal.deliverables} layout={layout} accent={colors.accent} />
          </View>
        ) : null}

        {/* ── Timeline ── */}
        {proposal.timeline?.length > 0 ? (
          <View>
            <SectionHeading title="Timeline" layout={layout} accent={colors.accent} />
            <TimelineSection phases={proposal.timeline} layout={layout} accent={colors.accent} />
          </View>
        ) : null}

        {/* ── Investment ── */}
        {proposal.investment?.line_items?.length > 0 ? (
          <View>
            <SectionHeading title="Investment" layout={layout} accent={colors.accent} />
            <InvestmentSection investment={proposal.investment} layout={layout} primary={colors.primary} accent={colors.accent} />
          </View>
        ) : null}

        {/* ── Terms & Conditions ── */}
        {proposal.terms ? (
          <View>
            <SectionHeading title="Terms & Conditions" layout={layout} accent={colors.accent} />
            <Text style={s.termsText}>
              {stripLeadingTitle(proposal.terms, "Terms & Conditions", "Terms and Conditions")}
            </Text>
          </View>
        ) : null}

        {/* ── About Us ── */}
        {proposal.about_us ? (
          <View>
            <SectionHeading title={`About ${companyName}`} layout={layout} accent={colors.accent} />
            <Text style={s.paragraph}>
              {stripLeadingTitle(proposal.about_us, `About ${companyName}`, "About Us")}
            </Text>
          </View>
        ) : null}

        {/* Fixed header — rendered after content to avoid flow interference */}
        <View style={s.header} fixed>
          <Text style={s.headerText}>{companyName}</Text>
          <Text style={s.headerText}>{proposal.title}</Text>
        </View>

        {/* Fixed footer */}
        <Text
          fixed
          style={{ position: "absolute", bottom: 20, left: 50, fontSize: 7, color: "#a8a29e" }}
        >
          {companyName}
          {profile.website ? `  ·  ${profile.website}` : ""}
        </Text>
        <Text
          fixed
          style={{ position: "absolute", bottom: 20, right: 50, fontSize: 7, color: "#a8a29e" }}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
        <View
          fixed
          style={{ position: "absolute", bottom: 33, left: 50, right: 50, borderTopWidth: 0.5, borderTopColor: "#d6d3d1" }}
        />
      </Page>
    </Document>
  );
}
