import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminProfile } from "@/lib/auth/admin";
import { getAdminNavItems } from "@/lib/admin/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await requireAdminProfile();
  const navItems = getAdminNavItems(profile.role);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <div className="print:hidden">
        <AdminSidebar
          profileName={profile.nome}
          profileRole={profile.role}
          items={navItems}
        />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
