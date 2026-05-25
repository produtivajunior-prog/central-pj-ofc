import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ICON_NAMES, ICONS, type DbLink } from "@/lib/links";

export type LinkFormValues = {
  id?: string | null;
  title: string;
  description: string;
  url: string;
  icon_name: string;
  category: string;
};

export function LinkFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: DbLink | null;
  onSubmit: (values: LinkFormValues) => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<LinkFormValues>({
    title: "",
    description: "",
    url: "",
    icon_name: "Link",
    category: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        id: initial?.id ?? null,
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        url: initial?.url ?? "",
        icon_name: initial?.icon_name ?? "Link",
        category: initial?.category ?? "",
      });
    }
  }, [open, initial]);

  const SelectedIcon = ICONS[form.icon_name] ?? ICONS.Link;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar link" : "Novo link"}</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
          className="space-y-4"
        >
          <Field label="Título">
            <input
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Descrição">
            <input
              required
              maxLength={300}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="URL">
            <input
              required
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className="input"
              placeholder="https://..."
            />
          </Field>

          <Field label="Categoria">
            <input
              required
              maxLength={60}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Ícone">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
                <SelectedIcon className="h-5 w-5" />
              </div>
              <select
                value={form.icon_name}
                onChange={(e) => setForm({ ...form, icon_name: e.target.value })}
                className="input flex-1"
              >
                {ICON_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
