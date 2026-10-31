import type { ImageMetadata } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export type Brand = CollectionEntry<"brands">;

/* every photo inside a brand or press folder, keyed by full path */
const photos = import.meta.glob<ImageMetadata>(
  "/src/content/{brands,press}/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" }
);

/* every logo, keyed by filename */
const logos = import.meta.glob<any>("/src/assets/logos/*.svg", {
  eager: true,
  import: "default",
});

/* bare filename -> processed image; fails the build loudly if the file is missing */
export function brandImage(slug: string, filename: string): ImageMetadata {
  const key = `/src/content/brands/${slug}/${filename}`;
  const img = photos[key];
  if (!img) {
    throw new Error(
      `Brand "${slug}": image "${filename}" not found. Expected src/content/brands/${slug}/${filename}`
    );
  }
  return img;
}

/* logo component for a brand: logo-<slug>.svg or logo-<slug>-native.svg.
   Returns null when the brand has no logo file yet, so pages can fall back to the name. */
export function brandLogo(slug: string, style: "white" | "native" = "white") {
  const file = style === "native" ? `logo-${slug}-native.svg` : `logo-${slug}.svg`;
  return logos[`/src/assets/logos/${file}`] ?? null;
}

/* same lookup for press clips */
export function pressImage(slug: string, filename: string): ImageMetadata {
  const key = `/src/content/press/${slug}/${filename}`;
  const img = photos[key];
  if (!img) {
    throw new Error(
      `Press clip "${slug}": image "${filename}" not found. Expected src/content/press/${slug}/${filename}`
    );
  }
  return img;
}

export function instagramUrl(brand: Brand): string {
  const tag = brand.data.instagramTag ?? `${brand.id}showroomboston`;
  return `https://www.instagram.com/explore/tags/${tag}/`;
}

const byName = (a: Brand, b: Brand) => a.data.name.localeCompare(b.data.name);

export async function getFeaturedBrands(): Promise<Brand[]> {
  return (await getCollection("brands", (b) => b.data.featured)).sort(byName);
}

export async function getOtherBrands(): Promise<Brand[]> {
  return (await getCollection("brands", (b) => !b.data.featured)).sort(byName);
}
