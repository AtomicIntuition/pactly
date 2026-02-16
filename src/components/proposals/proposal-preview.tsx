import { CheckCircle2, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveProposalColors } from "@/lib/templates";
import type { Proposal, Profile } from "@/types";
import type { ProposalLayout } from "@/lib/templates/types";

interface ProposalPreviewProps {
  proposal: Proposal;
  profile: Profile;
  layout?: ProposalLayout;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
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

export function ProposalPreview({
  proposal,
  profile,
  layout = "modern",
}: ProposalPreviewProps): React.ReactElement {
  const colors = resolveProposalColors(proposal, profile);
  const companyLabel = profile.company_name || profile.full_name;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      {/* ── Hero ── */}
      <HeroHeader
        layout={layout}
        title={proposal.title}
        companyLabel={companyLabel}
        clientName={proposal.client_name}
        clientCompany={proposal.client_company}
        validUntil={proposal.valid_until}
        totalCents={proposal.investment?.total_cents ?? 0}
        colors={colors}
      />

      {/* ── Body ── */}
      <div
        className={cn(
          "px-10",
          layout === "minimal" ? "py-12 space-y-14" : "py-10 space-y-12"
        )}
      >
        {/* Executive Summary */}
        {proposal.executive_summary && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Executive Summary
            </SectionHeading>
            <p className="mt-4 text-sm leading-[1.8] text-gray-700 whitespace-pre-wrap">
              {stripLeadingTitle(proposal.executive_summary, "Executive Summary")}
            </p>
          </section>
        )}

