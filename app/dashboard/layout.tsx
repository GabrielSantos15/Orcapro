import type { Metadata } from "next";
import Sidebar from "@/components/sidebar/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import GlobalModal from "@/components/modal/GlobalModal";

export const metadata: Metadata = {
  title: "Dashboard - OrcaPro",
  description: "Dashboard OrcaPro",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div className="h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] grid-rows-[1fr_auto] md:grid-rows-1">
        <aside className="fixed bottom-0 left-0 right-0 md:static md:col-auto md:row-auto z-50 md:z-auto">
          <Sidebar />
        </aside>
        <main className="overflow-y-auto p-6 pb-20 md:pb-6">{children}<GlobalModal /></main>
      </div>
    </AuthProvider>
  );
}
