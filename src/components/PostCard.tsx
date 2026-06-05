import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Post, ReactionType } from "@/lib/posts.functions";
import { deletePost, setReaction } from "@/lib/posts.functions";
import { useAdmin } from "@/hooks/useAdmin";
import { useVisitorId } from "@/hooks/useVisitorId";
import { Comments } from "@/components/Comments";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "like", emoji: "👍", label: "Curtir" },
  { type: "love", emoji: "❤️", label: "Amei" },
  { type: "haha", emoji: "😂", label: "Engraçado" },
  { type: "wow", emoji: "😮", label: "Uau" },
  { type: "clap", emoji: "👏", label: "Parabéns" },
  { type: "think", emoji: "🤔", label: "Interessante" },
];

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
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
  const { isAdmin, getAdminPassword } = useAdmin();
  const visitorId = useVisitorId();
  const queryClient = useQueryClient();
  const deleteFn = useServerFn(deletePost);
  const reactFn = useServerFn(setReaction);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const delMut = useMutation({
    mutationFn: () => deleteFn({ data: { id: post.id, admin_password: getAdminPassword() } }),
    onSuccess: () => {
      toast.success("Publicação excluída");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reactMut = useMutation({
    mutationFn: (type: ReactionType | null) =>
      reactFn({ data: { post_id: post.id, visitor_id: visitorId!, reaction_type: type } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const handleReact = (type: ReactionType) => {
    if (!visitorId) return;
    const next = post.my_reaction === type ? null : type;
    reactMut.mutate(next);
    setHover(false);
  };

  const total = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const topReactions = REACTIONS.filter((r) => post.reactions[r.type] > 0)
    .sort((a, b) => post.reactions[b.type] - post.reactions[a.type])
    .slice(0, 3);
  const myReaction = REACTIONS.find((r) => r.type === post.my_reaction);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur">
      <header className="flex items-center gap-3 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 font-semibold text-foreground">
          {initials(post.author_name) || "?"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{post.author_name}</p>
          <p className="text-xs text-muted-foreground">{timeAgo(post.created_at)}</p>
        </div>
        {isAdmin && (
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir publicação"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir publicação?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O post "{post.title}" será removido permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => delMut.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>

      <div className="space-y-2 px-4 pb-3">
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

      {total > 0 && (
        <div className="flex items-center gap-2 border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <div className="flex -space-x-1">
            {topReactions.map((r) => (
              <span
                key={r.type}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-[11px] ring-1 ring-border"
                title={r.label}
              >
                {r.emoji}
              </span>
            ))}
          </div>
          <span>{total}</span>
        </div>
      )}

      <div
        className="relative border-t border-border px-2 py-1"
        onMouseLeave={() => setHover(false)}
      >
        <button
          onMouseEnter={() => setHover(true)}
          onClick={() => handleReact(post.my_reaction ?? "like")}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            myReaction ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <span className="text-base">{myReaction?.emoji ?? "👍"}</span>
          {myReaction?.label ?? "Reagir"}
        </button>

        {hover && (
          <div
            onMouseEnter={() => setHover(true)}
            className="absolute bottom-full left-2 z-20 mb-1 flex gap-1 rounded-full border border-border bg-popover px-2 py-1.5 shadow-lg animate-in fade-in zoom-in-95"
          >
            {REACTIONS.map((r) => (
              <button
                key={r.type}
                onClick={() => handleReact(r.type)}
                title={r.label}
                className="text-2xl transition-transform hover:-translate-y-1 hover:scale-125"
              >
                {r.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
