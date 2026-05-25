
CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  icon_name text NOT NULL,
  category text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read links" ON public.links FOR SELECT USING (true);
CREATE POLICY "Anyone can insert links" ON public.links FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update links" ON public.links FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete links" ON public.links FOR DELETE USING (true);

INSERT INTO public.links (title, description, url, icon_name, category, sort_order) VALUES
('Indicação de Leads','Indique novos membros para a Produtiva Junior.','https://wkf.ms/4hYmvAA','UserPlus','Pessoas',1),
('Processo de Pagamentos','Envie solicitações de pagamento.','https://forms.monday.com/forms/462cabbf814a7fbaf9843c515585b281?r=use1','CreditCard','Financeiro',2),
('Plano de Punição','Formulário oficial do plano de punição.','https://forms.monday.com/forms/2004c39a26f365daa64fa88cee9f6cd0?r=use1','AlertTriangle','Gestão',3),
('Reembolso Gasolina','Solicite reembolso de combustível.','https://docs.google.com/spreadsheets/d/1p4BvRj0iicLKCzgE_6DwcCi_uUeUBp1Pp8eBe5JWJlc/edit#gid=1129250148','Fuel','Financeiro',4),
('Formulário de Capacitação','Cadastre capacitações realizadas.','https://docs.google.com/forms/d/e/1FAIpQLSeTGv_x-Iy4TQs_yVLagi83wr2GS_uBtNGfy4NUQoCLuAY4vw/viewform?usp=sharing','GraduationCap','Aprendizado',5),
('Indicações de Projetos','Indique novos projetos para a empresa.','https://forms.monday.com/forms/2ea964bb39c557065f60f4734c446bff?r=use1','Briefcase','Projetos',6),
('Hangar Academy','Plataforma de conhecimento da PJ.','https://sites.google.com/produtivajunior.com.br/hangaracademy/in%C3%ADcio','BookOpen','Aprendizado',7),
('Formulário Milhas PJ','Registre milhas para o programa interno.','https://forms.monday.com/forms/22f362e7485e704d07d4dd9b07da1ffd?r=use1','Plane','Milhas',8),
('Dashboard Milhas PJ','Acompanhe sua pontuação no programa.','https://view.monday.com/9607001988-08cd64f7db35003eaa95f7a4c5ec8ea7?r=use1','BarChart3','Milhas',9),
('ChatGPT Produtiva','Assistente GPT customizado da PJ.','https://chatgpt.com/g/g-68b72680b97c8191b666271da1e93212-produtiva-junior-gpt','Sparkles','Ferramentas',10),
('Reserva de Computadores','Reserve computadores da Produtiva.','https://forms.monday.com/forms/3d74502204db0814c1532c0757817a5f?r=use1','Laptop','Recursos',11),
('Sugestões de Inovações','Compartilhe ideias para inovar.','https://forms.monday.com/forms/5c4520bbbd7b6507f0e4107692ed5d99?r=use1','Lightbulb','Inovação',12),
('Gamificação PTPJ','Formulário da gamificação interna.','https://docs.google.com/forms/d/1c0R2tUXFyPbizkUC3mQ9UE9kjOi2G7ZOCuieoJYIEd8/edit','Trophy','Cultura',13),
('Formulário de Ausências','Comunique ausências e faltas.','https://forms.gle/NHF3NLTW7AvNGstm6','CalendarX','Gestão',14),
('Funil de Ideias de Inovação','Acompanhe o funil de ideias da PJ.','https://funildeinovação.produtivajunior.com.br','Rocket','Inovação',15);
