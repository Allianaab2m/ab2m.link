import type { APIRoute } from "astro";
import sharp from "sharp";
import { profileConfig } from "@/config";

/*
 * Plain-text profile for CLI HTTP clients (curl, wget, ...), in the style of
 * neofetch / fastfetch. vercel.json rewrites `/` to this file by User-Agent.
 * Everything is ASCII: the avatar is drawn with background-colored spaces
 * (2 spaces per pixel) using the xterm 256-color palette.
 */

const AVATAR_SIZE = 18;
const BIO = "TypeScript / Neovim / Linux enthusiast.";

const ESC = "\x1b[";
const RESET = `${ESC}0m`;
const BOLD = `${ESC}1m`;
const fg = (n: number) => `${ESC}38;5;${n}m`;
const bg = (n: number) => `${ESC}48;5;${n}m`;

// xterm 256-color palette: 6x6x6 color cube (16-231) and grayscale ramp (232-255)
const CUBE_LEVELS = [0, 95, 135, 175, 215, 255];

function nearestCubeLevel(v: number): number {
	let best = 0;
	for (let i = 1; i < CUBE_LEVELS.length; i++) {
		if (Math.abs(CUBE_LEVELS[i] - v) < Math.abs(CUBE_LEVELS[best] - v)) {
			best = i;
		}
	}
	return best;
}

function distance(a: number[], b: number[]): number {
	return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function toAnsi256(r: number, g: number, b: number): number {
	const [ri, gi, bi] = [r, g, b].map(nearestCubeLevel);
	const cube = [CUBE_LEVELS[ri], CUBE_LEVELS[gi], CUBE_LEVELS[bi]];
	const grayIndex = Math.min(
		23,
		Math.max(0, Math.round(((r + g + b) / 3 - 8) / 10)),
	);
	const grayLevel = 8 + grayIndex * 10;
	const gray = [grayLevel, grayLevel, grayLevel];
	return distance([r, g, b], cube) <= distance([r, g, b], gray)
		? 16 + 36 * ri + 6 * gi + bi
		: 232 + grayIndex;
}

async function renderAvatar(): Promise<string[]> {
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
		for (let y = 0; y < AVATAR_SIZE; y++) {
			let line = "";
			for (let x = 0; x < AVATAR_SIZE; x++) {
				const i = (y * AVATAR_SIZE + x) * 3;
				line += `${bg(toAnsi256(data[i], data[i + 1], data[i + 2]))}  `;
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
			avatar[i] ?? (avatar.length > 0 ? " ".repeat(AVATAR_SIZE * 2) : "");
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
