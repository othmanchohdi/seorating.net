import { safeFetchBytes } from "@/lib/ai-check/net";

// Reads an image's real pixel size from the first bytes of the file, so we
// don't have to download whole images. Covers the formats stores use.

export type ImageFormat = "jpeg" | "png" | "gif" | "webp" | "avif" | "svg" | "other";

export function sniffFormat(b: Uint8Array, contentType: string): ImageFormat {
  const ascii = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to));
  if (b[0] === 0xff && b[1] === 0xd8) return "jpeg";
  if (b[0] === 0x89 && ascii(1, 4) === "PNG") return "png";
  if (ascii(0, 3) === "GIF") return "gif";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "webp";
  if (ascii(4, 8) === "ftyp" && /avi[fs]/.test(ascii(8, 12))) return "avif";
  if (/svg/i.test(contentType) || /<svg\b/i.test(ascii(0, Math.min(b.length, 512)))) return "svg";
  return "other";
}

const u16be = (b: Uint8Array, i: number) => (b[i] << 8) | b[i + 1];
const u16le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8);
const u24le = (b: Uint8Array, i: number) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16);
const u32be = (b: Uint8Array, i: number) => ((b[i] << 24) >>> 0) + ((b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]);

export function imageSize(b: Uint8Array, format: ImageFormat): { width: number; height: number } | null {
  try {
    if (format === "png" && b.length >= 24) return { width: u32be(b, 16), height: u32be(b, 20) };
    if (format === "gif" && b.length >= 10) return { width: u16le(b, 6), height: u16le(b, 8) };
    if (format === "jpeg") {
      let i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xff) return null;
        const marker = b[i + 1];
        // SOF0–SOF15 carry the frame size, except DHT (C4), JPG (C8) and DAC (CC).
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: u16be(b, i + 5), width: u16be(b, i + 7) };
        i += 2 + u16be(b, i + 2);
      }
      return null;
    }
    if (format === "webp" && b.length >= 30) {
      const chunk = String.fromCharCode(...b.subarray(12, 16));
      if (chunk === "VP8 ") return { width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff };
      if (chunk === "VP8L") {
        const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      if (chunk === "VP8X") return { width: u24le(b, 24) + 1, height: u24le(b, 27) + 1 };
      return null;
    }
    if (format === "avif") {
      // The "ispe" (image spatial extents) property box: 4 bytes version/flags, then width and height.
      for (let i = 4; i + 16 < b.length; i++) {
        if (b[i] === 0x69 && b[i + 1] === 0x73 && b[i + 2] === 0x70 && b[i + 3] === 0x65) return { width: u32be(b, i + 8), height: u32be(b, i + 12) };
      }
      return null;
    }
    if (format === "svg") {
      const text = new TextDecoder().decode(b.subarray(0, 4096));
      const tag = text.match(/<svg\b[^>]*>/i)?.[0] ?? "";
      const w = parseFloat(tag.match(/\bwidth=["']([\d.]+)/)?.[1] ?? "");
      const h = parseFloat(tag.match(/\bheight=["']([\d.]+)/)?.[1] ?? "");
      if (w && h) return { width: w, height: h };
      const vb = tag.match(/viewBox=["'][\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
      return vb ? { width: parseFloat(vb[1]), height: parseFloat(vb[2]) } : null;
    }
  } catch {
    return null;
  }
  return null;
}

export type ImageInfo = {
  url: string;
  status: number | null;
  format: ImageFormat | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
};

// Fetches just enough of an image to know its format, file size and pixel size.
export async function probeImage(url: string): Promise<ImageInfo> {
  const empty: ImageInfo = { url, status: null, format: null, bytes: null, width: null, height: null };
  let res;
  try {
    res = await safeFetchBytes(new URL(url));
  } catch {
    return empty;
  }
  if (!res) return empty;
  if (res.status !== 200) return { ...empty, status: res.status };
  const format = sniffFormat(res.bytes, res.contentType);
  const size = imageSize(res.bytes, format);
  return { url: res.finalUrl, status: res.status, format, bytes: res.totalBytes, width: size?.width ?? null, height: size?.height ?? null };
}
