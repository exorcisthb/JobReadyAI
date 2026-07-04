export interface DraftCV {
  id: string;
  title: string;
  templateName: string;
  lastModified: string;
  data: any;
  template: any;
}

export const getDraftsKey = (userId: string) => `cv-drafts-${userId}`;

export function getDrafts(userId: string): DraftCV[] {
  try {
    const raw = localStorage.getItem(getDraftsKey(userId));
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDraft(userId: string, draft: DraftCV): DraftCV {
  const drafts = getDrafts(userId);
  const now = new Date().toISOString();

  const entry: DraftCV = {
    ...draft,
    id: draft.id || crypto.randomUUID(),
    lastModified: now,
  };

  const existingIndex = drafts.findIndex((d) => d.id === entry.id);
  if (existingIndex >= 0) {
    drafts[existingIndex] = entry;
  } else {
    drafts.unshift(entry);
  }

  // Keep max 20 drafts
  if (drafts.length > 20) {
    drafts.splice(20);
  }

  localStorage.setItem(getDraftsKey(userId), JSON.stringify(drafts));
  return entry;
}

export function deleteDraft(userId: string, draftId: string): void {
  const drafts = getDrafts(userId).filter((d) => d.id !== draftId);
  localStorage.setItem(getDraftsKey(userId), JSON.stringify(drafts));
}

export function getDraftById(userId: string, draftId: string): DraftCV | undefined {
  return getDrafts(userId).find((d) => d.id === draftId);
}
