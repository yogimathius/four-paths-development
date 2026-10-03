import type { ImageMetadata } from "astro";
import pillarsPose from "../assets/work/pillars-pose.png";
import choreBoard from "../assets/apps/chore-credits/01-family-board.png";
import forgeExercise from "../assets/apps/forge-5x5/02-exercise.png";
import lifeAtlasIcon from "../assets/apps/life-atlas/icon.png";

export const lenses = {
  build: { verb: "Build", name: "Technology", description: "Software, AI, engineering, systems and tools." },
  create: { verb: "Create", name: "Creativity", description: "Games, music, writing and playful technology." },
  question: { verb: "Question", name: "Philosophy", description: "How technology shapes attention, agency and a life." },
  ground: { verb: "Ground", name: "Family", description: "Real households, relationships, limits and ordinary life." },
} as const;

export type Lens = keyof typeof lenses;
export type WorkStatus = "Early access" | "Building" | "Experiment";

export interface Work {
  slug: string;
  name: string;
  premise: string;
  summary: string;
  status: WorkStatus;
  updated: string;
  lenses: Lens[];
  image?: ImageMetadata;
  imageAlt?: string;
  imageKind?: "portrait" | "icon";
  why: string[];
  idea: string[];
  experience: string[];
  built: string[];
  evolution: { date: string; text: string }[];
  next: string;
  relatedNote?: { href: string; title: string };
}

