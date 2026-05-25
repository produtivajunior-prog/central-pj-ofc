import { createFileRoute, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LinkCard } from "@/components/LinkCard";
import { LinkFormDialog, type LinkFormValues } from "@/components/admin/LinkFormDialog";
import { listLinks, upsertLink, deleteLink } from "@/lib/links.functions";
import { useAdmin } from "@/hooks/useAdmin";
import type { DbLink } from "@/lib/links";

const linksQO = queryOptions({
  queryKey: ["links"],
  queryFn: () => listLinks(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central PJ — Produtiva Junior" },
      {
        name: "description",
        content:
          "Central PJ: todos os formulários e ferramentas internas da Produtiva Junior em um só lugar.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(linksQO),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(linksQO);
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const upsert = useServerFn(upsertLink);
  const remove = useServerFn(deleteLink);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DbLink | null>(null);
  const [saving, setSaving] = useState(false);

  const links = data.links;

  const handleSubmit = async (values: LinkFormValues) => {
    setSaving(true);
    try {
      await upsert({
        data: {
          id: values.id ?? undefined,
          title: values.title,
          description: values.description,
          url: values.url,
          icon_name: values.icon_name,
          category: values.category,
          sort_order: editing?.sort_order ?? links.length + 1,
        },
      });
      toast.success(editing ? "Link atualizado." : "Link criado.");
      setDialogOpen(false);
      setEditing(null);
      await router.invalidate();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: DbLink) => {
    if (!confirm(`Remover "${item.title}"?`)) return;
    try {
      await remove({ data: { id: item.id } });
      toast.success("Link removido.");
      await router.invalidate();
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível remover.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-background to-background p-8 sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
            Central PJ
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Tudo da Produtiva Junior em um só lugar
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Acesse rapidamente os formulários, dashboards e ferramentas do dia a dia da PJ.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Links rápidos
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{links.length} atalhos</span>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditing(null);
                  setDialogOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Novo link
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {links.map((item) => (
            <LinkCard
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              onEdit={(it) => {
                setEditing(it);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      <LinkFormDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditing(null);
        }}
        initial={editing}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </main>
  );
}
