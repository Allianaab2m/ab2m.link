import remarkBudoux from "remark-budoux";
import { visit } from "unist-util-visit";

/**
 * remark-budoux, but leaving headings untouched.
 *
 * remark-budoux turns text nodes into raw HTML. Inside headings this leaves
 * the heading without text for rehype-slug / Astro's heading ids, so every
 * heading would get an empty id and the TOC / anchor links would break.
 */
export function remarkBudouxExceptHeadings() {
	const transform = remarkBudoux();
	return (tree) => {
		const stashed = [];
		visit(tree, "heading", (node) => {
			stashed.push([node, node.children]);
			node.children = [];
		});
		transform(tree);
		for (const [node, children] of stashed) {
			node.children = children;
		}
	};
}
