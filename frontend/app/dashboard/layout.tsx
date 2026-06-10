import type { Metadata } from "next";
import { cookies } from "next/headers";
import Sidebar from "@/components/sidebar/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import GlobalModal from "@/components/modal/GlobalModal";
import { ThemeProvider } from "../context/ThemeContext";
import { THEMES, type Theme } from "@/lib/themes";

export const metadata: Metadata = {
  title: "Dashboard - OrcaPro",
  description: "Dashboard OrcaPro",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const rawTheme = cookieStore.get("orcapro-theme")?.value;

  const initialTheme: Theme = THEMES.some(
    (theme) => theme.id === rawTheme
  )
    ? (rawTheme as Theme)
    : "indigo";

  return (
    <AuthProvider>
      <ThemeProvider initialTheme={initialTheme}>
        <div className="h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] grid-rows-[1fr_auto] md:grid-rows-1">
          <aside className="fixed bottom-0 left-0 right-0 md:static md:col-auto md:row-auto z-50 md:z-auto">
            <Sidebar />
          </aside>

          <main className="overflow-y-auto overflow-x-hidden p-6 pb-30 md:pb-6">
            {children}
            <GlobalModal />
          </main>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}