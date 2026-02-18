import { Zap, Edit, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Zap,
    title: "Brief to Proposal in 60s",
    description:
      "Drop in any client email, brief, or RFP. Our AI analyzes the requirements and generates a tailored proposal in under 60 seconds.",
  },
  {
    icon: Edit,
    title: "Your Editor, Your Brand",
    description:
      "Review and refine with a live preview editor. Every section is editable. Apply your brand colors and logo with one click.",
  },
  {
    icon: Send,
    title: "Send, Track, Close",
    description:
      "Export as a branded PDF or share via link. Know when clients view your proposal and track acceptance rates in real time.",
  },
];

export function Features(): React.ReactElement {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Close deals faster with less effort
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From initial brief to signed deal, Overture handles the heavy lifting so you can
            focus on what you do best.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative rounded-lg border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
