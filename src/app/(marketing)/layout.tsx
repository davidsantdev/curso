import { MarketingFooter } from "@/components/marketing/footer";
import { MarketingNav } from "@/components/marketing/nav";
import { PrelaunchBar } from "@/components/prelaunch";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCatalog, videoProgress } from "@/lib/content";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [user, catalog] = await Promise.all([getCurrentUser(), getCatalog()]);

  return (
    <div className="bg-night-950 flex min-h-screen flex-col">
      <PrelaunchBar progress={videoProgress(catalog)} />
      <MarketingNav signedIn={Boolean(user)} />
      <main className="flex-1 bg-white">{children}</main>
      <MarketingFooter />
    </div>
  );
}
