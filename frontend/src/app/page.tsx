"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisSkeleton } from "@/components/AnalysisSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { AnalysisStatus, FailureCode, MediaFilePayload, AnalysisResult } from "@/types";
import { Shield, Activity, Terminal } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [activePayload, setActivePayload] = useState<MediaFilePayload | null>(null);
  const [errorCode, setErrorCode] = useState<FailureCode>("415");
  const [errorDetail, setErrorDetail] = useState<string | undefined>();
  const [backendResult, setBackendResult] = useState<AnalysisResult | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);

  const handleFileSelected = (payload: MediaFilePayload, fileObject: File) => {
    setActivePayload(payload);
    setActiveFile(fileObject); // Save for later
    setStatus("analyzing");
    executeInference(fileObject);
  };

  const executeInference = async (fileObject: File) => {
    try {
      const formData = new FormData();
      formData.append("file", fileObject);

      // Routing through the Next.js proxy to bypass all restrictions
      const response = await fetch(`/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend failed:", errorText);
        throw new Error(`Pipeline Error: ${response.status}`);
      }

      // PyTorch finished! Parse the tri-model data
      const data: AnalysisResult = await response.json();
      
      // Inject the live data into the dashboard and stop the endless spinner
      setBackendResult(data);
      setStatus("results");

    } catch (err: any) {
      console.error(err);
      handleErrorTrigger("504", err.message || "Inference engine timed out.");
    }
  };

  const handleErrorTrigger = (code: FailureCode, detail?: string) => {
    setErrorCode(code);
    setErrorDetail(detail);
    setStatus("error");
  };

  const handleAnalysisComplete = () => {
    
  };

  const handleResetToUpload = () => {
    setActivePayload(null);
    setActiveFile(null);
    setStatus("idle");
  };

  const handleRetryInference = () => {
    if (activeFile) {
      setStatus("analyzing");
      executeInference(activeFile);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Title & Diagnostic Telemetry Bar */}
        <div className="mb-8 border-b border-zinc-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 font-sans">
              Neural Artifact & Deepfake Forensics
            </h1>
            <p className="text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
              SynthGuard is a multimodal detection engine that inspects uploaded images, video, and audio to flag AI-generated disinformation. It provides users with a real versus synthetic probability score, an explainable heatmap of suspicious regions, and a short text verdict.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-white border border-zinc-200 text-zinc-700 shadow-sm">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>STATUS:</span>
              <span
                className={`font-semibold ${
                  status === "analyzing"
                    ? "text-blue-600 animate-pulse"
                    : status === "error"
                    ? "text-rose-600"
                    : status === "results"
                    ? "text-emerald-600"
                    : "text-zinc-600"
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded bg-white border border-zinc-200 text-zinc-600 shadow-sm">
              <Terminal className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cluster Sync: 99.98%</span>
            </div>
          </div>
        </div>

        {/* State Management Rendering (Strict Component Isolation) */}
        <div className="transition-all duration-300">
          {status === "idle" && (
            <UploadZone
              onFileSelected={handleFileSelected}
              onErrorTrigger={handleErrorTrigger}
            />
          )}

          {status === "analyzing" && (
            <AnalysisSkeleton
              payload={activePayload}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {status === "error" && (
            <ErrorBanner
              code={errorCode}
              customDetail={errorDetail}
              onReset={handleResetToUpload}
              onRetry={handleRetryInference}
            />
          )}

          {status === "results" && (
            <ResultsDashboard
              payload={activePayload}
              onNewAnalysis={handleResetToUpload}
              result={backendResult}
            />
          )}
        </div>
      </main>

      {/* Technical Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-600 gap-2">
          <div className="flex items-center space-x-2.5">
            <Image
              src="/logo.png"
              alt="Neural Storm Logo"
              width={32}
              height={32}
              className="w-6 h-6 object-contain shrink-0"
              unoptimized
            />
            <span>Neural Storm Defense Architecture · Air-Gapped Verification</span>
          </div>
          <div>
            <span>RFC 9110 Specification · Zero Retention Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
