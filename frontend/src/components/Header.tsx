"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Cpu, Terminal, Radio } from "lucide-react";

export function Header() {
  const [timestamp, setTimestamp] = useState<string>("2026-11-02 11:00:00 UTC");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Neural Storm Logo"
              width={96}
              height={96}
              className="w-full h-full object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-wider text-zinc-900">
                SynthGuard
              </span>
              <span className="font-mono text-[11px] text-zinc-600 border border-zinc-200 bg-zinc-100 rounded px-1.5 py-0.5 font-medium">
                v2.4-PROD
              </span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 hidden sm:block">
              Artifact & Deepfake Forensics Engine
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Online</span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>ViT-H/14 INT8</span>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono text-zinc-600">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