export const work: Work[] = [
  {
    slug: "pillars",
    name: "Pillars",
    premise: "A yoga practice that grows with you.",
    summary: "A structured Hatha yoga curriculum with spoken guidance and a path that advances through practice rather than a calendar.",
    status: "Early access",
    updated: "2026-10-02",
    lenses: ["build", "question", "ground"],
    image: pillarsPose,
    imageAlt: "A standing pose illustration used in the Pillars practice curriculum",
    imageKind: "portrait",
    why: [
      "A guided practice is hard to follow when it asks you to keep looking at a phone. Pillars began with a practical question: could a curriculum give someone enough structure to continue, while allowing the screen to recede during the session?",
      "The broader idea was once a platform for five disciplines. Actual release work clarified the first useful slice: Sādhana, a Hatha yoga path that can stand on its own.",
    ],
    idea: [
      "The curriculum is organized into named stages. A short experience check suggests a place to begin, and practices within a stage describe position rather than a weekly deadline. Progress remembers where you left off without treating a gap as failure.",
      "Spoken sequences carry pose, breath and alignment cues so a practitioner can put the phone beside the mat. The app provides visual reference when it helps, then gives attention back to the practice.",
    ],
    experience: [
      "Start with an experience check, browse the stage roadmap, then begin or resume a session. During practice, audio and pose artwork work together; sessions can be paused, resumed or adapted to the body you have that day.",
    ],
    built: [
      "I built the mobile practice flow and its supporting API, progression model, curriculum presentation, audio delivery and release path. Recent work has focused on a gentler beginner entry, stage based navigation and clearer Sanskrit narration.",
    ],
    evolution: [
      { date: "June 2026", text: "A five discipline platform was the initial frame." },
      { date: "August 2026", text: "The first release narrowed to Sādhana and moved directly into practice." },
      { date: "September 2026", text: "Week based language gave way to named stages and a self paced journey." },
      { date: "October 2026", text: "Narration and pose presentation continued to improve through testing." },
    ],
    next: "Sādhana is in Android closed testing. I am refining the journey, practice media and release experience from real device feedback.",
    relatedNote: { href: "/notes/from-platform-to-practice", title: "From platform to practice" },
  },
  {
    slug: "chore-credits",
    name: "Chore Credits",
    premise: "A household agreement children can help shape.",
    summary: "Children choose useful work from a shared menu. Credits describe agreed effort, while parents set boundaries and review exceptions.",
    status: "Early access",
    updated: "2026-08-27",
    lenses: ["build", "ground", "question"],
    image: choreBoard,
    imageAlt: "A Chore Credits family board showing a household's shared work",
    imageKind: "portrait",
    why: [
      "The daily chore argument is often about who chooses, what counts and whether the agreement feels fair. Most chore software gives parents better assignment tools. This project asks what changes when a child chooses how to contribute.",
      "An early prototype was a physical board for the wall or fridge. The app grew around it as the private record of eligibility, claims, review and the weekly agreement.",
    ],
    idea: [
      "A parent defines chores with bounded one, two or three credit levels. A child sees work available to them and chooses. Submitted work stays visibly separate from approved work, and only approved credits enter the allowance calculation.",
      "Fairness is not identical work for every child. The rules account for age, supervision, exclusive claims and excused days without publishing a sibling ranking.",
    ],
    experience: [
      "The shared board opens into a child's available work. They can claim a chore, see its concrete finish line and submit it. Routine work may approve automatically; exceptions go to a parent review. A printable companion keeps the agreement visible when the device is away.",
    ],
    built: [
      "I built a local first Android prototype with an SQLite domain model, transactional claims, a parent gate, household history, export and a print ready companion board. It collects a child's birth month and year rather than an exact birthdate.",
    ],
    evolution: [
      { date: "August 2026", text: "A physical companion board made the agreement visible in the home." },
      { date: "August 2026", text: "The local MVP established choice, claims, approval and weekly settlement as one complete loop." },
      { date: "August 2026", text: "The broader beta work added accessibility controls, history and more precise household rules." },
    ],
    next: "The Android build is in closed testing. The central question remains whether children use the board independently and whether the agreement reduces daily parent management.",
    relatedNote: { href: "/notes/choice-before-assignment", title: "Choice before assignment" },
  },
  {
    slug: "life-atlas",
    name: "Life Atlas",
    premise: "A map for work that has a longer horizon.",
    summary: "Roles, arcs, quests and evidence connect the work of today to larger chapters of a life.",
    status: "Early access",
    updated: "2026-09-04",
    lenses: ["build", "question", "ground"],
    image: lifeAtlasIcon,
    imageAlt: "Life Atlas app icon, a small orbital diagram",
    imageKind: "icon",
    why: [
      "Life Atlas came from a real planning system spanning family, finances, learning, creative work and practice. The task list was useful for capture, but it could not show the story that connected those tasks.",
      "The original question was personal: what is moving, which commitments are heavy, and what would count as evidence of change? The product grew from that model rather than from a generic productivity template.",
    ],
    idea: [
      "Roles name lived identities. Arcs hold sustained directions of effort. Quests contain concrete work. Evidence records what actually changed. Chapters make past, present and emerging horizons legible.",
      "Capacity and leverage matter alongside completion. Suggestions remain proposals until a person accepts them; an AI brief is generated only after the user chooses the source text and asks for it.",
    ],
    experience: [
      "The Today view offers orientation. The Atlas and Chapters views show larger patterns. Proof and reviews keep the account of progress tied to events rather than the number of boxes checked.",
    ],
    built: [
      "I built the Expo interface, shared domain model and API for roles, arcs, quests, evidence, chapters, onboarding and account isolation. The system evolved from a personal repository into separate private workspaces for testers.",
    ],
    evolution: [
      { date: "May 2026", text: "A five year planning system suggested a narrative layer above tasks." },
      { date: "August 2026", text: "The Observatory model added chapters, capacity signals and evidence backed progress." },
      { date: "August 2026", text: "The personal atlas became a private, account based product for closed testing." },
    ],
    next: "Life Atlas is in Android closed testing. I am watching whether the model clarifies real decisions without turning life into another scorekeeping system.",
  },
  {
    slug: "forge-5x5",
    name: "Forge 5×5",
    premise: "A small exercise circuit the screen can leave alone.",
    summary: "Five moves, five reps and five rounds, guided by voice so the phone can rest on the floor.",
    status: "Early access",
    updated: "2026-10-01",
    lenses: ["create", "build", "question"],
    image: forgeExercise,
    imageAlt: "Forge 5×5 exercise screen with a movement demonstration and a large Next control",
    imageKind: "portrait",
    why: [
      "A workout can be simple and still demand constant device attention. Forge 5×5 explores a strict format that is easy to remember and an interface that speaks the next step aloud.",
      "Its game layer is deliberate and contained: heats, ranks and a companion add texture, while the circuit itself remains the point.",
    ],
    idea: [
      "Each circuit has five exercises, five repetitions and five rounds. One move fills the screen at a time. A large Next control records actual repetitions, while voice, short transition cues and adjustable rest carry the sequence.",
    ],
    experience: [
      "Choose a heat, set the phone down and follow the spoken sequence. The app announces moves, rounds and rest. Progress stays on the device, and the workout works offline.",
    ],
    built: [
      "I built separate native Android and iOS implementations from a shared behavioral specification. The Android app uses Kotlin and Jetpack Compose; the iOS version uses Swift and SwiftUI. Both follow the same workout and progression rules.",
    ],
    evolution: [
      { date: "Before October 2026", text: "The core native build, media library and voice flow were developed before the repository's first commit." },
      { date: "October 2026", text: "Release work established the Forge identity, store assets and signed Android builds." },
    ],
    next: "Forge 5×5 is in Android closed testing. The public history is a partial record because the first Git commit imported an already substantial build.",
  },
  {
    slug: "clearledger",
    name: "ClearLedger",
    premise: "Financial information that helps decide what to do next.",
    summary: "An evolving debt and cash flow tool, organized around decisions rather than a wall of charts.",
    status: "Building",
    updated: "2026-09-30",
    lenses: ["build", "ground", "question"],
    why: [
      "Financial software can show a great deal while leaving the hard decision untouched. ClearLedger began with a more specific question: how can accounts, obligations and spending make a debt payoff choice clearer?",
    ],
    idea: [
      "The model keeps money in integer minor units, separates source data from decisions, and treats a payoff projection as something that must be explainable. A read only YNAB boundary provides one source of account data; manual debts remain editable where the source does not know enough.",
    ],
    experience: [
      "The developing interface brings accounts and manually tracked obligations together, then shows cash flow and possible extra payment effects in context. It is an active prototype, so those surfaces are still being refined.",
    ],
    built: [
      "I built the Android first Expo app, provider independent finance model, deterministic payoff engine, encrypted local storage boundary and account and debt screens.",
    ],
    evolution: [
      { date: "September 2026", text: "A Plaid integration was tried, removed and reconsidered while the data model took shape." },
      { date: "September 2026", text: "The app returned to a narrower YNAB source and added editable manual obligations." },
      { date: "September 2026", text: "The navigation was simplified so accounts and decisions were easier to find." },
    ],
    next: "ClearLedger is building. Its data flows and release boundaries are still changing, so it is presented here as an inquiry in progress.",
  },
];

export const featuredWork = work[0];
export const selectedWork = work.slice(1, 4);
export const workBySlug = (slug: string) => work.find((project) => project.slug === slug);
