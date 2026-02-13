import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";

const mdxSource = docs.toFumadocsSource();
// fumadocs-mdx@11 returns files as a function, core@15 expects an array
const files = (mdxSource.files as unknown as () => unknown[])();

export const source = loader({
  baseUrl: "/docs",
  source: { files } as ReturnType<typeof docs.toFumadocsSource>,
});
