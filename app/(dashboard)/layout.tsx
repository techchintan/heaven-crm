import {Sidebar} from "@/components/layout/sidebar";
import {SanityLive} from "@/sanity/lib/live";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="bg-background flex h-screen overflow-hidden">
        <Sidebar />
        <main className="bg-muted/20 flex-1 overflow-auto">{children}</main>
      </div>
      <SanityLive />
    </>
  );
}
