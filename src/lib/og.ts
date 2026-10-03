import sharp from "sharp";

const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function ogCard(title: string, subtitle: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#161a18"/>
    <path d="M70 88h1060M70 545h1060" stroke="#3b433d"/>
    <text x="70" y="70" fill="#a6aea5" font-family="Arial,sans-serif" font-size="20" letter-spacing="5">FOUR PATHS / INDEPENDENT PRODUCT STUDIO</text>
    <path d="M1020 302c55 0 74-115 135-115m-135 115c55 0 74 115 135 115M1155 187c35 0 45 48 80 48M1155 417c35 0 45-48 80-48" stroke="#839b78" fill="none" stroke-width="2"/>
    <circle cx="1020" cy="302" r="6" fill="#839b78"/>
    <text x="70" y="310" fill="#f1efe7" font-family="Georgia,serif" font-size="96">${escape(title)}</text>
    <text x="74" y="386" fill="#c5cac3" font-family="Arial,sans-serif" font-size="28">${escape(subtitle)}</text>
    <text x="70" y="590" fill="#a6aea5" font-family="Arial,sans-serif" font-size="18" letter-spacing="4">FOURPATHS.CA</text>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
