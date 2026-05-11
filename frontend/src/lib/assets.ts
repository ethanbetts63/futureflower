import type { StaticImageData } from "next/image";

export function assetSrc(asset: string | StaticImageData) {
  return typeof asset === "string" ? asset : asset.src;
}
