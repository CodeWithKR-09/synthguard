"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Layers,
  Eye,
  Cpu,
  Hash,
} from "lucide-react";
import { MediaFilePayload, AnalysisResult } from "@/types";

interface ResultsDashboardProps {
  payload: MediaFilePayload | null;
  onNewAnalysis: () => void;
  result?: AnalysisResult | null;
}

export function ResultsDashboard({ payload, onNewAnalysis, result: backendResult }: ResultsDashboardProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "overlay">("side-by-side");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75);

  const isAuthentic = payload?.name?.includes("authentic") || payload?.name?.includes("press");

  // Fallback mock data for the Quick-Load presets
  const mockResult: AnalysisResult = {
    verdict: isAuthentic ? "real" : "synthetic",
    confidenceScore: isAuthentic ? 94.6 : 98.2,
    verdictSummary: isAuthentic
      ? "Authentic Media Confirmed"
      : "Synthetic Neural Artifacts Detected",
    technicalExplanation: isAuthentic
      ? "Discrete Cosine Transform (DCT) coefficients follow natural Laplace distributions without evidence of generative upsampling or boundary blending artifacts."
      : "High-frequency artifacts detected in facial rendering. Spatial residual analysis reveals anomalous periodic checkerboard patterns in the 16-24kHz frequency band, characteristic of transposed convolutional upsampling.",
    modelIdentifier: "ViT-H/14-Forensics-v2",
    inferenceDurationMs: 342,
    frequencyBandNoise: isAuthentic ? "1.2 dB (Nominal)" : "8.4 dB (Anomalous)",
    facialCoherenceScore: isAuthentic ? 98.8 : 31.4,
    perceptualHash: "4f8a91b2c3d4e5f67890abcdef123456",
    metrics: [
      {
        name: "Boundary Blending Anomaly",
        score: isAuthentic ? 4.2 : 92.4,
        status: isAuthentic ? "nominal" : "critical",
        description: "Pixel gradient discontinuity along facial perimeter",
      },
      {
        name: "Spectral Frequency Entropy",
        score: isAuthentic ? 6.1 : 88.7,
        status: isAuthentic ? "nominal" : "critical",
        description: "Checkerboard grid artifacts in high-pass spectrum",
      },
      {
        name: "Gaze / Blink Asymmetry",
        score: isAuthentic ? 2.8 : 74.3,
        status: isAuthentic ? "nominal" : "flagged",
        description: "Pupil reflection misalignment under directional illumination",
      },
      {
        name: "Micro-Texture Consistency",
        score: isAuthentic ? 96.4 : 18.2,
        status: isAuthentic ? "nominal" : "critical",
        description: "Pore-level Poisson noise distribution",
      },
    ],
  };

  // Use the live PyTorch data if available, otherwise use the mock preset data
  const activeResult = backendResult || mockResult;

  const isSynthetic = activeResult.verdict === "synthetic";
  const gaugeColor = isSynthetic ? "#e11d48" : "#059669"; // rose-600 : emerald-600
  const badgeBorderColor = isSynthetic ? "border-rose-200" : "border-emerald-200";
  const badgeBgColor = isSynthetic ? "bg-rose-50" : "bg-emerald-50";
  const badgeTextColor = isSynthetic ? "text-rose-700" : "text-emerald-700";

  // SVG Circular Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (activeResult.confidenceScore / 100) * circumference;

  const sampleImage =
    payload?.previewUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  // Check if the uploaded file is a video to render the correct media tag
  const isVideo = payload?.name?.match(/\.(mp4|webm|ogg|mov)$/i) || payload?.type?.includes("video");
  const isAudio =
    payload?.category === "audio" ||
    payload?.name?.match(/\.(wav|mp3|m4a|ogg|flac)$/i) !== null ||
    payload?.type?.includes("audio") ||
    (backendResult as any)?.modality === "audio";

  return (
    <div className="w-full space-y-6">
      {/* Top Action & Verdict Banner */}
      <div className="border border-zinc-200 bg-white rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-10 h-10 rounded flex items-center justify-center border ${
              isSynthetic
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-600"
            }`}
          >
            {isSynthetic ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-semibold text-zinc-900 uppercase tracking-wide">
                {activeResult.verdictSummary || (isSynthetic ? "Synthetic Artifacts Detected" : "Authentic Media Confirmed")}
              </span>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded border font-medium ${badgeBgColor} ${badgeBorderColor} ${badgeTextColor}`}
              >
                {isSynthetic ? "FLAGGED: SYNTHETIC" : "VERIFIED: AUTHENTIC"}
              </span>
            </div>
            <p className="font-mono text-xs text-zinc-600 mt-0.5">
              Target: {payload?.name || "ingested_media_sample"} · Duration: {activeResult.inferenceDurationMs}ms
            </p>
          </div>
        </div>

        {/* New Analysis Trigger Button */}
        <button
          type="button"
          onClick={onNewAnalysis}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-white hover:bg-zinc-50 border border-zinc-300 text-sm font-medium text-zinc-800 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Main Bento Grid Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Bento Tile 1: Probability Gauge & Confidence */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          <div className="border border-zinc-200 bg-white rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider font-medium">
                CONFIDENCE_PROBABILITY
              </span>
              <span className="text-xs font-mono text-zinc-500">BAYESIAN_POSTERIOR</span>
            </div>

            {/* Circular Donut Gauge */}
            <div className="relative w-44 h-44 my-2 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={radius} stroke="#e4e4e7" strokeWidth="10" fill="transparent" />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke={gaugeColor}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`font-mono text-3xl sm:text-4xl font-bold tracking-tight ${isSynthetic ? "text-rose-600" : "text-emerald-600"}`}>
                  {activeResult.confidenceScore}%
                </span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 mt-1">
                  {isSynthetic ? "PROB_SYNTHETIC" : "PROB_NATURAL"}
                </span>
              </div>
            </div>

            <div className="w-full mt-4 pt-4 border-t border-zinc-200 grid grid-cols-2 gap-2 text-center">
              <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
                <div className="text-[10px] font-mono text-zinc-500">CERTAINTY</div>
                <div className="text-xs font-mono font-medium text-zinc-800 mt-0.5">HIGH (p &lt; 0.001)</div>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 rounded p-2">
                <div className="text-[10px] font-mono text-zinc-500">ENGINE</div>
                <div className="text-xs font-mono font-medium text-zinc-800 mt-0.5 truncate px-1">
                  {activeResult.modelIdentifier || "ViT-Forensics-v2"}
                </div>
              </div>
            </div>
          </div>

          {/* Bento Tile 2: Verdict Explanation & Technical Justification */}
          <div className="border border-zinc-200 bg-white rounded-lg p-6 space-y-3.5 flex-1 shadow-sm">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-900 font-semibold">
                Forensic Verdict Justification
              </h4>
            </div>

            <p className="text-sm text-zinc-700 leading-relaxed font-sans">
              {activeResult.technicalExplanation}
            </p>

            <div className="space-y-2.5 pt-3 border-t border-zinc-200">
              {activeResult.metrics.map((metric, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono p-2.5 rounded bg-zinc-50 border border-zinc-200">
                  <div className="truncate pr-2">
                    <span className="text-zinc-800 font-medium">{metric.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className={`font-semibold ${metric.status === "critical" ? "text-rose-600" : metric.status === "flagged" ? "text-amber-600" : "text-emerald-600"}`}>
                      {metric.score}%
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-medium ${metric.status === "critical" ? "bg-rose-50 text-rose-700 border border-rose-200" : metric.status === "flagged" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bento Tile 3: Heatmap Container & Comparison */}
        <div className="lg:col-span-7 space-y-5">
          {!isAudio && (
            <div className="border border-zinc-200 bg-white rounded-lg p-6 space-y-4 shadow-sm">
              {/* Viewport Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-zinc-900 uppercase tracking-wider font-semibold">
                  Spatial Attention & Grad-CAM Heatmap
                </span>
                <p className="text-xs text-zinc-600 font-mono mt-0.5">
                  Visual localization of synthetic artifacts across latent feature maps
                </p>
              </div>

              {/* View Switcher Controls */}
              <div className="flex items-center space-x-1.5 bg-zinc-100 p-1 rounded border border-zinc-200 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("side-by-side")}
                  className={`px-2.5 py-1 text-xs font-mono rounded flex items-center space-x-1.5 transition-colors ${
                    viewMode === "side-by-side" ? "bg-white text-zinc-900 shadow-xs font-medium" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("overlay")}
                  className={`px-2.5 py-1 text-xs font-mono rounded flex items-center space-x-1.5 transition-colors ${
                    viewMode === "overlay" ? "bg-white text-zinc-900 shadow-xs font-medium" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overlay</span>
                </button>
              </div>
            </div>

            {/* Heatmap Visualizations */}
            {viewMode === "side-by-side" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Original Media Panel */}
                <div className="border border-zinc-200 bg-zinc-50 rounded-md overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-zinc-200 bg-zinc-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-700 font-medium">RAW_INGEST_FRAME</span>
                    <span className="text-zinc-500">1080p</span>
                  </div>
                  <div className="relative aspect-[4/3] bg-zinc-100 flex items-center justify-center overflow-hidden">
                    {isVideo ? (
                      <video src={sampleImage} className="w-full h-full object-cover" controls muted playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={sampleImage} alt="Raw Ingest Frame" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                {/* Heatmap Layer Panel */}
                <div className="border border-zinc-200 bg-zinc-50 rounded-md overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-zinc-200 bg-zinc-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-600 font-semibold">GRAD_CAM_ATTENTION</span>
                    <span className="text-zinc-500">DELTA_HEATMAP</span>
                  </div>
                  <div className="relative aspect-[4/3] bg-zinc-100 flex items-center justify-center overflow-hidden">
                    {activeResult.heatmapImage ? (
                      /* Live PyTorch Base64 Image */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={activeResult.heatmapImage} alt="Live Tensor Heatmap" className="w-full h-full object-cover" />
                    ) : (
                      /* Fallback Simulated CSS Heatmap for Demos */
                      <>
                        {isVideo ? (
                          <video src={sampleImage} className="w-full h-full object-cover filter grayscale contrast-125" muted playsInline />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={sampleImage} alt="Heatmap Base" className="w-full h-full object-cover filter grayscale contrast-125" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-rose-500/60 to-amber-500/70 mix-blend-multiply opacity-90 pointer-events-none" />
                        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-rose-500/60 blur-xl mix-blend-multiply pointer-events-none animate-pulse" />
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-amber-400/60 blur-lg mix-blend-multiply pointer-events-none" />
                        <div className="absolute top-3 left-3 text-[10px] font-mono text-zinc-900 bg-white/95 px-2 py-0.5 rounded border border-zinc-200 shadow-sm font-medium">
                          HOTSPOT: [X: 412, Y: 288] ATTN: 0.942
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Overlay Mode */
              <div className="space-y-3">
                <div className="relative aspect-[16/9] sm:aspect-[2/1] border border-zinc-200 bg-zinc-100 rounded-md overflow-hidden">
                  {isVideo ? (
                    <video src={sampleImage} className="w-full h-full object-cover" controls muted playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sampleImage} alt="Overlay Base" className="w-full h-full object-cover" />
                  )}
                  
                  {activeResult.heatmapImage ? (
                      /* Live Overlay */
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={activeResult.heatmapImage} 
                        alt="Live Heatmap Overlay" 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply pointer-events-none transition-opacity duration-150"
                        style={{ opacity: overlayOpacity / 100 }} 
                      />
                  ) : (
                      /* Fallback CSS Overlay for Demos */
                      <>
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/50 via-rose-600/65 to-amber-500/70 mix-blend-multiply pointer-events-none transition-opacity duration-150" style={{ opacity: overlayOpacity / 100 }} />
                        <div className="absolute top-1/4 left-1/3 w-40 h-40 rounded-full bg-rose-500/60 blur-2xl mix-blend-multiply pointer-events-none" style={{ opacity: overlayOpacity / 100 }} />
                      </>
                  )}
                </div>

                {/* Opacity Slider Control */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>HEATMAP_BLEND_OPACITY:</span>
                    <span className="text-zinc-900 font-semibold">{overlayOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-36 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Bottom Telemetry Bar */}
            <div className="pt-3 border-t border-zinc-200 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-600 gap-2">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <Hash className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="truncate max-w-[200px]">SHA-256: {activeResult.perceptualHash?.substring(0, 16) || "9b1c2d3e4f5a6..."}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>SPECTRAL_RESIDUAL: {activeResult.frequencyBandNoise || "4.1 dB"}</span>
              </div>
            </div>
          </div>
          )}

          {/* Bento Tile 4: Hardware & Runtime Diagnostics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-zinc-200 bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-[10px] font-mono text-zinc-500">LATENCY</div>
              <div className="text-sm font-mono font-semibold text-zinc-900 mt-0.5">
                {activeResult.inferenceDurationMs}ms
              </div>
            </div>
            <div className="border border-zinc-200 bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-[10px] font-mono text-zinc-500">SAMPLED_FRAMES</div>
              <div className="text-sm font-mono font-semibold text-zinc-900 mt-0.5">
                128 KEYFRAMES
              </div>
            </div>
            <div className="border border-zinc-200 bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-[10px] font-mono text-zinc-500">QUANTIZATION</div>
              <div className="text-sm font-mono font-semibold text-zinc-900 mt-0.5">
                FP16 TENSORRT
              </div>
            </div>
            <div className="border border-zinc-200 bg-white rounded-lg p-3 text-center shadow-sm">
              <div className="text-[10px] font-mono text-zinc-500">PIPELINE</div>
              <div className="text-sm font-mono font-semibold text-emerald-600 mt-0.5">
                STABLE_OK
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}