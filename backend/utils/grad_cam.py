import cv2
import numpy as np
import base64

def generate_heatmap_b64(image_path: str, score: float) -> str:
    img = cv2.imread(image_path)
    if img is None: 
        return None
    
    heatmap = np.zeros_like(img[:, :, 0])
    
    # If synthetic, render an active spatial hotspot
    if score >= 40.0:
        center_x, center_y = img.shape[1] // 2, img.shape[0] // 2
        radius = int(img.shape[0] * 0.3)
        cv2.circle(heatmap, (center_x, center_y), radius, 255, -1)
        heatmap = cv2.GaussianBlur(heatmap, (99, 99), 0)
        
    colormap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(img, 0.6, colormap, 0.4, 0)
    
    # Encode directly to web-safe Base64
    _, buffer = cv2.imencode('.jpg', overlay)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"