import fs from "fs";
import { join } from "path";

export const getPostDir = () => join(process.cwd(), "src", "blogs");

export const getSlugs = () => {
  const files = fs.readdirSync(getPostDir(), {
    withFileTypes: true,
  });
  return files.flatMap((f) =>
    f.isFile() && f.name.endsWith(".mdx") ? f.name.replace(/.mdx/g, "") : []
  );
};
