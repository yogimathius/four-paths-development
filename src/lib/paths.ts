export const PATHS = ["family", "technology", "philosophy", "creativity"] as const;
export type PathId = (typeof PATHS)[number];

export const PATH_INFO: Record<PathId, { label: string; blurb: string }> = {
  family: { label: "Family", blurb: "Tools that make home life fairer and calmer." },
  technology: { label: "Technology", blurb: "Clear, trustworthy software for everyday systems like money." },
  philosophy: { label: "Philosophy", blurb: "Apps for practice, reflection, and living on purpose." },
  creativity: { label: "Creativity", blurb: "Play, games, and making things for the joy of it." },
};

export const STATUSES = ["live", "testing", "coming-soon", "hidden"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  live: "Available",
  testing: "In testing",
  "coming-soon": "Coming soon",
  hidden: "Hidden",
};
