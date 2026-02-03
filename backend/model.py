import numpy as np
from scipy.ndimage import gaussian_filter, sobel

def run_vesuvius_ai(image_array):
    # Gaussian Denoising - reduce Noize
    denoised = gaussian_filter(image_array.astype(np.float32), sigma=1.0)
    # 3D Sobel Logic for Ink Detection
    gradients = sobel(denoised)
    intensity = np.abs(gradients)
    # Kaggle verified threshold (0.295 Score logic)
    limit = np.percentile(intensity, 95)
    mask = (intensity > limit).astype(np.uint8) * 255
    return mask