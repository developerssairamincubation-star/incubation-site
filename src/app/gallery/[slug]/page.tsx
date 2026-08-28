import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GALLERY_ITEMS } from "@/lib/data";
import EventGalleryViewer from "@/components/gallery/EventGalleryViewer";
import BackToGallery from "@/components/ui/BackToGallery";
import ScrollContainer from "@/components/ui/ScrollContainer";

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
    <main className="relative flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(190,158,112,0.14),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(193,80,42,0.08),_transparent_38%),linear-gradient(180deg,_#f8f3ea_0%,_#f4ede2_100%)] text-ink">
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/3 size-[26rem] rounded-full bg-gold/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-[-8rem] bottom-[-10rem] size-[28rem] rounded-full bg-rust/10 blur-3xl" />

      {/* Back sits in its own row rather than floating over the cards, so it
          can never overlap the photo grid or the caption pill. */}
      <header className="relative z-30 shrink-0 px-4 pt-4 lg:px-6 lg:pt-6">
        <BackToGallery />
      </header>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] lg:p-6">
        {/* EventGalleryViewer draws its own card shell and caption pill, so
            this wrapper stays a plain sizing box — nesting a second bordered
            card here duplicated the pill and squeezed the grid. */}
        <section className="relative min-h-0">
          <EventGalleryViewer album={item.album} caption={item.caption} />
        </section>

        <aside className="min-h-0 overflow-hidden rounded-[34px] border border-white/70 bg-paper/70 shadow-[0px_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <div className="flex h-full min-h-0 flex-col p-6 lg:p-8">
            <p className="text-[13px] font-medium tracking-[0.24em] text-gold uppercase">
              Event details
            </p>
            <div className="mt-4 h-px w-16 bg-gold/50" />
            <h1 className="mt-5 max-w-[520px] font-bold text-[clamp(24px,3vw,36px)] leading-[1.04]">
              {item.title}
            </h1>

            <ScrollContainer className="mt-6 min-h-0 flex-1 overflow-y-auto pr-3 text-[14px] leading-relaxed text-ink-soft md:text-[15px]">
              <div className="space-y-6 pb-8">
                <p>{item.details}</p>
              </div>
            </ScrollContainer>
          </div>
        </aside>
      </div>
    </main>
  );
}
