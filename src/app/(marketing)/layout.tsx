import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingNav } from "@/components/marketing/nav";
import { getCurrentUser } from "@/lib/auth/dal";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MarketingNav signedIn={Boolean(user)} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
