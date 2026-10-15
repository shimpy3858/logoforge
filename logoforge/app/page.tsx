"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Studio from "@/components/Studio";

const Intro3D = dynamic(() => import("@/components/Intro3D"), { ssr: false });

export default function Home() {
  const [phase, setPhase] = useState<"pending" | "playing" | "closing" | "done">("pending");
  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("lf-intro") || window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    setPhase(seen ? "done" : "playing");
  }, []);
  useEffect(() => {
    if (phase !== "closing") return;
    const t = setTimeout(() => setPhase("done"), 1100);
    return () => clearTimeout(t);
  }, [phase]);
  const finish = () => {
    try { sessionStorage.setItem("lf-intro", "1"); } catch {}
    setPhase((p) => (p === "playing" ? "closing" : p));
  };
  return (
    <>
      {phase === "pending" && <div className="fixed inset-0 z-50 bg-[#05060a]" />}
      {(phase === "playing" || phase === "closing") && <Intro3D open={phase === "closing"} onOpen={finish} brand="LogoForge" />}
      <Studio />
    </>
  );
}
