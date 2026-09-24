"use client";

import { Team } from "@/components/sections/Team";
import type { TeamMember } from "@/lib/content/schema";
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

export function TeamEditor({ initial, version }: { initial: TeamMember[]; version: number }) {
  const editor = useCollectionEditor<TeamMember>("team", initial, version);
  const { items } = editor;
  const view = useListView(items, {
    pageSize: PAGE_SIZE,
    getSearchText: (member) => `${member.name} ${member.role}`,
    getSortKey: (member) => member.name,
    getAddedAt: (member) => member.addedAt ?? 0,
    // A validation error on another page must not stay out of sight.
    forceShowAll: items.some((_, i) => editor.itemHasError(i)),
  });

  const addMember = () => {
    const id = newId();
    editor.add({ id, name: "", role: "", bio: "", photo: "", addedAt: Date.now() });
    view.reveal("last");
    revealItem(id);
  };

  return (
    <div>
      <EditorHeader
        title="Team members"
        description="The people shown in the “Our team” section, just above Contact, in this order. The section and its menu link stay hidden until at least one member is saved."
        addLabel="Add member"
        onAdd={addMember}
      />

      <div className="mt-4 flex justify-end">
        <PreviewButton>
          <Team members={items} />
        </PreviewButton>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState>No team members yet.</EmptyState>
        </div>
      ) : (
        <>
          <ListControls label="Filter team members" hint={items.length > 1 ? view.reorderHint : null}>
            <SearchField
              label="Search team members by name or role"
              placeholder="Search team members"
              value={view.query}
              onChange={view.setQuery}
            />
            <SortSelect value={view.sort} onChange={view.setSort} />
          </ListControls>

          <Pagination
            label="Team members pages"
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
              <EmptyState>No team members match “{view.query.trim()}”.</EmptyState>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {view.entries.map(({ item: member, index: i }) => (
                <ItemCard
                  key={member.id}
                  domId={`item-${member.id}`}
                  index={i}
                  count={items.length}
                  heading={member.name || "New member"}
                  canMove={view.canReorder}
                  onMove={(delta) => editor.move(member.id, delta)}
                  onRemove={() => editor.remove(member.id)}
                  removeConfirm={`Remove ${member.name || "this member"} from the team?`}
                  hasError={editor.itemHasError(i)}
                >
                  <div className="grid gap-5 md:grid-cols-[200px_1fr]">
                    <ImagePicker
                      label="Photo"
                      value={member.photo}
                      folder="team"
                      resize={{ maxWidth: 1000, maxHeight: 1250 }}
                      previewClass="aspect-[4/5]"
                      cropAspect={4 / 5}
                      error={editor.errorFor(i, "photo")}
                      onPicked={({ url }) => {
                        editor.trackUpload(url);
                        editor.update(member.id, { photo: url });
                      }}
                    />
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Name" error={editor.errorFor(i, "name")}>
                          {(field) => (
                            <input
                              {...field}
                              className={inputClass}
                              value={member.name}
                              maxLength={120}
                              onChange={(e) => editor.update(member.id, { name: e.target.value })}
                            />
                          )}
                        </Field>
                        <Field
                          label="Role (optional)"
                          hint="e.g. Chief Executive Officer"
                          error={editor.errorFor(i, "role")}
                        >
                          {(field) => (
                            <input
                              {...field}
                              className={inputClass}
                              value={member.role}
                              maxLength={120}
                              onChange={(e) => editor.update(member.id, { role: e.target.value })}
                            />
                          )}
                        </Field>
                      </div>
                      <Field
                        label="Description"
                        hint={`${member.bio.length} / 1,500 characters`}
                        error={editor.errorFor(i, "bio")}
                      >
                        {(field) => (
                          <textarea
                            {...field}
                            className={`${inputClass} min-h-[140px] resize-y leading-relaxed`}
                            value={member.bio}
                            maxLength={1500}
                            onChange={(e) => editor.update(member.id, { bio: e.target.value })}
                          />
                        )}
                      </Field>
                    </div>
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
