import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { DbLink } from "./links";

export const listLinks = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("links")
    .select("id, title, description, url, icon_name, category, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("listLinks error", error);
    return { links: [] as DbLink[] };
  }
  return { links: (data ?? []) as DbLink[] };
});

const linkInput = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(300),
  url: z.string().url().max(1000),
  icon_name: z.string().min(1).max(60),
  category: z.string().min(1).max(60),
  sort_order: z.number().int().min(0).max(9999).optional(),
});

export const upsertLink = createServerFn({ method: "POST" })
  .inputValidator((input) => linkInput.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim(),
      url: data.url.trim(),
      icon_name: data.icon_name.trim(),
      category: data.category.trim(),
      sort_order: data.sort_order ?? 999,
    };

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("links")
        .update(payload)
        .eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("links").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteLink = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("links").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
