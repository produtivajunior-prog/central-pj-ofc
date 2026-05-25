## Visão geral
Sistema com duas páginas para a Produtiva Junior:
1. **Landing (`/`)** — grade visual de cards com os 14 links institucionais, cada um com ícone temático.
2. **Feed (`/feed`)** — mural estilo LinkedIn onde qualquer pessoa pode publicar (sem login), com foto, título, descrição e nome do autor.

Header compartilhado com o ícone azul como logo + navegação entre as duas páginas.

## Design
- Paleta Azul Produtiva: `#7EC8D3` (primary/accent do ícone), `#4A9FB8` (primary hover), `#0F2A44` (foreground/navy), `#F5F7FA` (background). Tokens em `src/styles.css` (oklch).
- Tipografia: Inter (corpo) + Space Grotesk (títulos), via Google Fonts.
- Layout: card-grid responsivo (1/2/3/4 colunas).
- Ícone enviado vira `public/logo.png` + favicon, usado no header.

## Página 1 — Landing `/`
- Header: logo + nome "Produtiva Junior" + nav (Início / Feed).
- Hero curto: título "Central de Links" + subtítulo.
- Grid de cards (um por link), cada card com:
  - Ícone Lucide temático (ver mapa abaixo)
  - Título do link
  - Botão "Acessar" abrindo em nova aba

Mapa link → ícone (lucide-react):
- Indicação de Leads → `UserPlus`
- Processo de Pagamentos → `CreditCard`
- Plano de Punição → `AlertTriangle`
- Reembolso Gasolina → `Fuel`
- Capacitação → `GraduationCap`
- Indicações Projetos → `Briefcase`
- Hangar Academy → `BookOpen`
- Formulário Milhas PJ → `Plane`
- Dashboard Milhas PJ → `BarChart3`
- ChatGPT → `Sparkles`
- Reserva Computadores → `Laptop`
- Sugestões de Inovações → `Lightbulb`
- Gamificação PTPJ → `Trophy`
- Formulário de Ausências → `CalendarX`

## Página 2 — Feed `/feed`
- Composer no topo: campos Nome do autor, Título, Descrição, upload de foto, botão "Publicar".
- Lista de posts (mais recentes primeiro), cada post como card estilo LinkedIn:
  - Avatar (inicial do nome) + nome do autor + data relativa
  - Título em destaque
  - Texto descritivo
  - Imagem da postagem

## Backend (Lovable Cloud, sem login)
- Tabela `posts`: `id uuid`, `author_name text`, `title text`, `description text`, `image_url text`, `created_at timestamptz`.
- RLS: `SELECT` público, `INSERT` público (sem auth), sem `UPDATE`/`DELETE` por enquanto.
- Storage bucket público `post-images` para as fotos.
- Leitura/escrita via server functions TanStack Start (`createServerFn`) + TanStack Query no client.

## Detalhes técnicos
- Rotas TanStack: `src/routes/index.tsx` (landing) e `src/routes/feed.tsx` (feed), cada uma com `head()` próprio (title/description/og).
- Header compartilhado em `src/routes/__root.tsx` acima do `<Outlet />`.
- Dados dos links num array em `src/lib/links.ts` para fácil manutenção.
- Server functions em `src/lib/posts.functions.ts` (`listPosts`, `createPost`) usando `supabaseAdmin` (já que não há auth).
- Upload de imagem: client envia para Storage via supabase-js (publishable key), depois chama `createPost` com a URL.
- Componentes shadcn existentes: Card, Button, Input, Textarea, Avatar.

## Arquivos a criar/alterar
- `src/styles.css` — tokens da paleta azul + fontes
- `src/routes/__root.tsx` — header + nav + meta global
- `src/routes/index.tsx` — landing com grid de links
- `src/routes/feed.tsx` — feed
- `src/lib/links.ts` — dados dos 14 links
- `src/lib/posts.functions.ts` — server fns
- `src/components/Header.tsx`, `src/components/LinkCard.tsx`, `src/components/PostCard.tsx`, `src/components/PostComposer.tsx`
- `public/logo.png` (cópia do ícone enviado) + favicon
- Migration SQL: tabela `posts` + bucket `post-images` + policies

## Fora do escopo (posso adicionar depois)
- Login/autenticação, curtidas/comentários, edição/exclusão de posts, moderação.
