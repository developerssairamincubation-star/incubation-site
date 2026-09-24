"use client";

import { Hero } from "@/components/sections/Hero";
import type { HeroSlide } from "@/lib/content/schema";
import { ImagePicker } from "./ImagePicker";
import { PreviewButton } from "./PreviewOverlay";
import {
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
import { newId, revealItem, useCollectionEditor } from "./useCollectionEditor";
import { useListView } from "./useListView";

const MAX_SLIDES = 12;
const PAGE_SIZE = 10;

export function HeroEditor({ initial, version }: { initial: HeroSlide[]; version: number }) {
  const editor = useCollectionEditor<HeroSlide>("hero", initial, version);
  const { items } = editor;
  const view = useListView(items, {
    pageSize: PAGE_SIZE,
    getSearchText: (slide) => slide.alt,
    // A validation error on another page must not stay out of sight.
    forceShowAll: items.some((_, i) => editor.itemHasError(i)),
  });

  const addSlide = () => {
    const id = newId();
    editor.add({ id, src: "", alt: "" });
    view.reveal("last");
    revealItem(id);
  };

  return (
    <div>
      <EditorHeader
        title="Hero images"
        description="The photos that rotate in the carousel at the top of the home page, in this order. Landscape photos work best."
        addLabel="Add image"
        onAdd={addSlide}
        addDisabled={items.length >= MAX_SLIDES}
        addDisabledReason={`Up to ${MAX_SLIDES} images`}
      />

      <div className="mt-4 flex justify-end">
        <PreviewButton>
          <Hero slides={items} />
        </PreviewButton>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState>The carousel needs at least one image — add one to get started.</EmptyState>
        </div>
      ) : (
        <>
          <ListControls label="Filter hero images" hint={items.length > 1 ? view.reorderHint : null}>
            <SearchField
              label="Search hero images by description"
              placeholder="Search descriptions"
              value={view.query}
              onChange={view.setQuery}
            />
          </ListControls>

          <Pagination
            label="Hero images pages"
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
              <EmptyState>No images match “{view.query.trim()}”.</EmptyState>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {view.entries.map(({ item: slide, index: i }) => (
                <ItemCard
                  key={slide.id}
                  domId={`item-${slide.id}`}
                  index={i}
                  count={items.length}
                  heading={slide.alt || "New image"}
                  canMove={view.canReorder}
                  onMove={(delta) => editor.move(slide.id, delta)}
                  onRemove={() => editor.remove(slide.id)}
                  removeConfirm="Remove this image from the carousel?"
                  hasError={editor.itemHasError(i)}
                >
                  <div className="grid gap-5 md:grid-cols-[minmax(0,340px)_1fr]">
                    <ImagePicker
                      label="Photo"
                      value={slide.src}
                      folder="hero"
                      resize={{ maxWidth: 2000, maxHeight: 2000 }}
                      previewClass="aspect-[4/3]"
                      cropAspect={4 / 3}
                      error={editor.errorFor(i, "src")}
                      onPicked={({ url }) => {
                        editor.trackUpload(url);
                        editor.update(slide.id, { src: url });
                      }}
                    />
                    <Field
                      label="Description"
                      hint="Describes the photo for screen readers and search engines, e.g. “Students testing a drone at the maker lab”."
                      error={editor.errorFor(i, "alt")}
                    >
                      {(field) => (
                        <input
                          {...field}
                          className={inputClass}
                          value={slide.alt}
                          maxLength={160}
                          onChange={(e) => editor.update(slide.id, { alt: e.target.value })}
                        />
                      )}
                    </Field>
                  </div>
                </ItemCard>
              ))}
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
