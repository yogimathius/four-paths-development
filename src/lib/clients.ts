import type { ImageMetadata } from "astro";
import allMountainDesktop from "../assets/clients/all-mountain-desktop.jpg";
import allMountainMobile from "../assets/clients/all-mountain-mobile.jpg";
import crabappleDesktop from "../assets/clients/crabapple-desktop.jpg";
import crabappleMobile from "../assets/clients/crabapple-mobile.jpg";

export interface ClientProject {
  slug: string;
  name: string;
  /** Business type and place, shown as the project's one-line identity. */
  descriptor: string;
  url: string;
  /** Shown without the protocol, e.g. "allmountain.ca". */
  host: string;
  premise: string;
  summary: string;
  /** Short capability tags: what the engagement involved. */
  scope: string[];
  period: string;
  desktop: { src: ImageMetadata; alt: string };
  mobile: { src: ImageMetadata; alt: string };
  starting: string[];
  built: string[];
  /** Plain-language things the business owner can now do or rely on. */
  handover: string[];
  stack: string[];
  evolution: { date: string; text: string }[];
  /** Measured outcomes, only where a source exists. Omit rather than estimate. */
  results?: { heading: string; rows: { label: string; value: string }[]; note: string };
  present: string;
}

export const clientProjects: ClientProject[] = [
  {
    slug: "all-mountain-contracting",
    name: "All Mountain Contracting",
    descriptor: "Custom home builder and general contractor · Whistler and Squamish, BC",
    url: "https://allmountain.ca",
    host: "allmountain.ca",
    premise: "A builder's website that moved platforms without losing its place in search.",
    summary:
      "A move from a static, hand-maintained site to a fast React application with an editor the team can publish from, planned so existing search visibility carried across.",
    scope: ["Site migration", "Content admin", "SEO continuity", "Hosting"],
    period: "Early 2026, ongoing",
    desktop: {
      src: allMountainDesktop,
      alt: "The All Mountain Contracting home page: a custom mountain home beneath the headline 'We Build Beautiful, Daily.'",
    },
    mobile: {
      src: allMountainMobile,
      alt: "The All Mountain Contracting home page on a phone",
    },
    starting: [
      "All Mountain Contracting is a licensed builder serving Whistler, Squamish and the Sea to Sky corridor, with a portfolio of more than twenty residential and commercial projects. Its website was a set of static pages: every new project or article meant a developer editing files, and a handful of pages did all the work in search.",
      "The risk in any rebuild is the one the owner cannot see. A new site that looks better but changes its URLs can quietly discard years of search history. The brief was therefore twofold: a site the team could update, and a move that kept what the old site had already earned.",
    ],
    built: [
      "We rebuilt the site as a React Router v7 application with TypeScript and Tailwind, backed by Postgres. Projects, services and blog posts live in a content admin with a rich-text editor, so the team can add a project page or publish an article without touching code. Images are handled through a media service and displayed in responsive galleries and a hero video that behave on phones and tablets.",
      "Before launch, every legacy address was mapped to its new home with permanent redirects, including the trailing-slash and http duplicates that split a page's ranking. The sitemap, including a video sitemap, and the redirect table are generated from the same content, so a page renamed in the admin does not become a dead link. A later audit led to dedicated pages for home renovation, commercial construction and custom homes, replacing a single About page that had been answering every query.",
    ],
    handover: [
      "Add and edit projects, service pages and blog posts from an admin, with an editor that handles images, links and embedded video.",
      "Rename a page without breaking inbound links: redirects are managed with the content.",
    ],
    stack: ["React Router v7", "TypeScript", "Tailwind CSS", "Postgres + Prisma", "Tiptap editor", "Fly.io"],
    evolution: [
      { date: "Early 2026", text: "The new site replaced the old one; legacy URLs were redirected and checked one by one." },
      { date: "March 2026", text: "A search audit found one page answering most queries. Service pages and clearer page titles followed." },
      { date: "August 2026", text: "Hero video and project galleries reworked for phones and tablets." },
      { date: "September 2026", text: "Redirects and the sitemap became generated from the admin's content." },
    ],
    results: {
      heading: "Early search signal",
      rows: [
        { label: "Search impressions, week of 18 February", value: "1,055" },
        { label: "Search impressions, week of 11 March", value: "2,124" },
        { label: "Branded search clicks, month before migration → month after", value: "1 → 12" },
        { label: "Pages returning HTTP 200 when the report was written", value: "All 30" },
      ],
      note: "From Google Search Console, 18 February to 18 March 2026. The absolute numbers are small: this is a local trade business, and the figures show direction after a migration, not a promise of volume.",
    },
    present:
      "The site is live and maintained. The current focus is the work a migration makes possible: service pages, project stories and content that answers what homeowners in the corridor actually search for.",
  },
  {
    slug: "crabapple-cafe",
    name: "The Crabapple Café",
    descriptor: "Breakfast and brunch restaurant · Brackendale, Squamish, BC",
    url: "https://crabapplecafe.ca",
    host: "crabapplecafe.ca",
    premise: "A café website the kitchen can run from the pass.",
    summary:
      "A long-running rebuild of a restaurant site and its admin: menu, news and events, guest enquiries and the people allowed to change them, kept current by the staff rather than a developer.",
    scope: ["Rebuild and framework upgrades", "Menu and content admin", "Roles and permissions", "Test coverage"],
    period: "2024 to present",
    desktop: {
      src: crabappleDesktop,
      alt: "The Crabapple Café home page: a poached egg on mushrooms and greens beneath 'Best Breakfast & Brunch in Squamish'",
    },
    mobile: {
      src: crabappleMobile,
      alt: "The Crabapple Café menu page on a phone, with menu categories and opening hours",
    },
    starting: [
      "A café's website has two jobs that pull in different directions. Guests need the menu, hours, a way to order and this weekend's feature. The people running the kitchen need to change those things in minutes, between services, without learning a content system or waiting on a developer.",
      "The Crabapple Café's site began on Remix with a component library that no longer fit the design. The goal was a site that looked like the café and an admin that matched how the café actually works.",
    ],
    built: [
      "We replaced the component library with Tailwind, moved the site from Remix to React Router v7, and built the admin around the café's real routines. Menu items can be dragged into order; photos are cropped on upload and served from a CDN; news, events and weekly features are posts with an editor; guest enquiries from the contact page land in the admin. The public site also carries gift cards and a newsletter sign-up.",
      "As more people needed access, the work shifted from features to trust. The admin has roles (admin, manager, editor) enforced on the server, invitations by email with delivery tracking, and the ability to block an account so that it is actually locked out. A browser test suite exercises every role against a disposable database, so a permissions change is checked before it reaches the café's real accounts.",
    ],
    handover: [
      "Reorder menu items, update photos and publish the weekly feature from the admin.",
      "Post news, events and weekly features that appear on the public site.",
      "Read and follow up guest enquiries from the contact page.",
      "Invite a colleague with the right level of access, and remove it just as simply.",
    ],
    stack: ["React Router v7", "TypeScript", "Tailwind CSS", "Postgres + Prisma", "Resend", "Playwright", "Fly.io"],
    evolution: [
      { date: "March 2024", text: "The rebuild begins: the old component library is replaced with Tailwind and a cleaner design." },
      { date: "2024", text: "The menu, accounts and sign-in, and guest enquiries are built; the admin begins to take shape." },
      { date: "September 2025", text: "The site moves from Remix to React Router v7 with behaviour preserved." },
      { date: "October 2026", text: "User management hardened: server-side role checks, blocked accounts that stay blocked, and invitation delivery tracking, backed by an end-to-end test suite." },
    ],
    present:
      "The site is live and in steady use. Work now is incremental: menu changes, event pages and the occasional framework upgrade, each shipped with tests so the people running the café never have to be the testers.",
  },
];

export const clientBySlug = (slug: string) => clientProjects.find((project) => project.slug === slug);

export const capabilities = [
  {
    title: "Modernize an existing site",
    body: "Move to a faster, maintainable stack with a redirect plan, so the search history your site has earned moves with it.",
  },
  {
    title: "Give the team an editor",
    body: "A content admin shaped to your routines: menus, projects, events, posts. Your staff publish without a developer.",
  },
  {
    title: "Accounts and permissions",
    body: "Roles, invitations and safe defaults for sites where more than one person needs to make changes.",
  },
  {
    title: "Apps and tools",
    body: "Mobile and web products built the same way as our own: small, tested and honest about what they do.",
  },
] as const;
