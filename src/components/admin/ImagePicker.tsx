"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/actions";
import type { ImageFolder } from "@/lib/storage";
import { CropDialog } from "./CropDialog";
import { resizeImage, type ResizedImage, type ResizeOptions } from "./resize";

export type PickedImage = { url: string; width: number; height: number };

/**
 * Shows the current image and swaps it for a new upload. The file is resized
 * (or, when `cropAspect` is set, cropped to that ratio first) in the
 * browser, uploaded straight away, and handed back as a URL — the change
 * only goes live when the editor's "Save changes" is pressed.
 */
export function ImagePicker({
  value,
  onPicked,
  folder,
  resize,
  label,
  previewClass,
  fit = "cover",
  error,
  cropAspect,
}: {
  value: string;
  onPicked: (image: PickedImage) => void;
  folder: ImageFolder;
  resize: ResizeOptions;
  label: string;
  previewClass: string;
  fit?: "cover" | "contain";
  error?: string;
  /** When set, the admin crops to this exact aspect ratio before upload. */
  cropAspect?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fetchingCurrent, setFetchingCurrent] = useState(false);

  const uploadResized = async (resized: ResizedImage) => {
    setBusy(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.append("file", resized.file);
      form.append("folder", folder);
      const result = await uploadImage(form);
      if (!result.ok) throw new Error(result.error);
      onPicked({ url: result.url, width: resized.width, height: resized.height });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "The upload failed.");
    } finally {
      setBusy(false);
      // Allow picking the same file again after an error.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (cropAspect) {
      setPendingFile(file);
      return;
    }
    try {
      const resized = await resizeImage(file, resize);
      await uploadResized(resized);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "The upload failed.");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const adjustCrop = async () => {
    if (!value) return;
    setFetchingCurrent(true);
    setUploadError(null);
    try {
      const response = await fetch(value);
      if (!response.ok) throw new Error("Couldn't load that image to re-crop it.");
      const blob = await response.blob();
      setPendingFile(new File([blob], "image", { type: blob.type || "image/jpeg" }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Couldn't load that image to re-crop it.");
    } finally {
      setFetchingCurrent(false);
    }
  };

  const message = uploadError ?? error;
  const targetWidth = resize.maxWidth;
  const targetHeight = cropAspect ? Math.round(targetWidth / cropAspect) : resize.maxHeight;

  return (
    <div>
      <p className="mb-1.5 text-[13px] font-semibold text-ink">{label}</p>
      <div
        className={clsx(
          "relative overflow-hidden rounded-xl border bg-cream-soft/60",
          message ? "border-rust/50" : "border-line/60",
          previewClass,
        )}
      >
        {value ? (
          <Image
            src={value}
            alt=""
            fill
            // Admin previews only — skip the optimiser so a fresh upload
            // shows immediately.
            unoptimized
            className={fit === "contain" ? "object-contain p-3" : "object-cover"}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-ink-soft">
            No image yet
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/75 text-[13px] font-semibold text-ink">
            Uploading…
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-line/80 bg-white px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40 disabled:opacity-50"
        >
          {value ? "Replace image" : "Upload image"}
        </button>
        {cropAspect && value && (
          <button
            type="button"
            disabled={busy || fetchingCurrent}
            onClick={adjustCrop}
            className="rounded-lg border border-line/80 bg-white px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink/40 disabled:opacity-50"
          >
            {fetchingCurrent ? "Loading…" : "Adjust crop"}
          </button>
        )}
      </div>
      {message && <p className="mt-1.5 text-[12.5px] text-rust">{message}</p>}

      {cropAspect && pendingFile && (
        <CropDialog
          file={pendingFile}
          aspect={cropAspect}
          targetWidth={targetWidth}
          targetHeight={targetHeight}
          keepTransparency={resize.keepTransparency}
          quality={resize.quality}
          onCancel={() => {
            setPendingFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
          onConfirm={async (resized) => {
            setPendingFile(null);
            await uploadResized(resized);
          }}
        />
      )}
    </div>
  );
}
