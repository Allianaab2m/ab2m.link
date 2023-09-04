import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

export type FrontmatterType = {
  slug: string;
  title: string;
  publishedAt: string;
};

export const getPostDir = () => join(process.cwd(), "src", "blogs");

export const getSlugs = () => {
  const files = fs.readdirSync(getPostDir(), {
    withFileTypes: true,
  });
  return files.flatMap((f) =>
    f.isFile() && f.name.endsWith(".mdx") ? f.name.replace(/.mdx/g, "") : []
  );
};

export const getPostData = (
  slug: string,
): { data: FrontmatterType; content: string } => {
  const { data, content } = matter(
    fs.readFileSync(join(getPostDir(), `${slug}.mdx`)),
  );
  return {
    data: {
      slug,
      ...data,
    } as FrontmatterType,
    content,
  };
};
