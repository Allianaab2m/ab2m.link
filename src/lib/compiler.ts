import { compileMDX } from "next-mdx-remote/rsc";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";

import replaceComponents from "@/components/MDXComponent";
import rehypeSlug from "rehype-slug";

const compiler = async (source: string) => {
  const result: Promise<{
    content: JSX.Element;
  }> = compileMDX({
    source,
    components: replaceComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
          behavior: "wrap",
        }]],
        remarkRehypeOptions: {
          footnoteLabel: "脚注",
          footnoteBackLabel: "戻る",
        },
        format: "mdx",
      },
      parseFrontmatter: false,
    },
  });
  return result;
};

export default compiler;
