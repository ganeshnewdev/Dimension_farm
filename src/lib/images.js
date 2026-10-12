// Browser-only: decode an image file and re-encode it as a size-capped JPEG data URL.
// Phone photos are often 5-10 MB; the model does not need that, and uploads stay fast.
export async function fileToResizedDataURL(file, maxSide = 1280, quality = 0.85) {
  const source = await decode(file);
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // flatten transparency (PNG/WebP) before JPEG encoding
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);
  if (typeof source.close === 'function') source.close();
  return canvas.toDataURL('image/jpeg', quality);
}

// Resolves to an ImageBitmap or a (detached, so natural-size) HTMLImageElement.
async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall back to <img> decoding below
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('decode'));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
