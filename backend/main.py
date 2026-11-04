import os
import time
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from core.media_processor import normalize_media
from models.vit_image import analyze_image
from models.wav2vec_audio import analyze_audio
from utils.grad_cam import generate_heatmap_b64

app = FastAPI(title="SynthGuard Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Bypasses all browser CORS blocks
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/analyze")
async def analyze(file: UploadFile = File(...)):
    start_time = time.time()
    file_ext = file.filename.split(".")[-1].lower()
    temp_path = f"temp_{int(time.time())}.{file_ext}"
    
    try:
        # 1. Save upload safely
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        
        # 2. Route Modality
        if file_ext in ['mp4', 'mov', 'avi', 'mkv']: modality = "video"
        elif file_ext in ['wav', 'mp3', 'm4a']: modality = "audio"
        else: modality = "image"

        # 3. Process & Extract
        processed_path = normalize_media(temp_path, modality)
        if not processed_path:
            raise HTTPException(status_code=415, detail="Media extraction failed.")

        # 4. Tensor Inference
        if modality == "audio":
            results = analyze_audio(processed_path)
            heatmap_b64 = None
        else:
            results = analyze_image(processed_path)
            heatmap_b64 = generate_heatmap_b64(processed_path, results["score"])

        # 5. UI Contract Enforcement
        is_synthetic = results["score"] >= 40.0
        
        return {
            "verdict": "synthetic" if is_synthetic else "real",
            "confidenceScore": results["score"],
            "heatmapImage": heatmap_b64,
            "modality": modality,
            "inferenceDurationMs": int((time.time() - start_time) * 1000),
            "metrics": [{"name": k, "score": v, "status": "critical" if is_synthetic else "nominal"} for k, v in results["metrics"].items()],
            "technicalExplanation": f"Neural tensor analysis complete for {modality} stream."
        }
    finally:
        # Cleanup
        if os.path.exists(temp_path): os.remove(temp_path)
        if 'processed_path' in locals() and processed_path and os.path.exists(processed_path) and temp_path != processed_path:
            os.remove(processed_path)

if __name__ == "__main__":
    import uvicorn
    # Bind to 0.0.0.0 to evade Windows ALPN/IPv6 loopback mismatches
    uvicorn.run(app, host="0.0.0.0", port=8000)