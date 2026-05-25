import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createPost } from "@/lib/posts.functions";

export function PostComposer() {
  const qc = useQueryClient();
  const createPostFn = useServerFn(createPost);

  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      let image_url: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("post-images")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw new Error("Falha ao enviar a imagem.");
        const { data } = supabase.storage.from("post-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }

      return createPostFn({
        data: {
          author_name: author,
          title,
          description,
          image_url,
        },
      });
    },
    onSuccess: () => {
      toast.success("Publicação enviada!");
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Erro ao publicar."),
  });

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !description.trim()) {
      toast.error("Preencha nome, título e descrição.");
      return;
    }
    mutation.mutate();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Criar publicação
        </h2>
        <p className="text-sm text-muted-foreground">
          Compartilhe novidades, reuniões e marcos dos projetos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="author">Seu nome</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Ex.: Maria Silva"
            maxLength={80}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Reunião com cliente X"
            maxLength={140}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="desc">Descrição</Label>
        <Textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Conte mais sobre essa publicação..."
          rows={4}
          maxLength={2000}
        />
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img src={preview} alt="Pré-visualização" className="max-h-80 w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
            className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 text-foreground shadow"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          <ImagePlus className="h-4 w-4 text-primary" />
          {file ? "Trocar foto" : "Adicionar foto"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
          />
        </label>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publicar
        </Button>
      </div>
    </form>
  );
}
