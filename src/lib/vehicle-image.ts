"use client";

export const MAX_VEHICLE_PHOTOS = 40;
export const MAX_SOURCE_BYTES = 100 * 1024 * 1024;
export const TARGET_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_LONG_EDGE = 3200;
export const RECOMMENDED_WIDTH = 3200;
export const RECOMMENDED_HEIGHT = 2400;

const DIRECT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const HEIC_EXTENSIONS = new Set(["heic", "heif"]);

export type VehicleImageResult = {
  file: File;
  width: number;
  height: number;
  originalBytes: number;
  uploadBytes: number;
  optimized: boolean;
  warning?: string;
};

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function baseName(name: string) {
  const raw = name.replace(/\.[^.]+$/, "");
  const clean = raw
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "vehicle-photo";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1) + " MB";
}

export function isAcceptedVehicleImage(file: File) {
  if (file.type.startsWith("image/")) return true;
  return ["jpg","jpeg","png","webp","avif","heic","heif","bmp","gif","tif","tiff"].includes(extensionOf(file.name));
}

function isHeicLike(file: File) {
  return ["image/heic","image/heif"].includes(file.type.toLowerCase()) ||
    HEIC_EXTENSIONS.has(extensionOf(file.name));
}

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

async function decodeImage(blob: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch {
      // Fall back to a normal HTML image decoder below.
    }
  }

  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = "async";
  image.src = url;

  try {
    await image.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("This image format could not be decoded in your browser.");
  }

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    dispose: () => URL.revokeObjectURL(url),
  };
}

function createCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
  maxLongEdge: number,
) {
  const scale = Math.min(1, maxLongEdge / Math.max(width, height));
  const outputWidth = Math.max(1, Math.round(width * scale));
  const outputHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Your browser could not prepare this image.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, outputWidth, outputHeight);

  return { canvas, outputWidth, outputHeight };
}

function encodeCanvas(
  canvas: HTMLCanvasElement,
  type: "image/webp" | "image/jpeg",
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Your browser could not compress this image."));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });
}

async function makeHighQualityUpload(
  source: CanvasImageSource,
  width: number,
  height: number,
) {
  const attempts = [
    { edge: 3200, quality: 0.93 },
    { edge: 3200, quality: 0.89 },
    { edge: 2800, quality: 0.91 },
    { edge: 2560, quality: 0.90 },
  ];

  let last: { blob: Blob; width: number; height: number } | null = null;

  for (const attempt of attempts) {
    const { canvas, outputWidth, outputHeight } = createCanvas(
      source,
      width,
      height,
      attempt.edge,
    );

    let blob = await encodeCanvas(canvas, "image/webp", attempt.quality);

    // Older browsers can ignore the requested WebP encoder.
    if (blob.type !== "image/webp") {
      blob = await encodeCanvas(canvas, "image/jpeg", Math.min(0.95, attempt.quality + 0.02));
    }

    last = { blob, width: outputWidth, height: outputHeight };

    if (blob.size <= TARGET_UPLOAD_BYTES) return last;
  }

  if (!last) throw new Error("The image could not be prepared.");
  return last;
}

function imageWarning(width: number, height: number) {
  const longEdge = Math.max(width, height);
  const ratio = width / height;

  if (longEdge < 1800) {
    return "Low resolution: use at least 2400 × 1800 when possible.";
  }

  if (width < height) {
    return "Portrait photo: landscape 4:3 will fit the showroom better.";
  }

  if (Math.abs(ratio - 4 / 3) > 0.2) {
    return "Non-4:3 photo: keep the whole car away from the edges to avoid cropping.";
  }

  return undefined;
}

export async function optimizeVehicleImage(file: File): Promise<VehicleImageResult> {
  if (!isAcceptedVehicleImage(file)) {
    throw new Error("Unsupported file. Use JPEG, PNG, WebP, AVIF, HEIC or HEIF.");
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Source image is over 100 MB. Export a smaller copy first.");
  }

  let workingBlob: Blob = file;
  let forcedConversion = false;

  if (isHeicLike(file)) {
    try {
      const { heicTo } = await import("heic-to");
      const converted = await heicTo({
        blob: file,
        type: "image/jpeg",
        quality: 0.98,
      });
      workingBlob = converted;
      forcedConversion = true;
    } catch {
      throw new Error("This HEIC/HEIF photo could not be converted. Try sharing it as JPEG.");
    }
  }

  const decoded = await decodeImage(workingBlob);

  try {
    const directCandidate =
      !forcedConversion &&
      DIRECT_MIME_TYPES.has(file.type) &&
      file.size <= TARGET_UPLOAD_BYTES &&
      Math.max(decoded.width, decoded.height) <= MAX_LONG_EDGE;

    if (directCandidate) {
      return {
        file,
        width: decoded.width,
        height: decoded.height,
        originalBytes: file.size,
        uploadBytes: file.size,
        optimized: false,
        warning: imageWarning(decoded.width, decoded.height),
      };
    }

    const output = await makeHighQualityUpload(
      decoded.source,
      decoded.width,
      decoded.height,
    );

    const type = output.blob.type === "image/webp" ? "image/webp" : "image/jpeg";
    const extension = type === "image/webp" ? "webp" : "jpg";
    const optimizedFile = new File(
      [output.blob],
      baseName(file.name) + "." + extension,
      { type, lastModified: Date.now() },
    );

    return {
      file: optimizedFile,
      width: output.width,
      height: output.height,
      originalBytes: file.size,
      uploadBytes: optimizedFile.size,
      optimized: true,
      warning: imageWarning(output.width, output.height),
    };
  } finally {
    decoded.dispose();
  }
}
