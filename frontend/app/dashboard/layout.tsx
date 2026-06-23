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
        <div className="flex min-h-screen w-full relative">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
            <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-32 md:pb-8">
              {children}
            </div>
            <GlobalModal />
          </main>
          
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}