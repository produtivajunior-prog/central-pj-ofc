import type { Post } from "@/lib/posts.functions";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `há ${d} d`;
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 font-semibold text-foreground">
          {initials(post.author_name) || "?"}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{post.author_name}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
        </div>
      </header>

      <div className="space-y-2 px-4 pb-4">
        <h2 className="font-display text-xl font-semibold leading-snug text-foreground">
          {post.title}
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
          {post.description}
        </p>
      </div>

      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          loading="lazy"
          className="max-h-[560px] w-full border-t border-border object-cover"
        />
      ) : null}
    </article>
  );
}
