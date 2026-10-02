import { site } from "../site.config";

const TOKEN = /\{\{\s*([a-zA-Z]+)\s*\}\}/g;

export const siteTokenValues: Record<string, string> = {
  name: site.name,
  legalName: site.legalName,
  email: site.email,
  privacyEmail: site.privacyEmail,
  country: site.country,
  url: site.url,
};

/** Replaces {{token}} placeholders. Unknown tokens throw so typos fail the build. */
export function fillTokens(text: string, values: Record<string, string> = siteTokenValues): string {
  return text.replace(TOKEN, (_, key: string) => {
    if (!(key in values)) throw new Error(`Unknown site token {{${key}}}`);
    return values[key];
  });
}

interface MdNode {
  type: string;
  value?: string;
  url?: string;
  children?: MdNode[];
}

/** Remark plugin: fills site tokens in Markdown text, inline code, and link URLs. */
export function remarkSiteTokens() {
  const visit = (node: MdNode) => {
    if (typeof node.value === "string" && (node.type === "text" || node.type === "inlineCode")) {
      node.value = fillTokens(node.value);
    }
    if (typeof node.url === "string") node.url = fillTokens(decodeURI(node.url));
    node.children?.forEach(visit);
  };
  return (tree: MdNode) => visit(tree);
}
