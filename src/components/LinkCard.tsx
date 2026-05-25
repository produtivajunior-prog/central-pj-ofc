import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { getIcon, type DbLink } from "@/lib/links";

export function LinkCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
}: {
  item: DbLink;
  isAdmin?: boolean;
  onEdit?: (item: DbLink) => void;
  onDelete?: (item: DbLink) => void;
}) {
  const Icon = getIcon(item.icon_name);

  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-4"
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

      {isAdmin && (
        <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onEdit?.(item);
            }}
            className="rounded-md bg-background/90 p-1.5 text-muted-foreground shadow-sm hover:text-primary"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onDelete?.(item);
            }}
            className="rounded-md bg-background/90 p-1.5 text-muted-foreground shadow-sm hover:text-destructive"
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
