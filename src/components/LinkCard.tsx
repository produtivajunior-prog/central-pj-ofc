import { ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/lib/links";

export function LinkCard({ item }: { item: LinkItem }) {
  const Icon = item.icon;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {item.category}
        </p>
        <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    </a>
  );
}
