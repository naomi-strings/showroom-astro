import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/*
  Each brand lives in its own folder: src/content/brands/<slug>/index.md
  The folder name is the URL (/brands/<slug>/) and is used to find the
  brand's logo (src/assets/logos/logo-<slug>.svg).
  Image fields are bare filenames; the files sit next to index.md.
*/
const brands = defineCollection({
  loader: glob({ base: "./src/content/brands", pattern: "*/index.md" }),
  schema: z.object({
    name: z.string(),
    featured: z.boolean().default(false),
    blurb: z.string().optional(), // image alt text, meta description, and the line under the brand-page heading
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    heroPosition: z.string().default("center"), // object-position for the brand-page hero, e.g. "center 30%"
    logoWidth: z.string().default("35%"), // width of the logo on the home-page card
    logoStyle: z.enum(["white", "native"]).default("white"), // which logo file to show on the brand page hero
    website: z.string().url().optional(),
    instagramTag: z.string().optional(), // defaults to <slug>showroomboston
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
  }),
});

/*
  Press clips: one folder per clip, src/content/press/<year>-<nn>/index.md
  Folder names sort newest first. Old clips have one composited `image`;
  new clips use two layers, `cover` (magazine) and `item` (cut-out product).
*/
const press = defineCollection({
  loader: glob({ base: "./src/content/press", pattern: "*/index.md" }),
  schema: z
    .object({
      caption: z.string(), // "Publication | Issue" (or free text for old clips)
      headline: z.string().default(""),
      year: z.number(),
      alt: z.string(),
      image: z.string().optional(), // old style: one composited picture
      cover: z.string().optional(), // new style: magazine cover
      item: z.string().optional(), // new style: product cut-out, layered on top
      itemPosition: z.string().default("0 50%"), // "right-inset vertical-center", e.g. "5% 40%"
      itemWidth: z.string().default("60%"), // width of the cut-out as a share of the tile
    })
    .refine((d) => d.image || d.cover, {
      message: "a press clip needs either `image` or `cover` (with an optional `item`)",
    }),
});

export const collections = { brands, press };
