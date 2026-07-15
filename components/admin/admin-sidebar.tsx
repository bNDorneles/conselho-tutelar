"use client";

import {
  BarChart3,
  ClipboardList,
  FileWarning,
  Home,
  Landmark,
  LayoutDashboard,
  LogOut,
  Scale,
  ShieldCheck,
  History,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import type { AdminNavItem } from "@/lib/admin/navigation";
import { cn } from "@/lib/utils";

const navIcons = {
  Dashboard: LayoutDashboard,
  Denuncias: FileWarning,
  Chamados: ClipboardList,
  Conselheiros: UserRound,
  Motivos: Scale,
  Medidas: ShieldCheck,
  Conselho: Landmark,
  Relatorios: BarChart3,
  Auditoria: History,
  "Area publica": Home,
};

type AdminSidebarProps = {
  profileName: string;
  profileRole: string;
  items: AdminNavItem[];
};

function isActivePath(pathname: string, href: string) {
  const cleanHref = href.split("#")[0];

  if (cleanHref === "/") {
    return false;
  }

  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function AdminSidebar({
  profileName,
  profileRole,
  items,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-card lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 lg:h-full lg:max-w-none">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold leading-tight">
            Conselho Tutelar
            <span className="block text-xs font-normal text-muted-foreground">
              Painel interno
            </span>
          </span>
        </Link>

        <div className="rounded-lg border bg-background px-3 py-2">
          <p className="truncate text-sm font-medium">{profileName}</p>
          <p className="text-xs capitalize text-muted-foreground">
            {profileRole}
          </p>
        </div>

        <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {items.map((item) => {
            const Icon = navIcons[item.label as keyof typeof navIcons] ?? Home;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-secondary text-secondary-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={signOutAction} className="mt-auto">
          <Button type="submit" variant="outline" className="w-full gap-2">
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        </form>
      </div>
    </aside>
  );
}
