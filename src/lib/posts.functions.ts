import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type ReactionType = "like" | "love" | "haha" | "wow" | "clap" | "think";

export type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export type Post = {
  id: string;
  author_name: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
  reactions: Record<ReactionType, number>;
  my_reaction: ReactionType | null;
};

const ADMIN_PASSWORD = "produtivajr12";

export const listPosts = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ visitor_id: z.string().min(1).max(100).optional() }).parse(input ?? {})
  )
  .handler(async ({ data }) => {
    const { data: posts, error } = await supabaseAdmin
      .from("posts")
      .select("id, author_name, title, description, image_url, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("listPosts error", error);
      return { posts: [] as Post[], error: "Não foi possível carregar o feed." };
    }

    const ids = (posts ?? []).map((p) => p.id);
    const reactionMap: Record<string, Record<ReactionType, number>> = {};
    const mineMap: Record<string, ReactionType | null> = {};

    if (ids.length > 0) {
      const { data: reactions } = await supabaseAdmin
        .from("post_reactions")
        .select("post_id, reaction_type, visitor_id")
        .in("post_id", ids);

      for (const r of reactions ?? []) {
        const counts = (reactionMap[r.post_id] ??= {
          like: 0, love: 0, haha: 0, wow: 0, clap: 0, think: 0,
        });
        counts[r.reaction_type as ReactionType] += 1;
        if (data.visitor_id && r.visitor_id === data.visitor_id) {
          mineMap[r.post_id] = r.reaction_type as ReactionType;
        }
      }
    }

    const enriched: Post[] = (posts ?? []).map((p) => ({
      ...p,
      reactions: reactionMap[p.id] ?? { like: 0, love: 0, haha: 0, wow: 0, clap: 0, think: 0 },
      my_reaction: mineMap[p.id] ?? null,
    }));

    return { posts: enriched, error: null };
  });

const createPostSchema = z.object({
  author_name: z.string().min(1).max(80),
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(2000),
  image_url: z.string().url().max(1000).nullable().optional(),
});

export const createPost = createServerFn({ method: "POST" })
  .inputValidator((input) => createPostSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("posts")
      .insert({
        author_name: data.author_name.trim(),
        title: data.title.trim(),
        description: data.description.trim(),
        image_url: data.image_url ?? null,
      })
      .select("id, author_name, title, description, image_url, created_at")
      .single();

    if (error) {
      console.error("createPost error", error);
      throw new Error("Falha ao criar publicação.");
    }
    return { post: row };
  });

export const deletePost = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      id: z.string().uuid(),
      admin_password: z.string().min(1).max(100),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    if (data.admin_password !== ADMIN_PASSWORD) {
      throw new Error("Permissão negada.");
    }
    const { error } = await supabaseAdmin.from("posts").delete().eq("id", data.id);
    if (error) {
      console.error("deletePost error", error);
      throw new Error("Falha ao excluir publicação.");
    }
    return { ok: true };
  });

export const setReaction = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      post_id: z.string().uuid(),
      visitor_id: z.string().min(1).max(100),
      reaction_type: z.enum(["like", "love", "haha", "wow", "clap", "think"]).nullable(),
    }).parse(input)
  )
  .handler(async ({ data }) => {
    if (data.reaction_type === null) {
      await supabaseAdmin
        .from("post_reactions")
        .delete()
        .eq("post_id", data.post_id)
        .eq("visitor_id", data.visitor_id);
      return { ok: true };
    }
    const { error } = await supabaseAdmin
      .from("post_reactions")
      .upsert(
        {
          post_id: data.post_id,
          visitor_id: data.visitor_id,
          reaction_type: data.reaction_type,
        },
        { onConflict: "post_id,visitor_id" }
      );
    if (error) {
      console.error("setReaction error", error);
      throw new Error("Falha ao reagir.");
    }
    return { ok: true };
  });
