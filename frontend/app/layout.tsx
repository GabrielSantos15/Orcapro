import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "OrcaPro",
  description: "Fintech fiap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning className={`h-full antialiased ${poppins.variable}`}>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Providers>
          {children}
          <Toaster></Toaster> 
        </Providers>
      </body>
    </html>
  );
}
