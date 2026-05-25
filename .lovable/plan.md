# Plano — Central PJ v2

## 1. Renomear o sistema para "Central PJ"
- `src/components/Header.tsx`: trocar "Produtiva Junior" / "Central interna" por **"Central PJ"** + subtítulo "Produtiva Junior".
- `src/routes/__root.tsx` e `src/routes/index.tsx`: atualizar `<title>`, meta description e o `<h1>` do hero.

## 2. Novo link
- Adicionar em `src/lib/links.ts` (usado como seed inicial):
  - **Funil de Ideias de Inovação** — `https://funildeinovação.produtivajunior.com.br` — ícone `Rocket` — categoria "Inovação".

## 3. Login de administrador (simples, sem cadastro)
Como é uma credencial única e compartilhada, **não** vou usar o sistema de auth do Cloud (que exige conta por usuário). Vou implementar uma verificação local:

- Credencial fixa no código:
  - email: `admin@produtivajunior.com.br`
  - senha: `produtivajr12`
- Nova rota `/login` com formulário (email + senha).
  - Se OK → salva `centralpj_admin = "1"` em `localStorage` e redireciona para `/`.
  - Se errado → mostra erro.
- Hook `useAdmin()` lê o flag do localStorage e expõe `isAdmin` + `logout()`.
- Tela inicial **continua pública** (qualquer um acessa sem login). O botão "Entrar como admin" fica no header; quando logado, vira "Sair" + badge "Admin".

> Observação: como a senha fica embutida no bundle JS, qualquer pessoa com acesso ao código-fonte pode lê-la. Isso é aceitável para um "modo edição" interno, mas não é segurança real. Se no futuro quiser proteção de verdade, migramos para Lovable Cloud Auth.

## 4. Links editáveis pelo admin
Mover os links do arquivo estático para o banco para que edições persistam para todo mundo.

- Migration:
  - Tabela `links` (id, title, description, url, icon_name, category, sort_order, created_at).
  - RLS: leitura pública (`SELECT` para todos); `INSERT/UPDATE/DELETE` liberados (a checagem de admin é feita no client). 
  - Seed com os 15 links atuais (14 existentes + Funil de Inovação).
- `src/lib/links.ts` vira apenas o mapa `icon_name → LucideIcon` + tipos.
- `listLinks` e (apenas para admin) `upsertLink` / `deleteLink` como `createServerFn`.
- Página inicial usa `useSuspenseQuery(listLinks)` em vez do array estático.
- Quando `isAdmin === true`:
  - Cada `LinkCard` ganha botões **Editar** / **Excluir** no hover.
  - Botão flutuante **"+ Novo link"** abre dialog (shadcn `Dialog` + `Form`) com campos título, descrição, URL, categoria e seletor de ícone (lista curada de ~30 ícones Lucide).
  - Submeter chama o server fn e invalida a query.

## 5. Mascote avião animado com fumaça
- Copiar imagem enviada para `src/assets/aviao-mascote.png`.
- Novo componente `PlaneMascot.tsx` posicionado `fixed inset-0 pointer-events-none z-30`:
  - Avião (80px) animado com **Framer Motion** (já bem suportado) percorrendo uma rota suave pela tela: keyframes em `x`, `y` e leve `rotate`, `duration: 25s`, `repeat: Infinity`, `ease: easeInOut`. A trajetória cobre cantos diferentes para parecer que ele "explora" o sistema.
  - **Rastro de fumaça**: a cada ~120 ms emite uma `div` circular branca/cinza atrás do avião, que faz fade-out + scale-up + leve drift para cima em ~1.5s (animação CSS keyframes em `styles.css`). Implementado com estado local `puffs: {id,x,y}[]` e `setTimeout` para remover.
  - Leve "balanço" (rotate ±5°) num loop curto para dar vida.
- Montado em `__root.tsx` para aparecer em todas as páginas (inclui Feed). Não aparece em `/login` (rota cheia de formulário).
- Respeita `prefers-reduced-motion`: se ativo, mostra o avião parado num canto sem fumaça.

## Arquivos a criar/editar

**Criar**
- `src/assets/aviao-mascote.png` (cópia do upload)
- `src/routes/login.tsx`
- `src/hooks/useAdmin.ts`
- `src/components/PlaneMascot.tsx`
- `src/components/admin/LinkFormDialog.tsx`
- `src/lib/links.functions.ts` (list/upsert/delete)
- `supabase/migrations/<novo>.sql` (tabela `links` + seed)

**Editar**
- `src/components/Header.tsx` (nome + botão login/sair)
- `src/components/LinkCard.tsx` (ações admin)
- `src/lib/links.ts` (vira mapa de ícones)
- `src/routes/__root.tsx` (montar `PlaneMascot`, atualizar meta)
- `src/routes/index.tsx` (carregar links do banco, botão "+ Novo link", título "Central PJ")
- `src/styles.css` (keyframes da fumaça)

## Fora de escopo
- Auth real multi-usuário, recuperação de senha.
- Permissão de edição no Feed (continua público como hoje).
- Reordenar links via drag-and-drop (a tabela já tem `sort_order` para evoluir depois).
