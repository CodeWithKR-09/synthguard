import cv2
import mediapipe as mp
import numpy as np
import glob
import os

class MultimodalFusionEngine:
    def __init__(self, vision_model, audio_model):
        self.vision = vision_model
        self.audio = audio_model
        self.mp_face_mesh = mp.solutions.face_mesh.FaceMesh(
            static_image_mode=False, max_num_faces=1, refine_landmarks=True
        )

    def analyze_video(self, video_frames_dir, audio_wav_path=None):
        frames = glob.glob(f"{video_frames_dir}/*.jpg")
        
        vision_results = self.vision.analyze_image(frames[0])
        fused_score = vision_results["score"]
        final_metrics = vision_results["metrics"]
        
        if audio_wav_path and os.path.exists(audio_wav_path):
            audio_results = self.audio.analyze_audio(audio_wav_path)
            fused_score = (vision_results["score"] * 0.7) + (audio_results["score"] * 0.3)
            
            final_metrics["Voice Spectral Anomalies"] = audio_results["metrics"].get("Spectral Frequency Entropy", audio_results["score"])
            final_metrics["Phoneme Naturalness"] = audio_results["metrics"].get("Phoneme Transition Naturalness", 100 - audio_results["score"])
        
        return {
            "score": round(fused_score, 2),
            "is_synthetic": fused_score >= 40.0,
            "metrics": final_metrics
        }