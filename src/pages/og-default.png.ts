import { ogCard } from "../lib/og";
export async function GET() {
  return new Response(await ogCard("Four Paths", "Thoughtful software for practice, play, learning and everyday life."), { headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000, immutable" } });
}
