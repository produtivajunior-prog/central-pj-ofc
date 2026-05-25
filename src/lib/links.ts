import {
  UserPlus,
  CreditCard,
  AlertTriangle,
  Fuel,
  GraduationCap,
  Briefcase,
  BookOpen,
  Plane,
  BarChart3,
  Sparkles,
  Laptop,
  Lightbulb,
  Trophy,
  CalendarX,
  type LucideIcon,
} from "lucide-react";

export type LinkItem = {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
  category: string;
};

export const links: LinkItem[] = [
  {
    title: "Indicação de Leads",
    description: "Indique novos membros para a Produtiva Junior.",
    url: "https://wkf.ms/4hYmvAA",
    icon: UserPlus,
    category: "Pessoas",
  },
  {
    title: "Processo de Pagamentos",
    description: "Envie solicitações de pagamento.",
    url: "https://forms.monday.com/forms/462cabbf814a7fbaf9843c515585b281?r=use1",
    icon: CreditCard,
    category: "Financeiro",
  },
  {
    title: "Plano de Punição",
    description: "Formulário oficial do plano de punição.",
    url: "https://forms.monday.com/forms/2004c39a26f365daa64fa88cee9f6cd0?r=use1",
    icon: AlertTriangle,
    category: "Gestão",
  },
  {
    title: "Reembolso Gasolina",
    description: "Solicite reembolso de combustível.",
    url: "https://docs.google.com/spreadsheets/d/1p4BvRj0iicLKCzgE_6DwcCi_uUeUBp1Pp8eBe5JWJlc/edit#gid=1129250148",
    icon: Fuel,
    category: "Financeiro",
  },
  {
    title: "Formulário de Capacitação",
    description: "Cadastre capacitações realizadas.",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeTGv_x-Iy4TQs_yVLagi83wr2GS_uBtNGfy4NUQoCLuAY4vw/viewform?usp=sharing",
    icon: GraduationCap,
    category: "Aprendizado",
  },
  {
    title: "Indicações de Projetos",
    description: "Indique novos projetos para a empresa.",
    url: "https://forms.monday.com/forms/2ea964bb39c557065f60f4734c446bff?r=use1",
    icon: Briefcase,
    category: "Projetos",
  },
  {
    title: "Hangar Academy",
    description: "Plataforma de conhecimento da PJ.",
    url: "https://sites.google.com/produtivajunior.com.br/hangaracademy/in%C3%ADcio",
    icon: BookOpen,
    category: "Aprendizado",
  },
  {
    title: "Formulário Milhas PJ",
    description: "Registre milhas para o programa interno.",
    url: "https://forms.monday.com/forms/22f362e7485e704d07d4dd9b07da1ffd?r=use1",
    icon: Plane,
    category: "Milhas",
  },
  {
    title: "Dashboard Milhas PJ",
    description: "Acompanhe sua pontuação no programa.",
    url: "https://view.monday.com/9607001988-08cd64f7db35003eaa95f7a4c5ec8ea7?r=use1",
    icon: BarChart3,
    category: "Milhas",
  },
  {
    title: "ChatGPT Produtiva",
    description: "Assistente GPT customizado da PJ.",
    url: "https://chatgpt.com/g/g-68b72680b97c8191b666271da1e93212-produtiva-junior-gpt",
    icon: Sparkles,
    category: "Ferramentas",
  },
  {
    title: "Reserva de Computadores",
    description: "Reserve computadores da Produtiva.",
    url: "https://forms.monday.com/forms/3d74502204db0814c1532c0757817a5f?r=use1",
    icon: Laptop,
    category: "Recursos",
  },
  {
    title: "Sugestões de Inovações",
    description: "Compartilhe ideias para inovar.",
    url: "https://forms.monday.com/forms/5c4520bbbd7b6507f0e4107692ed5d99?r=use1",
    icon: Lightbulb,
    category: "Inovação",
  },
  {
    title: "Gamificação PTPJ",
    description: "Formulário da gamificação interna.",
    url: "https://docs.google.com/forms/d/1c0R2tUXFyPbizkUC3mQ9UE9kjOi2G7ZOCuieoJYIEd8/edit",
    icon: Trophy,
    category: "Cultura",
  },
  {
    title: "Formulário de Ausências",
    description: "Comunique ausências e faltas.",
    url: "https://forms.gle/NHF3NLTW7AvNGstm6",
    icon: CalendarX,
    category: "Gestão",
  },
];
