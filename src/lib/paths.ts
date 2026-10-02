export const PATHS = ["family", "technology", "philosophy", "creativity"] as const;
export type PathId = (typeof PATHS)[number];

interface Practice {
  name: string;
  meaning: string;
}

/**
 * Each path is read three ways: where the work lives (the path), how it is
 * practised (one of the four yogas), and what it serves (one of the four
 * aims of life, the puruṣārthas).
 */
export const PATH_INFO: Record<PathId, { label: string; blurb: string; yoga: Practice; aim: Practice }> = {
  family: {
    label: "Family",
    blurb: "Tools that make home life fairer and calmer.",
    yoga: { name: "Bhakti", meaning: "devotion, love" },
    aim: { name: "Dharma", meaning: "duty, right relationship" },
  },
  technology: {
    label: "Technology",
    blurb: "Clear, trustworthy software for everyday systems like money.",
    yoga: { name: "Karma", meaning: "skilled action" },
    aim: { name: "Artha", meaning: "livelihood, means" },
  },
  philosophy: {
    label: "Philosophy",
    blurb: "Apps for practice, reflection, and living on purpose.",
    yoga: { name: "Jñāna", meaning: "knowledge, inquiry" },
    aim: { name: "Mokṣa", meaning: "liberation" },
  },
  creativity: {
    label: "Creativity",
    blurb: "Play, games, and making things for the joy of it.",
    yoga: { name: "Rāja", meaning: "absorption of the mind" },
    aim: { name: "Kāma", meaning: "joy, beauty, the arts" },
  },
};

/** "Bhakti · Dharma" */
export const pathLineage = (p: PathId) => `${PATH_INFO[p].yoga.name} · ${PATH_INFO[p].aim.name}`;

export const STATUSES = ["live", "testing", "coming-soon", "hidden"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  live: "Available",
  testing: "In testing",
  "coming-soon": "Coming soon",
  hidden: "Hidden",
};
