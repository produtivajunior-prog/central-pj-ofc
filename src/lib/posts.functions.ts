import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type Post = {
  id: string;
  author_name: string;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
};

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("id, author_name, title, description, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("listPosts error", error);
    return { posts: [] as Post[], error: "Não foi possível carregar o feed." };
  }
  return { posts: (data ?? []) as Post[], error: null };
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
    return { post: row as Post };
  });
