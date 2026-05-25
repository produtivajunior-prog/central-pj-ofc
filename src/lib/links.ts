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
  Rocket,
  Link as LinkIcon,
  Mail,
  Calendar,
  FileText,
  Folder,
  Globe,
  Heart,
  Image,
  MessageCircle,
  Settings,
  Star,
  Users,
  Video,
  Wallet,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type DbLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon_name: string;
  category: string;
  sort_order: number;
  created_at: string;
};

export const ICONS: Record<string, LucideIcon> = {
  UserPlus, CreditCard, AlertTriangle, Fuel, GraduationCap, Briefcase, BookOpen,
  Plane, BarChart3, Sparkles, Laptop, Lightbulb, Trophy, CalendarX, Rocket,
  Link: LinkIcon, Mail, Calendar, FileText, Folder, Globe, Heart, Image,
  MessageCircle, Settings, Star, Users, Video, Wallet, Wrench, Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? LinkIcon;
}
