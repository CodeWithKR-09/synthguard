"use client";

import React from "react";
import {
  AlertOctagon,
  FileX,
  Clock,
  RotateCcw,
  RefreshCw,
  FolderOpen,
  ShieldAlert,
} from "lucide-react";
import { FailureCode } from "@/types";

interface ErrorBannerProps {
  code: FailureCode;
  customDetail?: string;
  onReset: () => void;
  onRetry: () => void;
}

export function ErrorBanner({ code, customDetail, onReset, onRetry }: ErrorBannerProps) {
  const getErrorContent = () => {
    switch (code) {
      case "413":
        return {
          title: "Payload Limit Exceeded",
          httpCode: "HTTP 413: Payload Too Large",
          icon: AlertOctagon,
          description:
            "The submitted media payload exceeds the ingestion buffer threshold of 25MB. Real-time ViT tensor allocations require smaller media chunks or downsampled audio/video tracks.",
          actionText: "Reset Buffer & Select Smaller File",
          actionIcon: RotateCcw,
          actionHandler: onReset,
          secondaryDetails: "Max allowed size: 25.0 MB (26,214,400 bytes). Current file exceeded limit.",
        };

      case "415":
        return {
          title: "Codec Not Supported",
          httpCode: "HTTP 415: Unsupported Media Type",
          icon: FileX,
          description:
            "The container format or codec stream does not conform to the accepted neural inspection pipeline. ViT and DCT analyzers require standardized color spaces and non-DRM encodings.",
          actionText: "Select Supported Media Container",
          actionIcon: FolderOpen,
          actionHandler: onReset,
          secondaryDetails: "Accepted MIME types: image/jpeg (.jpg), image/png (.png), video/mp4 (.mp4), audio/wav (.wav).",
        };

      case "504":
      default:
        return {
          title: "Inference Engine Timeout",
          httpCode: "HTTP 504: Gateway Timeout",
          icon: Clock,
          description:
            "The remote inference node failed to return feature vectors within the 5000ms latency ceiling. The tensor worker pool may be experiencing temporary GPU contention or pipeline stall.",
          actionText: "Retry Inference Engine",
          actionIcon: RefreshCw,
          actionHandler: onRetry,
          secondaryDetails: "Cluster node: us-east-inference-04. Latency threshold: 5000ms exceeded.",
        };
    }
  };

  const error = getErrorContent();
  const IconComponent = error.icon;
  const ActionIcon = error.actionIcon;

  return (
    <div className="w-full border border-red-200 bg-red-50/70 rounded-lg p-6 space-y-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded bg-red-100 border border-red-200 flex items-center justify-center text-red-600 shrink-0 mt-0.5">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-red-950 tracking-tight">
                {error.title}
              </h3>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-800 font-medium">
                {error.httpCode}
              </span>
            </div>
            <p className="text-sm text-red-900/90 leading-relaxed max-w-2xl font-sans">
              {error.description}
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={error.actionHandler}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <ActionIcon className="w-4 h-4" />
            <span>{error.actionText}</span>
          </button>
        </div>
      </div>

      {/* Technical Diagnostics Metadata Bar */}
      <div className="pt-3 border-t border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-red-800 gap-2">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span>{customDetail || error.secondaryDetails}</span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-red-700 hover:text-red-950 font-medium underline underline-offset-2 transition-colors self-start sm:self-auto"
        >
          Return to Ingestion Zone
        </button>
      </div>
    </div>
  );
}
