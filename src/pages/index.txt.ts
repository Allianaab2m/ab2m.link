import type { APIRoute } from "astro";
import sharp from "sharp";
import { profileConfig } from "@/config";

/*
 * Plain-text profile for CLI HTTP clients (curl, wget, ...), in the style of
 * neofetch / fastfetch. vercel.json rewrites `/` to this file by User-Agent.
 * The avatar is drawn with half blocks (2 pixels per character) in 24-bit
 * color; everything else is ASCII.
 */

// must be even: each text line holds two pixel rows
const AVATAR_SIZE = 32;
const BIO = "TypeScript / Neovim / Linux enthusiast.";

const ESC = "\x1b[";
const RESET = `${ESC}0m`;
const BOLD = `${ESC}1m`;
const fg = (n: number) => `${ESC}38;5;${n}m`;
const fgRgb = (r: number, g: number, b: number) => `${ESC}38;2;${r};${g};${b}m`;
const bgRgb = (r: number, g: number, b: number) => `${ESC}48;2;${r};${g};${b}m`;

async function renderAvatar(): Promise<string[]> {
	if (!profileConfig.avatar) {
		return [];
	}
	try {
		const res = await fetch(profileConfig.avatar);
		if (!res.ok) {
			throw new Error(`HTTP ${res.status}`);
		}
		const { data } = await sharp(Buffer.from(await res.arrayBuffer()))
			.resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover" })
			.flatten({ background: "#000000" })
			.removeAlpha()
			.raw()
			.toBuffer({ resolveWithObject: true });
		const lines: string[] = [];
		const pixel = (x: number, y: number): [number, number, number] => {
			const i = (y * AVATAR_SIZE + x) * 3;
			return [data[i], data[i + 1], data[i + 2]];
		};
		// One character holds two vertical pixels: upper half as the foreground
		// of "▀", lower half as the background
		for (let y = 0; y < AVATAR_SIZE; y += 2) {
			let line = "";
			for (let x = 0; x < AVATAR_SIZE; x++) {
				line += `${fgRgb(...pixel(x, y))}${bgRgb(...pixel(x, y + 1))}▀`;
			}
			lines.push(line + RESET);
		}
		return lines;
	} catch (e) {
		// Keep the build going without the avatar
		console.warn(
			`[index.txt] failed to render avatar: ${e}`,
			(e as Error).cause ?? "",
		);
		return [];
	}
}

function renderInfo(site: URL): string[] {
	const accent = fg(141);
	const user = `${profileConfig.name.toLowerCase()}@${site.host}`;
	const field = (key: string, value: string) =>
		`${accent}${BOLD}${key}${RESET}: ${value}`;
	return [
		`${accent}${BOLD}${user}${RESET}`,
		"-".repeat(user.length),
		field("Name", profileConfig.name),
		field("Bio", BIO),
		"",
		...profileConfig.links.map((link) => field(link.name, link.url)),
		"",
		field("Web", site.href),
		field("Blog", new URL("blog/", site).href),
	];
}

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site ?? new URL("https://ab2m.link/");
	const avatar = await renderAvatar();
	const info = renderInfo(siteUrl);
	const gap = "   ";
	const lines: string[] = [];
	for (let i = 0; i < Math.max(avatar.length, info.length); i++) {
		const left =
			avatar[i] ?? (avatar.length > 0 ? " ".repeat(AVATAR_SIZE) : "");
		lines.push(
			`${left}${avatar.length > 0 ? gap : ""}${info[i] ?? ""}`.trimEnd(),
		);
	}
	return new Response(`\n${lines.join("\n")}\n\n`, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
