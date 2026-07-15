import type { Database } from "../supabase/database.types";

type ProfileRole = Database["public"]["Enums"]["profile_role"];

export type AdminNavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
};

const navItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Denuncias", href: "/admin/denuncias" },
  { label: "Chamados", href: "/admin/chamados" },
  { label: "Conselheiros", href: "/admin/cadastros#conselheiros", adminOnly: true },
  { label: "Motivos", href: "/admin/cadastros#motivos", adminOnly: true },
  { label: "Medidas", href: "/admin/cadastros#medidas", adminOnly: true },
  { label: "Conselho", href: "/admin/cadastros#conselho", adminOnly: true },
  { label: "Relatorios", href: "/admin/relatorios" },
  { label: "Area publica", href: "/" },
];

export function getAdminNavItems(role: ProfileRole) {
  return navItems.filter((item) => role === "admin" || !item.adminOnly);
}
