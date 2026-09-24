"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MAX_EVENT_PHOTOS,
  type EventPhoto,
  type GalleryEvent,
} from "@/lib/content/schema";
import { ImagePicker } from "./ImagePicker";
import {
  Button,
  EditorHeader,
  EmptyState,
  Field,
  inputClass,
  ItemCard,
  ListControls,
  Pagination,
  SaveBar,
  SearchField,
} from "./ui";
import {
  newId,
  revealItem,
  useCollectionEditor,
  type CollectionEditor,
} from "./useCollectionEditor";
import { useListView } from "./useListView";

const PHOTO_RESIZE = { maxWidth: 1920, maxHeight: 1920 };
const PAGE_SIZE = 10;

/** Alt text follows the title, so admins never have to write it per photo. */
function withAlts(title: string, photos: { src: string }[]): EventPhoto[] {
  return photos.map((photo, n) => ({
    src: photo.src,
    alt: `${title.trim() || "Event"} — photo ${n + 1}`,
  }));
}

function EventSummary({ event }: { event: GalleryEvent }) {
  const cover = event.photos[0]?.src;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-soft">
        {cover && <Image src={cover} alt="" fill unoptimized className="object-cover" />}
      </div>
      <div className="min-w-0 text-[14px]">
        <p className="truncate font-semibold text-ink">{event.caption || "—"}</p>
        <p className="text-ink-soft">
          {event.photos.length} of {MAX_EVENT_PHOTOS} photos
          {event.slug && (
            <>
              {" · "}
              <a
                href={`/gallery/${event.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold underline-offset-2 hover:underline"
              >
                View page ↗
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function EventFields({
  event,
  index,
  editor,
}: {
  event: GalleryEvent;
  index: number;
  editor: CollectionEditor<GalleryEvent>;
}) {
  const setPhotos = (photos: { src: string }[]) =>
    editor.update(event.id, { photos: withAlts(event.title, photos) });

  const movePhoto = (from: number, to: number) => {
    const next = [...event.photos];
    [next[from], next[to]] = [next[to], next[from]];
    setPhotos(next);
  };

  const photosError = editor.errorFor(index, "photos");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Short label"
          hint="Shown on the gallery card and at the top of the event page."
          error={editor.errorFor(index, "caption")}
        >
          {(field) => (
            <input
              {...field}
              className={inputClass}
              value={event.caption}
              maxLength={60}
              placeholder="e.g. COSMOS Centre Inauguration"
              onChange={(e) => editor.update(event.id, { caption: e.target.value })}
            />
          )}
        </Field>
        <Field label="Title" error={editor.errorFor(index, "title")}>
          {(field) => (
            <input
              {...field}
              className={inputClass}
              value={event.title}
              maxLength={160}
              onChange={(e) =>
                editor.update(event.id, {
                  title: e.target.value,
                  photos: withAlts(e.target.value, event.photos),
                })
              }
            />
          )}
        </Field>
      </div>

      <Field
        label="Description"
        hint={`${event.details.length.toLocaleString()} / 5,000 characters`}
        error={editor.errorFor(index, "details")}
      >
        {(field) => (
          <textarea
            {...field}
            className={`${inputClass} min-h-[180px] resize-y leading-relaxed`}
            value={event.details}
            maxLength={5000}
            onChange={(e) => editor.update(event.id, { details: e.target.value })}
          />
        )}
      </Field>

      <p className="text-[13px] text-ink-soft">
        Page link:{" "}
        {event.slug ? (
          <a
            href={`/gallery/${event.slug}`}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-gold underline-offset-2 hover:underline"
          >
            /gallery/{event.slug} ↗
          </a>
        ) : (
          <span>created from the title when you save.</span>
        )}
      </p>

      <div>
        <p className="text-[13px] font-semibold text-ink">
          Photos{" "}
          <span className="font-normal text-ink-soft">
            — up to {MAX_EVENT_PHOTOS}. The first one is the cover on the gallery card.
          </span>
        </p>
        {photosError && <p className="mt-1 text-[12.5px] text-rust">{photosError}</p>}
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {event.photos.map((photo, n) => (
            <div key={`${photo.src}-${n}`}>
              <ImagePicker
                label={n === 0 ? "Cover" : `Photo ${n + 1}`}
                value={photo.src}
                folder="gallery"
                resize={PHOTO_RESIZE}
                previewClass="aspect-[307/413]"
                cropAspect={307 / 413}
                error={editor.errorFor(index, `photos.${n}.src`)}
                onPicked={({ url }) => {
                  editor.trackUpload(url);
                  setPhotos(event.photos.map((p, m) => (m === n ? { src: url } : p)));
                }}
              />
              <div className="mt-1.5 flex gap-1">
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-[13px]"
                  disabled={n === 0}
                  onClick={() => movePhoto(n, n - 1)}
                  aria-label={`Move photo ${n + 1} earlier`}
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-[13px]"
                  disabled={n === event.photos.length - 1}
                  onClick={() => movePhoto(n, n + 1)}
                  aria-label={`Move photo ${n + 1} later`}
                >
                  →
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-1 text-[13px] text-rust hover:text-rust"
                  onClick={() => setPhotos(event.photos.filter((_, m) => m !== n))}
                  aria-label={`Remove photo ${n + 1}`}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {event.photos.length < MAX_EVENT_PHOTOS && (
            <ImagePicker
              label={event.photos.length === 0 ? "Cover" : "Add a photo"}
              value=""
              folder="gallery"
              resize={PHOTO_RESIZE}
              previewClass="aspect-[307/413]"
              cropAspect={307 / 413}
              onPicked={({ url }) => {
                editor.trackUpload(url);
                setPhotos([...event.photos, { src: url }]);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function GalleryEditor({
  initial,
  version,
}: {
  initial: GalleryEvent[];
  version: number;
}) {
  const editor = useCollectionEditor<GalleryEvent>("gallery", initial, version);
  const { items } = editor;
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const view = useListView(items, {
    pageSize: PAGE_SIZE,
    getSearchText: (event) => `${event.title} ${event.caption}`,
    // A validation error on another page must not stay out of sight.
    forceShowAll: items.some((_, i) => editor.itemHasError(i)),
  });

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const addEvent = () => {
    const id = newId();
    // New events go first — the gallery shows them in this order.
    editor.add({ id, slug: "", caption: "", title: "", details: "", photos: [] }, "start");
    setOpen((current) => new Set(current).add(id));
    view.reveal("first");
    revealItem(id);
  };

  return (
    <div>
      <EditorHeader
        title="Gallery events"
        description="Each event is a card in the “Explore our gallery” carousel and has its own page with a description and photos. They appear in this order."
        addLabel="Add event"
        onAdd={addEvent}
      />

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState>
            No events yet — the gallery section is hidden on the site until you add one.
          </EmptyState>
        </div>
      ) : (
        <>
          <ListControls label="Filter gallery events" hint={items.length > 1 ? view.reorderHint : null}>
            <SearchField
              label="Search gallery events by title or label"
              placeholder="Search events"
              value={view.query}
              onChange={view.setQuery}
            />
          </ListControls>

          <Pagination
            label="Gallery events pages"
            page={view.page}
            pageCount={view.pageCount}
            pageSize={view.pageSize}
            sizeChoice={view.showAll ? "all" : view.sizeChoice}
            totalMatches={view.totalMatches}
            onPageChange={view.setPage}
            onSizeChange={view.setSizeChoice}
          />

          {view.entries.length === 0 ? (
            <div className="mt-6">
              <EmptyState>No events match “{view.query.trim()}”.</EmptyState>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {view.entries.map(({ item: event, index: i }) => {
                // A card with a validation error opens so the problem is visible.
                const expanded = open.has(event.id) || editor.itemHasError(i);
                return (
                  <ItemCard
                    key={event.id}
                    domId={`item-${event.id}`}
                    index={i}
                    count={items.length}
                    heading={event.title || "New event"}
                    canMove={view.canReorder}
                    onMove={(delta) => editor.move(event.id, delta)}
                    onRemove={() => editor.remove(event.id)}
                    removeConfirm={`Remove “${event.title || "this event"}” and its page?`}
                    hasError={editor.itemHasError(i)}
                    aside={
                      <Button
                        variant="secondary"
                        className="mr-1 px-3"
                        aria-expanded={expanded}
                        onClick={() => toggle(event.id)}
                      >
                        {expanded ? "Close" : "Edit"}
                      </Button>
                    }
                  >
                    {expanded ? (
                      <EventFields event={event} index={i} editor={editor} />
                    ) : (
                      <EventSummary event={event} />
                    )}
                  </ItemCard>
                );
              })}
            </ul>
          )}
        </>
      )}

      <SaveBar
        dirty={editor.dirty}
        status={editor.status}
        listErrors={editor.listErrors}
        onSave={editor.save}
        onDiscard={editor.discard}
      />
    </div>
  );
}
