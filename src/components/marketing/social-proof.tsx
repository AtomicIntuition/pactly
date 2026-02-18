export function SocialProof(): React.ReactElement {
  const stats = [
    { value: "$12M+", label: "in proposals generated" },
    { value: "8,400+", label: "proposals created" },
    { value: "47%", label: "acceptance rate" },
  ];

  return (
    <section className="border-y border-border/50 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Logo bar */}
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by teams at
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {["Acme Corp", "Vertex", "Quantum", "Nimbus", "Aether"].map((name) => (
            <span
              key={name}
              className="text-lg font-semibold text-muted-foreground/30 select-none"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold font-mono tabular-nums text-gradient-gold">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
