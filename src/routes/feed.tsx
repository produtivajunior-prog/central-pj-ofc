import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listPosts } from "@/lib/posts.functions";
import { PostComposer } from "@/components/PostComposer";
import { PostCard } from "@/components/PostCard";

const postsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: () => listPosts(),
});

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed — Produtiva Junior" },
      {
        name: "description",
        content:
          "Feed interno da Produtiva Junior: publique novidades, reuniões e atualizações dos projetos.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQueryOptions),
  component: FeedPage,
});

function FeedPage() {
  const { data } = useSuspenseQuery(postsQueryOptions);

  return (
    <main className="mx-auto max-w-2xl px-4 pb-20 pt-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Feed da PJ</h1>
        <p className="text-sm text-muted-foreground">
          Compartilhe atualizações de projetos, reuniões e conquistas.
        </p>
      </div>

      <PostComposer />

      <div className="mt-8 space-y-5">
        {data.error ? (
          <p className="text-sm text-destructive">{data.error}</p>
        ) : data.posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <p className="font-medium text-foreground">Nenhuma publicação ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Seja o primeiro a compartilhar algo com o time.
            </p>
          </div>
        ) : (
          data.posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>
    </main>
  );
}