        {/* Understanding */}
        {proposal.understanding && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Understanding of Your Needs
            </SectionHeading>
            <div
              className={cn(
                "mt-4 py-5",
                layout === "minimal"
                  ? "border-l pl-5"
                  : "rounded-lg border-l-4 bg-gray-50 px-6"
              )}
              style={{ borderLeftColor: colors.accent }}
            >
              <p className="text-sm leading-[1.8] text-gray-700 whitespace-pre-wrap">
                {stripLeadingTitle(proposal.understanding, "Understanding of Your Needs", "Understanding")}
              </p>
            </div>
          </section>
        )}

        {/* Scope of Work */}
        {proposal.scope_of_work.length > 0 && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Scope of Work
            </SectionHeading>
            <div
              className={cn(
                "mt-6",
                layout === "modern" || layout === "bold"
                  ? "grid gap-4 sm:grid-cols-2"
                  : "space-y-4"
              )}
            >
              {proposal.scope_of_work.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    layout === "modern" &&
                      "rounded-lg border border-gray-200 bg-white p-5",
                    layout === "classic" &&
                      "border-b border-gray-100 pb-4 last:border-0",
                    layout === "bold" &&
                      "rounded-lg border-l-4 bg-gray-50 p-5",
                    layout === "minimal" && "pb-4"
                  )}
                  style={
                    layout === "bold"
                      ? { borderLeftColor: colors.accent }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center text-xs font-bold",
                        layout === "minimal"
                          ? "h-5 w-5 rounded border border-gray-200 text-gray-400"
                          : "h-7 w-7 rounded-md text-white"
                      )}
                      style={
                        layout !== "minimal"
                          ? { backgroundColor: colors.accent }
                          : undefined
                      }
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deliverables */}
        {proposal.deliverables.length > 0 && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Deliverables
            </SectionHeading>
            <div
              className={cn(
                "mt-5",
                layout === "minimal" ? "space-y-4" : "space-y-3"
              )}
            >
              {proposal.deliverables.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3",
                    layout === "minimal"
                      ? "py-2"
                      : "rounded-lg bg-gray-50 px-5 py-4"
                  )}
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: colors.accent }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Timeline */}
        {proposal.timeline.length > 0 && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Timeline
            </SectionHeading>
            <div className="relative mt-6">
              {layout !== "minimal" && (
                <div
                  className="absolute left-[15px] top-4 bottom-4 w-0.5 rounded-full"
                  style={{ backgroundColor: `${colors.accent}25` }}
                />
              )}
              <div
                className={cn(
                  layout === "minimal" ? "space-y-4" : "space-y-6"
                )}
              >
                {proposal.timeline.map((phase, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative flex",
                      layout === "minimal"
                        ? "items-start gap-4"
                        : "gap-5"
                    )}
                  >
                    {layout === "minimal" ? (
                      <span className="mt-0.5 w-4 shrink-0 text-right text-xs font-medium text-gray-300">
                        {i + 1}
                      </span>
                    ) : (
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={cn(
                            "flex items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                            layout === "bold" ? "h-9 w-9" : "h-8 w-8"
                          )}
                          style={{ backgroundColor: colors.accent }}
                        >
                          {i + 1}
                        </div>
                      </div>
                    )}
                    <div className="flex-1 pb-1 pt-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {phase.phase}
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                          <Clock className="h-2.5 w-2.5" />
                          {phase.duration}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Investment */}
        {proposal.investment.line_items.length > 0 && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Investment
            </SectionHeading>
            <div
              className={cn(
                "mt-5 overflow-hidden",
                layout === "minimal"
                  ? "border-t border-gray-100"
                  : "rounded-lg border border-gray-200"
              )}
            >
              <div
                className={
                  layout === "minimal" ? "" : "divide-y divide-gray-100"
                }
              >
                {proposal.investment.line_items.map((item, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center justify-between px-5 py-3.5 text-sm",
                      layout === "minimal"
                        ? "border-b border-gray-50"
                        : i % 2 === 0
                          ? "bg-gray-50/50"
                          : ""
                    )}
                  >
                    <span className="text-gray-700">{item.description}</span>
                    <span className="font-mono text-sm tabular-nums font-medium text-gray-900">
                      {formatCurrency(item.amount_cents)}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className={cn(
                  "flex items-center justify-between px-5 py-4",
                  layout === "minimal"
                    ? "border-t border-gray-200"
                    : "text-white"
                )}
                style={
                  layout === "minimal"
                    ? undefined
                    : {
                        backgroundColor:
                          layout === "bold"
                            ? colors.accent
                            : colors.primary,
                      }
                }
              >
                <span
                  className={cn(
                    "text-sm font-semibold",
                    layout === "minimal" && "text-gray-600"
                  )}
                >
                  Total Investment
                </span>
                <span
                  className={cn(
                    "text-lg font-bold font-mono tabular-nums",
                    layout === "minimal" && "text-gray-900"
                  )}
                >
                  {formatCurrency(proposal.investment.total_cents)}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Terms */}
        {proposal.terms && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              Terms & Conditions
            </SectionHeading>
            <div
              className={cn(
                "mt-4",
                layout === "minimal" ? "" : "rounded-lg bg-gray-50 px-6 py-5"
              )}
            >
              <div
                className={cn(
                  "flex items-start gap-3",
                  layout === "minimal" && "gap-0"
                )}
              >
                {layout !== "minimal" && (
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                )}
                <p className="text-xs leading-[1.9] text-gray-500 whitespace-pre-wrap">
                  {stripLeadingTitle(proposal.terms, "Terms & Conditions", "Terms and Conditions")}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* About Us */}
        {proposal.about_us && (
          <section>
            <SectionHeading color={colors.accent} layout={layout}>
              About {companyLabel}
            </SectionHeading>
            <p className="mt-4 text-sm leading-[1.8] text-gray-700 whitespace-pre-wrap">
              {stripLeadingTitle(proposal.about_us, `About ${companyLabel}`, "About Us")}
            </p>
          </section>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className={cn("px-10 py-6 text-center", layout === "bold" && "text-white")}
        style={{
          backgroundColor:
            layout === "bold" ? colors.accent : `${colors.primary}08`,
        }}
      >
        <p
          className={cn(
            "text-xs",
            layout === "bold" ? "text-white/80" : "text-gray-400"
          )}
        >
          {companyLabel}
          {profile.website && <> &middot; {profile.website}</>}
          {profile.email && <> &middot; {profile.email}</>}
        </p>
      </div>
    </div>
  );
}

/* ── Hero Header ── */
function HeroHeader({
  layout,
  title,
  companyLabel,
  clientName,
  clientCompany,
  validUntil,
  totalCents,
  colors,
}: {
  layout: ProposalLayout;
  title: string;
  companyLabel: string;
  clientName: string | null;
  clientCompany: string | null;
  validUntil: string | null;
  totalCents: number;
  colors: { primary: string; accent: string };
}): React.ReactElement {
  const isDarkHero = layout === "modern" || layout === "bold";

  const metadata = (
    <div className={cn("mt-8 flex flex-wrap gap-x-10 gap-y-4", !isDarkHero && "mt-6")}>
      {clientName && (
        <div>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.15em]",
              isDarkHero ? "opacity-50" : "text-gray-400"
            )}
          >
            Prepared for
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold",
              !isDarkHero && "text-gray-900"
            )}
          >
            {clientName}
          </p>
          {clientCompany && (
            <p
              className={cn(
                "text-xs",
                isDarkHero ? "opacity-70" : "text-gray-500"
              )}
            >
              {clientCompany}
            </p>
          )}
        </div>
      )}
      {validUntil && (
        <div>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.15em]",
              isDarkHero ? "opacity-50" : "text-gray-400"
            )}
          >
            Valid until
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold",
              !isDarkHero && "text-gray-900"
            )}
          >
            {validUntil}
          </p>
        </div>
      )}
      {totalCents > 0 && (
        <div>
          <p
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.15em]",
              isDarkHero ? "opacity-50" : "text-gray-400"
            )}
          >
            Investment
          </p>
          <p
            className={cn(
              "mt-1 text-sm font-semibold",
              !isDarkHero && "text-gray-900"
            )}
          >
            {formatCurrency(totalCents)}
          </p>
        </div>
      )}
    </div>
  );

  /* ─ Modern: full-width dark hero with accent gradient ─ */
  if (layout === "modern") {
    return (
      <div
        className="relative overflow-hidden px-10 py-12 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div
          className="absolute bottom-0 left-0 h-1.5 w-full"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: `linear-gradient(135deg, ${colors.accent} 0%, transparent 60%)`,
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
            {companyLabel}
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {title}
          </h1>
          {metadata}
        </div>
      </div>
    );
  }

  /* ─ Classic: accent top bar, white hero, accent underline ─ */
  if (layout === "classic") {
    return (
      <div>
        <div className="h-1.5" style={{ backgroundColor: colors.accent }} />
        <div className="border-b border-gray-100 px-10 pb-8 pt-10">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: colors.accent }}
          >
            {companyLabel}
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <div
            className="mt-3 h-0.5 w-16"
            style={{ backgroundColor: colors.accent }}
          />
          {metadata}
        </div>
      </div>
    );
  }

  /* ─ Bold: tall dark hero with geometric accent shapes ─ */
  if (layout === "bold") {
    return (
      <div
        className="relative overflow-hidden px-10 py-14 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-20"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-8 right-20 h-20 w-20 rounded-full opacity-10"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute bottom-0 left-0 h-2 w-full"
          style={{ backgroundColor: colors.accent }}
        />
        <div className="relative">
          <p
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ backgroundColor: `${colors.accent}30` }}
          >
            {companyLabel}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {title}
          </h1>
          {metadata}
        </div>
      </div>
    );
  }

  /* ─ Minimal: thin accent line, white hero, compact ─ */
  return (
    <div>
      <div className="h-0.5" style={{ backgroundColor: colors.accent }} />
      <div className="px-10 pb-6 pt-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
          {companyLabel}
        </p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
          {title}
        </h1>
        {metadata}
      </div>
    </div>
  );
}

/* ── Section heading with layout-specific decoration ── */
function SectionHeading({
  children,
  color,
  layout = "modern",
}: {
  children: React.ReactNode;
  color: string;
  layout?: ProposalLayout;
}): React.ReactElement {
  /* Classic: heading with accent underline */
  if (layout === "classic") {
    return (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900">
          {children}
        </h2>
        <div
          className="mt-2 h-0.5 w-10"
          style={{ backgroundColor: color }}
        />
      </div>
    );
  }

  /* Bold: thicker accent bar with larger text */
  if (layout === "bold") {
    return (
      <div className="flex items-center gap-3">
        <div
          className="h-6 w-1.5 rounded-sm"
          style={{ backgroundColor: color }}
        />
        <h2 className="text-sm font-extrabold uppercase tracking-[0.12em] text-gray-900">
          {children}
        </h2>
      </div>
    );
  }

  /* Minimal: plain small-caps heading, no decoration */
  if (layout === "minimal") {
    return (
      <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-gray-400">
        {children}
      </h2>
    );
  }

  /* Modern (default): thin accent bar + uppercase text */
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-5 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-900">
        {children}
      </h2>
    </div>
  );
}
