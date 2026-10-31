/* two site designs live side by side under /1/ and /2/ so the client can compare them */
export const DESIGNS = ["1", "2"] as const;
export type Design = (typeof DESIGNS)[number];

/* for getStaticPaths on pages with no other params */
export const designPaths = () => DESIGNS.map((design) => ({ params: { design } }));

export const otherDesign = (d: string): Design => (d === "1" ? "2" : "1");

/* the path with its leading /1 or /2 removed, for "current page" checks */
export const stripDesign = (path: string) => path.replace(/^\/[12](?=\/|$)/, "") || "/";
