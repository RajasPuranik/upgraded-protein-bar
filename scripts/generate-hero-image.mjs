import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const width = 1200;
const height = 900;
const bytes = Buffer.alloc(width * height * 4);

function rgba(hex, alpha = 255) {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
    alpha
  ];
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function setPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const offset = (y * width + x) * 4;
  bytes[offset] = color[0];
  bytes[offset + 1] = color[1];
  bytes[offset + 2] = color[2];
  bytes[offset + 3] = color[3];
}

function blendPixel(x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const offset = (y * width + x) * 4;
  const alpha = color[3] / 255;
  bytes[offset] = mix(bytes[offset], color[0], alpha);
  bytes[offset + 1] = mix(bytes[offset + 1], color[1], alpha);
  bytes[offset + 2] = mix(bytes[offset + 2], color[2], alpha);
  bytes[offset + 3] = 255;
}

function roundedRect(x, y, w, h, r, color) {
  x = Math.round(x);
  y = Math.round(y);
  w = Math.round(w);
  h = Math.round(h);
  r = Math.round(r);
  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      const cx = px < x + r ? x + r : px > x + w - r ? x + w - r : px;
      const cy = py < y + r ? y + r : py > y + h - r ? y + h - r : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= r * r) {
        blendPixel(px, py, color);
      }
    }
  }
}

function ellipse(cx, cy, rx, ry, color) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  rx = Math.round(rx);
  ry = Math.round(ry);
  for (let y = Math.floor(cy - ry); y <= cy + ry; y += 1) {
    for (let x = Math.floor(cx - rx); x <= cx + rx; x += 1) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      if (nx * nx + ny * ny <= 1) {
        blendPixel(x, y, color);
      }
    }
  }
}

function bar(x, y, w, h, c1, c2, labelTone) {
  for (let py = y; py < y + h; py += 1) {
    const t = (py - y) / h;
    const color = [
      mix(c1[0], c2[0], t),
      mix(c1[1], c2[1], t),
      mix(c1[2], c2[2], t),
      255
    ];
    roundedRect(x, py, w, 2, 20, color);
  }
  roundedRect(x, y, w, Math.round(h * 0.42), 20, rgba("#ffffff", 30));
  for (let i = 1; i <= 4; i += 1) {
    const lx = Math.round(x + (w / 5) * i);
    roundedRect(lx - 1, y + 5, 2, h - 10, 1, rgba("#000000", 80));
  }
  roundedRect(x + w * 0.34, y + h * 0.42, w * 0.32, h * 0.12, 4, labelTone);
}

function crcTable() {
  const table = [];
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const table = crcTable();

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const t = y / height;
    const vignette = Math.hypot((x - width * 0.52) / width, (y - height * 0.46) / height);
    const base = [
      mix(18, 40, t),
      mix(18, 38, t),
      mix(14, 22, t),
      255
    ];
    base[0] = Math.max(10, base[0] - vignette * 20);
    base[1] = Math.max(10, base[1] - vignette * 18);
    base[2] = Math.max(8, base[2] - vignette * 14);
    setPixel(x, y, base);
  }
}

ellipse(230, 160, 250, 120, rgba("#a8d65f", 26));
ellipse(1000, 210, 220, 140, rgba("#ff6b4a", 22));
ellipse(580, 780, 520, 100, rgba("#000000", 90));

bar(250, 410, 700, 118, rgba("#7b3d23"), rgba("#351811"), rgba("#f6b73c", 210));
bar(170, 530, 420, 82, rgba("#9b5c24"), rgba("#4d2a14"), rgba("#a8d65f", 210));
bar(610, 560, 430, 82, rgba("#6f3922"), rgba("#26130f"), rgba("#68d8c2", 210));

ellipse(285, 325, 58, 44, rgba("#7a4b22", 255));
ellipse(315, 314, 28, 20, rgba("#ad7033", 230));
ellipse(900, 340, 46, 60, rgba("#7d4d24", 255));
ellipse(920, 332, 20, 26, rgba("#c4873e", 220));
ellipse(485, 300, 52, 38, rgba("#7c5428", 255));
ellipse(505, 296, 25, 17, rgba("#d2a13e", 210));
ellipse(760, 292, 60, 36, rgba("#f6b73c", 220));
ellipse(778, 284, 24, 13, rgba("#fff1ba", 100));

roundedRect(410, 248, 380, 54, 8, rgba("#10100d", 150));
roundedRect(430, 264, 110, 18, 3, rgba("#a8d65f", 230));
roundedRect(560, 264, 94, 18, 3, rgba("#f6b73c", 230));
roundedRect(674, 264, 92, 18, 3, rgba("#68d8c2", 230));

const raw = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  const rowStart = y * (width * 4 + 1);
  raw[rowStart] = 0;
  bytes.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0))
]);

const outPath = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "fuelbar-product-hero.png");
writeFileSync(outPath, png);
console.log(outPath);
