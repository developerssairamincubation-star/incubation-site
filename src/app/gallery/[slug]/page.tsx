import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GALLERY_ITEMS } from "@/lib/data";
import EventGalleryViewer from "@/components/gallery/EventGalleryViewer";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function generateStaticParams() {
  return GALLERY_ITEMS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = GALLERY_ITEMS.find((entry) => entry.slug === slug);

  if (!item) {
    return {
      title: "Gallery event",
    };
  }

  return {
    title: `${item.title} | Gallery`,
    description: item.details,
  };
}

export default async function GalleryEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = GALLERY_ITEMS.find((entry) => entry.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(190,158,112,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(193,80,42,0.08),_transparent_38%),linear-gradient(180deg,_#f8f3ea_0%,_#f4ede2_100%)] text-ink">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/3 size-[26rem] rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-[-8rem] bottom-[-10rem] size-[28rem] rounded-full bg-rust/10 blur-3xl" />

      <div className="absolute left-4 top-4 z-30">
        <Link href="/#gallery" className="flex items-center gap-2 rounded-full bg-cream/70 px-3 py-2">
          <ArrowIcon className="rotate-180 text-[18px]" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      <div className="grid h-full min-h-0 gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:p-6">
        <section className="relative min-h-0 overflow-hidden rounded-[34px] border border-white/70 bg-paper/80 p-4 shadow-[0px_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:p-5">
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between rounded-full border border-white/70 bg-cream/70 px-4 py-2 text-[12px] font-medium tracking-[0.2em] text-ink-soft uppercase shadow-[0px_10px_30px_rgba(0,0,0,0.05)] lg:inset-x-5 lg:top-5">
            <span>{item.caption}</span>
            <span>{item.album.length} photos</span>
          </div>

          {/* Only the cover tile gets a fixed span — every other tile is a
              uniform aspect ratio, so the grid lays out cleanly for any
              photo count instead of the overlap you get from hand-placing
              tiles for an exact count. Scrolls internally once an album has
              more photos than fit in one screen. */}
          {/* Client-rendered interactive grid + lightbox */}
          <EventGalleryViewer album={item.album} caption={item.caption} />
        </section>

        <aside className="min-h-0 overflow-hidden rounded-[34px] border border-white/70 bg-paper/70 shadow-[0px_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="flex h-full min-h-0 flex-col p-6 lg:p-8">
            <p className="text-[13px] font-medium tracking-[0.24em] text-gold uppercase">
              Event details
            </p>
            <div className="mt-4 h-px w-16 bg-gold/50" />
            <h1 className="mt-5 max-w-[740px] font-bold text-[clamp(32px,4vw,64px)] leading-[1.02]">
              {item.title}
            </h1>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pr-3 text-[17px] leading-relaxed text-ink-soft md:text-[19px]">
              <div className="space-y-6 pb-8">
                <p>{item.details}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
