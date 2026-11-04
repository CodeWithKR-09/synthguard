"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Loader2, Sparkles } from "lucide-react";
import { MediaFilePayload } from "@/types";

interface AnalysisSkeletonProps {
  payload: MediaFilePayload | null;
  onAnalysisComplete: () => void;
}

const SIMULATED_STAGES = [
  { progress: 14, message: "Validating binary integrity and computing SHA-256 digest..." },
  { progress: 32, message: "Extracting frames and normalizing spectral color spaces..." },
  { progress: 54, message: "Running ViT classifier across 16 latent transformer patches..." },
  { progress: 76, message: "Analyzing Discrete Cosine Transform (DCT) residual coefficients..." },
  { progress: 91, message: "Generating Grad-CAM class activation and heat map tensor..." },
  { progress: 100, message: "Inference finalized. Rendering forensic decision matrix..." },
];

export function AnalysisSkeleton({ payload, onAnalysisComplete }: AnalysisSkeletonProps) {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState(8);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < SIMULATED_STAGES.length) {
        const stage = SIMULATED_STAGES[step];
        setProgressPercent(stage.progress);
        const timestamp = new Date().toISOString().substring(11, 19);
        setLogLines((prev) => [...prev, `[${timestamp}] ${stage.message}`]);
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onAnalysisComplete();
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onAnalysisComplete]);

  return (
    <div className="w-full space-y-6">
      {/* Active Pipeline Status Banner */}
      <div className="border border-zinc-200 bg-white rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-semibold text-zinc-900">
                ACTIVE_INFERENCE_PIPELINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                PROCESSING
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-mono mt-0.5">
              TARGET: {payload?.name || "in_memory_payload.bin"} · {payload?.category?.toUpperCase() || "PAYLOAD"}
            </p>
          </div>
        </div>

        {/* Numeric percentage indicator with monospace font */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[11px] font-mono text-zinc-500">PROGRESS_METRIC</div>
            <div className="font-mono text-2xl font-bold text-blue-600 tabular-nums">
              {progressPercent}%
            </div>
          </div>
          <div className="w-28 bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* High-Fidelity Bento Skeleton Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column Skeleton (Verdict & Gauge placeholder) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="border border-zinc-200 bg-white rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
              <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse" />
            </div>

            {/* Circular Gauge Skeleton */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 rounded-full border-4 border-zinc-200 flex items-center justify-center animate-pulse">
                <div className="h-8 w-20 bg-zinc-200 rounded mb-2 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-zinc-200 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Quick Metrics Skeleton */}
          <div className="border border-zinc-200 bg-white rounded-lg p-5 space-y-3 shadow-sm">
            <div className="h-3 w-28 bg-zinc-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="h-14 bg-zinc-100 rounded border border-zinc-200/80 animate-pulse" />
              <div className="h-14 bg-zinc-100 rounded border border-zinc-200/80 animate-pulse" />
              <div className="h-14 bg-zinc-100 rounded border border-zinc-200/80 animate-pulse" />
              <div className="h-14 bg-zinc-100 rounded border border-zinc-200/80 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton (Heatmap & Comparison placeholder) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="border border-zinc-200 bg-white rounded-lg p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-4 w-44 bg-zinc-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-zinc-200 rounded animate-pulse" />
            </div>

            {/* Viewport Skeleton */}
            <div className="h-64 sm:h-72 w-full bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center relative overflow-hidden animate-pulse">
              <div className="text-center space-y-2">
                <Sparkles className="w-6 h-6 text-zinc-400 mx-auto animate-spin" />
                <div className="text-xs font-mono text-zinc-500 font-medium">
                  COMPUTING GRAD-CAM ATTENTION MAP
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-2 border-t border-zinc-200">
              <div className="h-3 w-24 bg-zinc-200 rounded animate-pulse" />
              <div className="h-3 w-36 bg-zinc-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Simulated Terminal Diagnostics Output (Light Mode Technical Console) */}
          <div className="border border-zinc-200 bg-white rounded-lg overflow-hidden font-mono text-xs shadow-sm">
            <div className="bg-zinc-100/80 px-4 py-2.5 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-zinc-800">
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-[11px] tracking-wide">
                  System Console · Inference Log
                </span>
              </div>
              <span className="text-[10px] text-zinc-500">TTY: console-01</span>
            </div>

            <div className="p-4 space-y-1.5 h-40 overflow-y-auto font-mono text-[11px] leading-relaxed bg-zinc-50/60">
              {logLines.map((line, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 shrink-0">&gt;</span>
                  <span className={idx === logLines.length - 1 ? "text-zinc-900 font-semibold" : "text-zinc-600"}>
                    {line}
                  </span>
                </div>
              ))}
              <div className="flex items-center space-x-2 pt-1 text-blue-600">
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
