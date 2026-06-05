import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createComment, deleteComment, listComments } from "@/lib/posts.functions";
import { useAdmin } from "@/hooks/useAdmin";
import { useVisitorId } from "@/hooks/useVisitorId";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
}

export function Comments({ postId }: { postId: string }) {
  const qc = useQueryClient();
  const { isAdmin, getAdminPassword } = useAdmin();
  const visitorId = useVisitorId();
  const listFn = useServerFn(listComments);
  const createFn = useServerFn(createComment);
  const deleteFn = useServerFn(deleteComment);

  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const { data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => listFn({ data: { post_id: postId } }),
  });

  const createMut = useMutation({
    mutationFn: () =>
      createFn({
        data: {
          post_id: postId,
          visitor_id: visitorId!,
          author_name: name,
          content,
        },
      }),
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id, admin_password: getAdminPassword() } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", postId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const comments = data?.comments ?? [];

  return (
    <div className="space-y-3 border-t border-border bg-muted/30 px-4 py-3">
      {comments.length > 0 && (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold">
                {initials(c.author_name) || "?"}
              </div>
              <div className="flex-1 rounded-2xl bg-background px-3 py-2 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{c.author_name}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(c.created_at)}</span>
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-foreground/85">{c.content}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => delMut.mutate(c.id)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Excluir comentário"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!visitorId || !name.trim() || !content.trim()) return;
          createMut.mutate();
        }}
        className="space-y-2"
      >
        <Input
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="h-9"
        />
        <Textarea
          placeholder="Escreva um comentário..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!name.trim() || !content.trim() || createMut.isPending}
          >
            Comentar
          </Button>
        </div>
      </form>
    </div>
  );
}
