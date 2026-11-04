import cv2
from PIL import Image

def normalize_media(input_path: str, modality: str) -> str:
    out_path = input_path + "_norm.jpg"
    
    if modality == "image":
        img = Image.open(input_path).convert("RGB")
        img.save(out_path, "JPEG")
        return out_path
        
    elif modality == "video":
        cap = cv2.VideoCapture(input_path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Jump to the middle frame to skip intro animations/black screens
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, total // 2))
        ret, frame = cap.read()
        cap.release()
        
        if ret:
            cv2.imwrite(out_path, frame)
            return out_path
        return None
        
    return input_path # Audio returns the raw .wav path