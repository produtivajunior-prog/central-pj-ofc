
CREATE TABLE public.post_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  visitor_id text NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like','love','wow','clap','think')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, visitor_id)
);

CREATE INDEX post_reactions_post_id_idx ON public.post_reactions(post_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_reactions TO anon, authenticated;
GRANT ALL ON public.post_reactions TO service_role;

ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reactions" ON public.post_reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reactions" ON public.post_reactions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete reactions" ON public.post_reactions FOR DELETE USING (true);

-- Restrict DELETE on posts: only service_role (server-side admin function) can delete.
-- No DELETE policy exists for public; ensure it stays that way.
REVOKE DELETE ON public.posts FROM anon, authenticated;
