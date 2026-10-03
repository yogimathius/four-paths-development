import { work } from "../../lib/studio";
import { ogCard } from "../../lib/og";
export function getStaticPaths() { return work.map((project) => ({ params: { slug: project.slug }, props: { project } })); }
export async function GET({ props }: { props: { project: (typeof work)[number] } }) {
  return new Response(await ogCard(props.project.name, props.project.premise), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" } });
}
