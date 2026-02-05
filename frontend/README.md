#  VesuviusX 2.0: Vesuvius AI Surface Detection Portal

VESUVIUSX 2.0 is a professional Full-Stack Web Application developed for the **Vesuvius Challenge**, designed to detect hidden Greek text in carbonized scroll fragments using 3D AI Analysis.

---

##  Core Technologies
* **AI Model:** 3D Sobel Gradient Analysis (Kaggle Leaderboard Score: 0.295).
* **Backend:** FastAPI (Asynchronous Python Framework).
* **Frontend:** React.js (High-end Cinematic Dashboard).
* **Database:** PostgreSQL (vesuvius_db2).

---

##  Implementation Logic
The system processes **27.32 GB fragments** through a specialized pipeline:
1. **Gaussian Filtering:** Removes noise from volumetric CT scans.
2. **Sobel Gradient (axis=0):** Identifies surface transitions along the Z-axis.
3. **95th Percentile Thresholding:** Dynamically isolates high-confidence ink signals.

---

##  System Architecture


##  Installation
1. Clone the repo: `https://github.com/macunnaaa/Vesuvius_Project-CIA.git`
2. Start Backend: `cd backend && uvicorn main:app --reload`
3. Start Frontend: `cd frontend && npm install && npm start`







###### Vesuvius Cahlllage Kaggle original Competion Code ###########
#------------- Kaggle Score 0.295--------------#

import os
import zipfile
import numpy as np
import pandas as pd
from pathlib import Path
from PIL import Image
import tifffile as tiff
from scipy.ndimage import gaussian_filter, sobel

# 1. Environment Configuration
# Define paths for Kaggle cloud environment
DATA_ROOT = Path("/kaggle/input/vesuvius-challenge-surface-detection")
PROCESS_DIR = Path("/kaggle/working/inference_results")
SUBMISSION_FILE = "/kaggle/working/submission.zip"

PROCESS_DIR.mkdir(parents=True, exist_ok=True)

# 2. Optimized 3D Data Loader
def get_3d_volume(file_path):
    """
    Loads 3D TIFF stacks efficiently to manage memory  27GB dataset processing.
    """
    with Image.open(file_path) as img:
        stack = []
        for frame in range(img.n_frames):
            img.seek(frame)
            stack.append(np.array(img))
    return np.array(stack, dtype=np.float32)

# 3. Surface Analysis Logic (Edge-Detection Based)
def extract_surface_mask(volume):
    """
    Detects scroll surfaces using Gaussian denoising and Sobel gradient analysis.
    This provides higher accuracy than standard thresholding methods.
    """
    # Step A: Noise reduction to handle carbonization artifacts
    denoised = gaussian_filter(volume, sigma=1.0)
    
    # Step B: 3D Gradient calculation along the Z-axis
    gradients = sobel(denoised, axis=0)
    intensity = np.abs(gradients)
    
    # Step C: Dynamic thresholding based on data distribution
    limit = np.percentile(intensity, 95)
    mask = (intensity > limit).astype(np.uint8)
    
    return mask

# 4. Execution Pipeline
# Iterating through test metadata for volume processing
test_metadata = pd.read_csv(DATA_ROOT / "test.csv")

for _, entry in test_metadata.iterrows():
    vid = entry["id"]
    input_stack = DATA_ROOT / "test_images" / f"{vid}.tif"
    
    if input_stack.exists():
        # Execute processing logic
        raw_vol = get_3d_volume(input_stack)
        result_mask = extract_surface_mask(raw_vol)
        
        # Save output artifact in .tif format
        save_path = PROCESS_DIR / f"{vid}.tif"
        tiff.imwrite(str(save_path), result_mask, compression='zlib')

# 5. Automated Packaging
# Archiving all .tif masks into the required submission.zip
with zipfile.ZipFile(SUBMISSION_FILE, "w") as final_zip:
    for tif_path in PROCESS_DIR.glob("*.tif"):
        final_zip.write(tif_path, arcname=tif_path.name)

print(f"Deployment Ready. Submission file generated at: {SUBMISSION_FILE}")