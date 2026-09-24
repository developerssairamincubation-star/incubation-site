"use client";

import { Startups } from "@/components/sections/Startups";
import type { StartupLogo } from "@/lib/content/schema";
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
  SortSelect,
} from "./ui";
import { newId, revealItem, useCollectionEditor } from "./useCollectionEditor";
import { useListView } from "./useListView";

const PAGE_SIZE = 10;

export function StartupsEditor({
  initial,
  version,
}: {
  initial: StartupLogo[];
  version: number;
}) {
  const editor = useCollectionEditor<StartupLogo>("startups", initial, version);
  const { items } = editor;
  const view = useListView(items, {
    pageSize: PAGE_SIZE,
    getSearchText: (logo) => logo.name,
    getSortKey: (logo) => logo.name,
    getAddedAt: (logo) => logo.addedAt ?? 0,
    // A validation error on another page must not stay out of sight.
    forceShowAll: items.some((_, i) => editor.itemHasError(i)),
  });

  const addStartup = () => {
    const id = newId();
    editor.add({ id, name: "", src: "", width: 200, height: 200, url: "", addedAt: Date.now() });
    view.reveal("last");
    revealItem(id);
  };

  return (
    <div>
      <EditorHeader
        title="Startup logos"
        description="The logos scrolling in “Startups building from this campus”. Add a website and the logo becomes a link that opens it in a new tab."
        addLabel="Add startup"
        onAdd={addStartup}
      />

      <div className="mt-4 flex justify-end">
        <PreviewButton>
          <Startups logos={items} />
        </PreviewButton>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState>
            No startups yet — the section is hidden on the site until you add one.
          </EmptyState>
        </div>
      ) : (
        <>
          <ListControls label="Filter startup logos" hint={items.length > 1 ? view.reorderHint : null}>
            <SearchField
              label="Search startups by name"
              placeholder={`Find a startup (${items.length})`}
              value={view.query}
              onChange={view.setQuery}
            />
            <SortSelect value={view.sort} onChange={view.setSort} />
          </ListControls>

          <Pagination
            label="Startup logos pages"
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
              <EmptyState>No startups match “{view.query.trim()}”.</EmptyState>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {view.entries.map(({ item: logo, index }) => (
                <ItemCard
                  key={logo.id}
                  domId={`item-${logo.id}`}
                  index={index}
                  count={items.length}
                  heading={logo.name || "New startup"}
                  canMove={view.canReorder}
                  onMove={(delta) => editor.move(logo.id, delta)}
                  onRemove={() => editor.remove(logo.id)}
                  removeConfirm={`Remove ${logo.name || "this startup"}?`}
                  hasError={editor.itemHasError(index)}
                >
                  <div className="grid gap-5 md:grid-cols-[220px_1fr_1fr]">
                    <ImagePicker
                      label="Logo"
                      value={logo.src}
                      folder="startups"
                      // Logos keep transparency, normalised to ~200px tall like
                      // the originals.
                      resize={{ maxWidth: 1200, maxHeight: 240, keepTransparency: true, quality: 0.9 }}
                      previewClass="aspect-[16/9] bg-white"
                      fit="contain"
                      error={editor.errorFor(index, "src")}
                      onPicked={({ url, width, height }) => {
                        editor.trackUpload(url);
                        editor.update(logo.id, { src: url, width, height });
                      }}
                    />
                    <Field label="Startup name" error={editor.errorFor(index, "name")}>
                      {(field) => (
                        <input
                          {...field}
                          className={inputClass}
                          value={logo.name}
                          maxLength={120}
                          onChange={(e) => editor.update(logo.id, { name: e.target.value })}
                        />
                      )}
                    </Field>
                    <Field
                      label="Website (optional)"
                      hint="The full address, e.g. https://example.com"
                      error={editor.errorFor(index, "url")}
                    >
                      {(field) => (
                        <input
                          {...field}
                          type="url"
                          inputMode="url"
                          placeholder="https://"
                          className={inputClass}
                          value={logo.url}
                          maxLength={500}
                          onChange={(e) => editor.update(logo.id, { url: e.target.value })}
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
