export function HowItWorks(): React.ReactElement {
  const steps = [
    {
      number: "01",
      title: "Paste the client brief",
      description:
        "Copy and paste any client email, brief, or RFP into Overture. Our AI immediately understands the requirements.",
    },
    {
      number: "02",
      title: "AI generates your proposal",
      description:
        "In under 60 seconds, get a complete proposal with executive summary, scope, timeline, pricing, and terms — all tailored to the client.",
    },
    {
      number: "03",
      title: "Send and close the deal",
      description:
        "Edit, polish, and export as a branded PDF. Share via link and track when clients view and respond to your proposal.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-secondary/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Three simple steps to a professional proposal
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+32px)] right-0 hidden h-px bg-border md:block" />
              )}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                <span className="text-lg font-bold font-mono text-primary">{step.number}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
