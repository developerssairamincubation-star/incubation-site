export type ResizeOptions = {
  maxWidth: number;
  maxHeight: number;
  /** Logos keep their transparent background; photos are flattened to JPEG. */
  keepTransparency?: boolean;
  quality?: number;
};

export type ResizedImage = { file: File; width: number; height: number };

export type CropPixels = { x: number; y: number; width: number; height: number };

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that image."))),
      type,
      quality,
    ),
  );
}

/** Decodes a file into an <img>, applying the camera's EXIF rotation. */
async function decodeImage(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file — JPG, PNG or WebP.");
  }
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  img.src = objectUrl;
  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(objectUrl);
    throw new Error(
      "This image couldn't be opened. iPhone HEIC photos aren't supported — save it as a JPG first.",
    );
  }
  if (!img.naturalWidth || !img.naturalHeight) {
    URL.revokeObjectURL(objectUrl);
    throw new Error("Couldn't read that image's size. Try a JPG or PNG.");
  }
  return { img, objectUrl };
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  { keepTransparency = false, quality = 0.85 }: Pick<ResizeOptions, "keepTransparency" | "quality">,
): Promise<File> {
  // Browsers that can't encode WebP hand back PNG, which is still fine.
  const blob = await toBlob(canvas, keepTransparency ? "image/webp" : "image/jpeg", quality);
  const ext = { "image/webp": "webp", "image/png": "png" }[blob.type] ?? "jpg";
  return new File([blob], `image.${ext}`, { type: blob.type || "image/jpeg" });
}

/**
 * Scales an image down in the browser before upload. Re-encoding also drops
 * the file's embedded metadata (such as a phone photo's GPS location), and
 * <img> decoding applies the camera's EXIF rotation so photos stay upright.
 */
export async function resizeImage(
  file: File,
  { maxWidth, maxHeight, keepTransparency = false, quality = 0.85 }: ResizeOptions,
): Promise<ResizedImage> {
  const { img, objectUrl } = await decodeImage(file);
  try {
    const sourceWidth = img.naturalWidth;
    const sourceHeight = img.naturalHeight;
    const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight);
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser couldn't process that image.");

    if (!keepTransparency) {
      // JPEG has no alpha channel — flatten onto white rather than black.
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(img, 0, 0, width, height);

    const outFile = await encodeCanvas(canvas, { keepTransparency, quality });
    return { file: outFile, width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Draws just the chosen crop rectangle (in source-image pixels) onto a
 * canvas sized to the target output dimensions — crop and resize in one
 * pass. Used by CropDialog once the admin confirms a crop.
 */
export async function cropAndResizeImage(
  file: File,
  cropPixels: CropPixels,
  targetWidth: number,
  targetHeight: number,
  { keepTransparency = false, quality = 0.85 }: Pick<ResizeOptions, "keepTransparency" | "quality"> = {},
): Promise<ResizedImage> {
  const { img, objectUrl } = await decodeImage(file);
  try {
    const width = Math.max(1, Math.round(targetWidth));
    const height = Math.max(1, Math.round(targetHeight));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser couldn't process that image.");

    if (!keepTransparency) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingQuality = "high";
    context.drawImage(
      img,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      width,
      height,
    );

    const outFile = await encodeCanvas(canvas, { keepTransparency, quality });
    return { file: outFile, width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Fits the whole image inside the target dimensions without cropping
 * anything away — for photos where the source shape is too different from
 * the target ratio to crop without losing something that matters. Any gap
 * is padded with `background`, so pick one that matches the surrounding page.
 */
export async function fitImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  {
    keepTransparency = false,
    quality = 0.85,
    background = "#f6f1e7",
  }: Pick<ResizeOptions, "keepTransparency" | "quality"> & { background?: string } = {},
): Promise<ResizedImage> {
  const { img, objectUrl } = await decodeImage(file);
  try {
    const width = Math.max(1, Math.round(targetWidth));
    const height = Math.max(1, Math.round(targetHeight));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser couldn't process that image.");

    if (!keepTransparency) {
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
    }
    context.imageSmoothingQuality = "high";

    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;
    context.drawImage(
      img,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );

    const outFile = await encodeCanvas(canvas, { keepTransparency, quality });
    return { file: outFile, width, height };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
