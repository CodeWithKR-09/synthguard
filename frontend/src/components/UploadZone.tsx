"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileVideo,
  FileAudio,
  FileImage,
  AlertTriangle,
  HardDrive,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { MediaFilePayload, FailureCode } from "@/types";

interface UploadZoneProps {
  onFileSelected: (payload: MediaFilePayload, fileObject: File) => void;
  onErrorTrigger: (code: FailureCode, detail?: string) => void;
}

export function UploadZone({ onFileSelected, onErrorTrigger }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedExtensions = [".jpg", ".jpeg", ".png", ".mp4", ".wav"];
  const maxSizeBytes = 100 * 1024 * 1024; // 100 MB ceiling

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    const fileName = file.name.toLowerCase();
    const isSupported = acceptedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isSupported) {
      onErrorTrigger("415", `Provided MIME type '${file.type || "unknown"}' is unindexed.`);
      return;
    }

    if (file.size > maxSizeBytes) {
      onErrorTrigger("413", `Payload size ${(file.size / (1024 * 1024)).toFixed(1)}MB exceeds limit.`);
      return;
    }

    let category: "image" | "video" | "audio" = "image";
    if (fileName.endsWith(".mp4")) category = "video";
    else if (fileName.endsWith(".wav")) category = "audio";

    const previewUrl = URL.createObjectURL(file);

    onFileSelected({
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      previewUrl,
      category,
    }, file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Pre-configured mock artifacts for instant demo evaluation
  const handleQuickLoad = (type: "synthetic_img" | "authentic_vid" | "synthetic_audio") => {
    
    // Helper to generate a dummy file to satisfy TypeScript and the FastAPI backend payload requirement
    const createMockFile = (name: string, mime: string) => new File(["mock_data"], name, { type: mime });

    if (type === "synthetic_img") {
      onFileSelected({
        name: "target_subject_render_v4.png",
        size: 3481200,
        type: "image/png",
        previewUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        category: "image",
      }, createMockFile("target_subject_render_v4.png", "image/png"));
      
    } else if (type === "authentic_vid") {
      onFileSelected({
        name: "press_conference_feed_cam02.mp4",
        size: 14200800,
        type: "video/mp4",
        previewUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
        category: "video",
      }, createMockFile("press_conference_feed_cam02.mp4", "video/mp4")); 
      
    } else {
      onFileSelected({
        name: "intercepted_voip_telemetry.wav",
        size: 2190400,
        type: "audio/wav",
        previewUrl: "",
        category: "audio",
      }, createMockFile("intercepted_voip_telemetry.wav", "audio/wav")); 
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Primary Ingestion Zone */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-10 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center group ${
          isDragging
            ? "border-blue-600 bg-blue-50/70 shadow-[0_0_30px_rgba(37,99,235,0.15)] scale-[1.005]"
            : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50/50 shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.mp4,.wav,image/jpeg,image/png,video/mp4,audio/wav"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
            isDragging
              ? "bg-blue-100 text-blue-600"
              : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200 group-hover:text-zinc-900"
          }`}
        >
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-semibold text-zinc-900 tracking-tight mb-1">
          Ingest Artifact for Neural Verification
        </h3>
        <p className="text-sm text-zinc-600 max-w-md mb-6 leading-relaxed">
          Drag and drop media payload, or browse local workspace. The inspection pipeline
          will compute frame embeddings and spectral entropy.
        </p>

        {/* Format Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700">
            <FileImage className="w-3.5 h-3.5 text-blue-600" />
            <span>.JPG / .PNG</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700">
            <FileVideo className="w-3.5 h-3.5 text-purple-600" />
            <span>.MP4</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-700">
            <FileAudio className="w-3.5 h-3.5 text-amber-600" />
            <span>.WAV</span>
          </span>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-600">
            <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
            <span>MAX 100MB</span>
          </span>
        </div>
      </div>

      {/* Preset Quick-Load & Error Diagnostics Simulator */}
      <div className="border border-zinc-200 bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-200">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-800 font-semibold">
              Demo Payload Presets & Edge-Case Testing
            </span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">SIMULATION READY</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <button
            type="button"
            onClick={() => handleQuickLoad("synthetic_img")}
            className="flex items-center justify-between px-3 py-2 text-left rounded bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 transition-colors group"
          >
            <div className="flex items-center space-x-2 truncate">
              <FileImage className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-mono text-zinc-900 truncate">portrait_v4.png</div>
                <div className="text-[10px] font-mono text-rose-600 font-medium">SYNTHETIC DETECT</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLoad("authentic_vid")}
            className="flex items-center justify-between px-3 py-2 text-left rounded bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 transition-colors group"
          >
            <div className="flex items-center space-x-2 truncate">
              <FileVideo className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-mono text-zinc-900 truncate">press_cam02.mp4</div>
                <div className="text-[10px] font-mono text-emerald-600 font-medium">AUTHENTIC TEST</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => handleQuickLoad("synthetic_audio")}
            className="flex items-center justify-between px-3 py-2 text-left rounded bg-zinc-50 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100 transition-colors group"
          >
            <div className="flex items-center space-x-2 truncate">
              <FileAudio className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <div className="text-xs font-mono text-zinc-900 truncate">voip_stream.wav</div>
                <div className="text-[10px] font-mono text-amber-600 font-medium">SPECTRAL AUDIT</div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0" />
          </button>
        </div>

        {/* Edge-Case Injection Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-zinc-200 gap-2">
          <span className="text-[11px] font-mono text-zinc-600 flex items-center space-x-1.5">
            <AlertTriangle className="w-3 h-3 text-zinc-500" />
            <span>FORCE EXCEPTION FOR VERIFICATION:</span>
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => onErrorTrigger("413")}
              className="text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-200 hover:border-red-300 bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 transition-colors"
            >
              TRIGGER 413
            </button>
            <button
              type="button"
              onClick={() => onErrorTrigger("415")}
              className="text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-200 hover:border-red-300 bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 transition-colors"
            >
              TRIGGER 415
            </button>
            <button
              type="button"
              onClick={() => onErrorTrigger("504")}
              className="text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-200 hover:border-red-300 bg-zinc-50 hover:bg-red-50 text-zinc-700 hover:text-red-700 transition-colors"
            >
              TRIGGER 504
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
