"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

type Photo = { src: string; alt?: string };

export default function EventGalleryViewer({
  album,
  caption,
}: {
  album: Photo[];
  caption?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = () => setOpen(false);

  const next = () => setIndex((i) => (i + 1) % album.length);
  const prev = () => setIndex((i) => (i - 1 + album.length) % album.length);

  // keyboard navigation when open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, album.length]);

  return (
    <>
      <div className="relative h-full min-h-0 overflow-hidden rounded-[34px] border border-white/70 bg-paper/80 p-4 shadow-[0px_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:p-5">
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-white/70 bg-cream/70 px-4 py-2 text-[12px] font-medium tracking-[0.2em] text-ink-soft uppercase shadow-[0px_10px_30px_rgba(0,0,0,0.05)] lg:inset-x-5 lg:top-5">
          <span>{caption}</span>
          <span>{album.length} photos</span>
        </div>

        <div className="grid h-full min-h-0 grid-cols-2 gap-3 overflow-y-auto pt-14 lg:grid-cols-3 lg:pt-16 pr-3">
          {album.map((photo, idx) => (
            <button
              key={photo.src}
              onClick={() => openAt(idx)}
              className={`relative overflow-hidden rounded-[26px] border border-white/70 bg-cream-soft/40 shadow-[0px_10px_28px_rgba(0,0,0,0.08)] ${
                idx === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 60vw, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/14 via-transparent to-transparent" />
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="relative max-w-[90vw] max-h-[90vh] w-full">
            <button
              aria-label="Close gallery"
              onClick={close}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur"
            >
              ✕
            </button>

            <button
              aria-label="Previous"
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white"
            >
              <ArrowIcon className="rotate-180 text-[26px]" />
            </button>

            <div className="relative mx-auto h-[min(80vh,calc(100vw-160px))] w-full">
              <Image
                src={album[index].src}
                alt={album[index].alt ?? ""}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              aria-label="Next"
              onClick={next}
              className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white"
            >
              <ArrowIcon className="text-[26px]" />
            </button>

            <div className="mt-4 text-center text-white">{album[index].alt}</div>
          </div>
        </div>
      )}
    </>
  );
}
