/**
 * Downscales and re-encodes raw camera photos directly in the browser
 * using hardware-accelerated `createImageBitmap`.
 */
export async function compressImageFile(
    file: File,
    kind: "logo" | "photo" = "photo"
): Promise<File> {
    // Skip vector graphics and animated GIFs
    if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

    const maxDimension = kind === "logo" ? 800 : 1920;
    const quality = 0.82;
    const targetMime = kind === "logo" ? "image/png" : "image/webp";

    // Read dimensions natively without full decoding
    const tempBitmap = await createImageBitmap(file);
    const { width, height } = tempBitmap;
    tempBitmap.close(); // Immediately release RAM

    // If image is already smaller than maxDimension and < 500KB, skip re-encoding for photos.
    // For logos, we might still want to ensure it's a PNG, but usually if it's small, it's fine.
    if (width <= maxDimension && height <= maxDimension && file.size < 500_000 && (kind !== "logo" || file.type === "image/png")) {
        return file;
    }

    // Calculate aspect ratio target dimensions
    let targetWidth = width;
    let targetHeight = height;
    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            targetWidth = maxDimension;
            targetHeight = Math.round((height * maxDimension) / width);
        } else {
            targetHeight = maxDimension;
            targetWidth = Math.round((width * maxDimension) / height);
        }
    }

    // Hardware-accelerated decode straight to target resolution
    const resizedBitmap = await createImageBitmap(file, {
        resizeWidth: targetWidth,
        resizeHeight: targetHeight,
        resizeQuality: "high",
    });

    // Render to canvas & export
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        resizedBitmap.close();
        throw new Error("Could not initialize 2D canvas context");
    }

    ctx.drawImage(resizedBitmap, 0, 0);
    resizedBitmap.close(); // Immediately release RAM

    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, targetMime, quality)
    );

    if (!blob) throw new Error(`Failed to compress image "${file.name}"`);

    // Output lightweight file preserving original name but with correct extension
    const extension = kind === "logo" ? ".png" : ".webp";
    let newFileName = file.name;
    if (!newFileName.toLowerCase().endsWith(extension)) {
        newFileName = newFileName.replace(/\.[^/.]+$/, "") + extension;
    }
    
    return new File([blob], newFileName, { type: targetMime });
}
