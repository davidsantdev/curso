import type { Metadata } from "next";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav";
import { Logo } from "@/components/logo";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: { default: "Administração", template: "%s · Admin" },
  robots: { index: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Cada página e cada action do admin também confere o acesso (o layout não basta).
  await requireAdmin();

  return (
    <div className="bg-surface min-h-screen">
      <AdminSidebar />
      <div className="lg:pl-64">
        <header className="border-line flex h-16 items-center gap-2 border-b bg-white px-5 lg:hidden">
          <Logo href="/admin" />
          <span className="badge bg-navy-900 text-white">Admin</span>
        </header>
        <AdminMobileNav />
        <main className="px-5 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
