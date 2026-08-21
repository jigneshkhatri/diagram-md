const MAX_TITLE_LENGTH = 100;
const UNSAFE_CHARS = /[/\\:*?"<>|]/;
const RESERVED_NAMES = new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9",
]);

/** Returns an error message if the title isn't usable, or null if it's valid. */
export function validateDocumentTitle(title: string): string | null {
  const trimmed = title.trim();
  if (!trimmed) return "Title is required.";
  if (trimmed.length > MAX_TITLE_LENGTH) return `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`;
  if (UNSAFE_CHARS.test(trimmed)) return 'Title can\'t contain / \\ : * ? " < > |';
  if (/[. ]$/.test(trimmed)) return "Title can't end with a space or period.";
  if (RESERVED_NAMES.has(slugify(trimmed))) return `"${trimmed}" is a reserved name — choose another.`;
  return null;
}

/** Lowercase, spaces replaced with hyphens. Only call on an already-validated title. */
export function slugify(title: string): string {
  return title.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Appends -2, -3, ... until the slug doesn't collide with an existing one. */
export function uniqueSlug(baseSlug: string, existingSlugs: ReadonlySet<string>): string {
  if (!existingSlugs.has(baseSlug)) return baseSlug;
  let n = 2;
  while (existingSlugs.has(`${baseSlug}-${n}`)) n++;
  return `${baseSlug}-${n}`;
}
