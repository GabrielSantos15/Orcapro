"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  LineChart,
  Heart,
} from "lucide-react";
import Hero from "@/components/home/hero/Hero";
import Features from "@/components/home/features/Features";


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
      <Features></Features>
    </main>
  );
}
