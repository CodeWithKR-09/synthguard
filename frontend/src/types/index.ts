export type AnalysisStatus = "idle" | "analyzing" | "error" | "results";

export type FailureCode = "413" | "415" | "504";

export interface MediaFilePayload {
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  category: "image" | "video" | "audio";
}

export interface MetricItem {
  name: string;
  score: number;
  status: "nominal" | "flagged" | "critical";
  description: string;
}

export interface AnalysisResult {
  verdict: "synthetic" | "real";
  confidenceScore: number;
  verdictSummary: string;
  technicalExplanation: string;
  modelIdentifier: string;
  inferenceDurationMs: number;
  frequencyBandNoise: string;
  facialCoherenceScore: number;
  perceptualHash: string;
  metrics: MetricItem[];
  heatmapImage?: string | null;
  modality?: string;
}
