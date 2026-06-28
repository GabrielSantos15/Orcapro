"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldCheck, Sparkles, LineChart, Heart, Info } from "lucide-react";
import Hero from "@/components/home/hero/Hero";
import Features from "@/components/home/features/Features";
import Impact from "@/components/home/impact/Impact";
import Beneficits from "@/components/home/benefits/Benefits";
import Budget from "@/components/home/Budget/Budget";
import CtaStrip from "@/components/home/ctaStrip/CtaStrip";
import CarrosselBancos from "@/components/home/carrosel/carrosel";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import NotaTransparencia from "@/components/home/notaTransparencia/NotaTransparencia";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  if (token) {
    return null;
  }

  return (
    <main className="space-y-20">
      <Hero></Hero>
      <Beneficits></Beneficits>
      <CarrosselBancos></CarrosselBancos>
      <Features></Features>
      <Budget></Budget>
      <Impact></Impact>
      <NotaTransparencia></NotaTransparencia>
      <CtaStrip></CtaStrip>
    </main>
  );
}
