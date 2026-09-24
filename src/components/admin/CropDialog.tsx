"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Button } from "./ui";
import { cropAndResizeImage, fitImage, type ResizedImage } from "./resize";

type Mode = "crop" | "fit";

/**
 * Locks the admin to a fixed aspect ratio while they drag/zoom to pick the
 * crop, then draws just that rectangle onto a canvas sized to the section's
 * target output — so what they see here is what ships on the live site.
 * "Fit whole image" is the escape hatch for photos where the target ratio
 * is too different from the source to crop without losing something that
 * matters — it pads instead of cropping.
 */
export function CropDialog({
  file,
  aspect,
  targetWidth,
  targetHeight,
  keepTransparency = false,
  quality = 0.85,
  onCancel,
  onConfirm,
}: {
  file: File;
  aspect: number;
  targetWidth: number;
  targetHeight: number;
  keepTransparency?: boolean;
  quality?: number;
  onCancel: () => void;
  onConfirm: (result: ResizedImage) => void;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("crop");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Creation and revocation must live in the same effect: if the URL were
    // created during render (e.g. via useMemo) instead, Strict Mode's dev-only
    // mount→cleanup→mount simulation would revoke it after that first mount
    // without ever creating a replacement, leaving anything that mounts
    // afterwards (like switching to "Fit whole image") pointed at a dead URL.
    const url = URL.createObjectURL(file);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (mode === "crop" && !croppedAreaPixels) return;
    setBusy(true);
    setError(null);
    try {
      const result =
        mode === "fit"
          ? await fitImage(file, targetWidth, targetHeight, { keepTransparency, quality })
          : await cropAndResizeImage(
              file,
              croppedAreaPixels!,
              targetWidth,
              targetHeight,
              { keepTransparency, quality },
            );
      onConfirm(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't process that image.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Crop image"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-line/60 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex gap-1 border-b border-line/60 p-2">
          <button
            type="button"
            onClick={() => setMode("crop")}
            className={clsx(
              "flex-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
              mode === "crop" ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5",
            )}
          >
            Crop to fill
          </button>
          <button
            type="button"
            onClick={() => setMode("fit")}
            className={clsx(
              "flex-1 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
              mode === "fit" ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5",
            )}
          >
            Fit whole image
          </button>
        </div>

        <div className="relative h-[60vh] max-h-[520px] w-full bg-cream-soft">
          {!objectUrl ? (
            <div className="flex h-full items-center justify-center text-[13px] text-ink-soft">
              Loading…
            </div>
          ) : mode === "crop" ? (
            <Cropper
              image={objectUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              disableAutomaticStylesInjection
            />
          ) : (
            <div className="relative h-full w-full p-4">
              <Image
                src={objectUrl}
                alt=""
                fill
                unoptimized
                className="object-contain p-4"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          {mode === "crop" ? (
            <div>
              <label htmlFor="crop-zoom" className="mb-1.5 block text-[13px] font-semibold text-ink">
                Zoom
              </label>
              <input
                id="crop-zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-gold"
              />
              <p className="mt-1 text-[12.5px] text-ink-soft">
                Drag the photo to reposition it, or use the slider to zoom.
              </p>
            </div>
          ) : (
            <p className="text-[12.5px] text-ink-soft">
              Shows the whole photo with padding added on the sides — nothing gets cropped
              out. Use this if cropping would cut off something that matters.
            </p>
          )}
          {error && <p className="text-[12.5px] text-rust">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={busy || !objectUrl || (mode === "crop" && !croppedAreaPixels)}
            >
              {busy ? "Processing…" : mode === "fit" ? "Use whole image" : "Use this crop"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
