import { writeFileSync } from "fs";

function createSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c5cfc"/>
      <stop offset="100%" style="stop-color:#0a0a0f"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="system-ui, -apple-system, sans-serif" font-weight="700"
    font-size="${size * 0.45}" fill="#ffffff" letter-spacing="-0.02em">P</text>
</svg>`;
}

writeFileSync("public/icons/icon-192x192.svg", createSVG(192));
writeFileSync("public/icons/icon-512x512.svg", createSVG(512));
writeFileSync("public/icons/apple-touch-icon.svg", createSVG(180));

console.log("SVGs created");
