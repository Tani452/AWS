/**
 * KalaMitra Client-side Image Processing Utilities
 * - Client-side resizing to max 1600px JPEG (cost & bandwidth safety)
 * - Canvas auto-levels / brightness lighting fix
 * - 1:1 square canvas compositing (white / cream / black backgrounds)
 * - Browser background removal (@imgly/background-removal) with graceful fallback
 */

import { isMock } from '../api';

/**
 * Resizes an image file client-side to a maximum dimension of 1600px JPEG.
 * Returns { blob, dataUrl, width, height, originalSize, resizedSize }.
 */
export async function resizeImageToMax1600(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDimension = 1600;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob conversion failed'));
              return;
            }
            resolve({
              blob,
              dataUrl: canvas.toDataURL('image/jpeg', 0.88),
              width,
              height,
              originalSize: file.size,
              resizedSize: blob.size,
            });
          },
          'image/jpeg',
          0.88
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Applies auto-levels and subtle brightness enhancement to canvas image data.
 * Stretches dark/light histogram and lifts artisan craft shadows.
 */
export function applyAutoLevels(ctx, width, height) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const len = data.length;

    // 1. Calculate luminance histogram (sampling every 4th pixel for speed)
    let minLum = 255;
    let maxLum = 0;
    let totalLum = 0;
    let sampleCount = 0;

    for (let i = 0; i < len; i += 16) {
      const a = data[i + 3];
      if (a < 50) continue; // Skip transparent pixels
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum < minLum) minLum = lum;
      if (lum > maxLum) maxLum = lum;
      totalLum += lum;
      sampleCount++;
    }

    if (sampleCount === 0 || maxLum <= minLum) return;

    const avgLum = totalLum / sampleCount;

    // If image is noticeably dark (avg < 90), apply a gentle lift factor
    const liftFactor = avgLum < 90 ? 1.15 : 1.05;
    const range = Math.max(1, maxLum - minLum);

    for (let i = 0; i < len; i += 4) {
      const a = data[i + 3];
      if (a < 20) continue;

      for (let c = 0; c < 3; c++) {
        let val = data[i + c];
        // Linear histogram stretch
        val = ((val - minLum) / range) * 255;
        // Apply slight brightness lift
        val = val * liftFactor;
        data[i + c] = Math.min(255, Math.max(0, Math.round(val)));
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.warn('Auto-levels notice:', err);
  }
}

/**
 * Composites an image source (Image, Canvas, or ImageBitmap) onto a 1:1 square canvas.
 * Supported background choices:
 * - 'white': #FFFFFF (clean standard marketplace)
 * - 'cream': #FAF7EE (warm ivory handicraft aesthetic)
 * - 'black': #18181B (dramatic jewelry/metalcraft contrast)
 */
export async function compositeOnSquareBackground(imageElement, bgColorKey = 'white', applyLighting = true) {
  const bgColors = {
    white: '#FFFFFF',
    cream: '#FAF7EE',
    black: '#18181B',
  };
  const fillColor = bgColors[bgColorKey] || '#FFFFFF';

  const w = imageElement.naturalWidth || imageElement.width;
  const h = imageElement.naturalHeight || imageElement.height;
  const maxDim = Math.max(w, h);

  // Add 4% padding border for professional studio framing
  const pad = Math.round(maxDim * 0.04);
  const squareSize = maxDim + pad * 2;

  const canvas = document.createElement('canvas');
  canvas.width = squareSize;
  canvas.height = squareSize;
  const ctx = canvas.getContext('2d');

  // Fill solid 1:1 background
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, squareSize, squareSize);

  // Center image inside square
  const destX = Math.round((squareSize - w) / 2);
  const destY = Math.round((squareSize - h) / 2);
  ctx.drawImage(imageElement, destX, destY, w, h);

  // Optional lighting fix
  if (applyLighting) {
    applyAutoLevels(ctx, squareSize, squareSize);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob,
          dataUrl: canvas.toDataURL('image/jpeg', 0.9),
          width: squareSize,
          height: squareSize,
        });
      },
      'image/jpeg',
      0.9
    );
  });
}

/**
 * High-level AI Studio processor:
 * 1. Resizes input photo to max 1600px JPEG.
 * 2. In mock mode: skips real BG removal and returns original photo with lighting fix.
 * 3. In real mode: invokes @imgly/background-removal with progress callbacks.
 * 4. On failure: falls back gracefully to original photo with lighting fix.
 * 5. Composites onto selected 1:1 square background (white / cream / black).
 */
export async function processStudioImage({
  imageBlob,
  bgColor = 'white',
  skipBgRemoval = false,
  onProgress = () => {},
}) {
  // If mock mode or explicit skip, return original with lighting fix
  if (isMock || skipBgRemoval) {
    onProgress({ stage: 'lighting', percent: 50, note: isMock ? 'Mock mode: applying instant lighting fix...' : 'Applying lighting fix...' });
    const img = await loadImageFromBlob(imageBlob);
    const composited = await compositeOnSquareBackground(img, bgColor, true);
    onProgress({ stage: 'done', percent: 100, note: 'Ready!' });
    return {
      finalBlob: composited.blob,
      finalDataUrl: composited.dataUrl,
      fallbackUsed: false,
      mockSkipped: isMock,
    };
  }

  // Real mode: try @imgly/background-removal
  try {
    onProgress({ stage: 'init', percent: 10, note: 'Initializing AI background removal...' });
    const { removeBackground } = await import('@imgly/background-removal');

    onProgress({ stage: 'download', percent: 30, note: 'Downloading AI model (first time can take a few seconds)...' });

    const cutoutBlob = await removeBackground(imageBlob, {
      progress: (key, current, total) => {
        let pct = 30;
        if (total > 0) {
          pct = Math.min(85, Math.round(30 + (current / total) * 55));
        }
        onProgress({ stage: key, percent: pct, note: 'Removing background in browser...' });
      },
    });

    onProgress({ stage: 'composite', percent: 90, note: 'Compositing onto 1:1 studio background...' });
    const cutoutImg = await loadImageFromBlob(cutoutBlob);
    const composited = await compositeOnSquareBackground(cutoutImg, bgColor, true);

    onProgress({ stage: 'done', percent: 100, note: 'Studio enhancement complete!' });
    return {
      finalBlob: composited.blob,
      finalDataUrl: composited.dataUrl,
      fallbackUsed: false,
      mockSkipped: false,
    };
  } catch (err) {
    console.warn('Background removal failed, falling back to lighting fix:', err);
    onProgress({ stage: 'fallback', percent: 85, note: 'Background removal unavailable, applying lighting fix...' });

    // Fall back to original photo with lighting fix
    const origImg = await loadImageFromBlob(imageBlob);
    const fallbackComposited = await compositeOnSquareBackground(origImg, bgColor, true);
    onProgress({ stage: 'done', percent: 100, note: 'Lighting enhanced (original background retained).' });

    return {
      finalBlob: fallbackComposited.blob,
      finalDataUrl: fallbackComposited.dataUrl,
      fallbackUsed: true,
      fallbackReason: err.message || 'AI background model unavailable',
      mockSkipped: false,
    };
  }
}

/**
 * Loads an HTMLImageElement from a Blob or DataURL.
 */
export function loadImageFromBlob(blobOrUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image element'));
    if (typeof blobOrUrl === 'string') {
      img.src = blobOrUrl;
    } else {
      img.src = URL.createObjectURL(blobOrUrl);
    }
  });
}
