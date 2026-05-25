
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE INDEX posts_created_at_idx ON public.posts (created_at DESC);

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true);

CREATE POLICY "Public read post-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Anyone can upload post-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images');
