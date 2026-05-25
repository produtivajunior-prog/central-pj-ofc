import { createFileRoute } from "@tanstack/react-router";
import { links } from "@/lib/links";
import { LinkCard } from "@/components/LinkCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central de Links — Produtiva Junior" },
      {
        name: "description",
        content:
          "Todos os formulários e ferramentas internas da Produtiva Junior em um só lugar.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-background to-background p-8 sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
            Central interna
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
          <span className="text-sm text-muted-foreground">
            {links.length} atalhos
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {links.map((item) => (
            <LinkCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
