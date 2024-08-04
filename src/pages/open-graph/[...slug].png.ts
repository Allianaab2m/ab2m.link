import type { APIContext, ImageMetadata, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { getCollection } from 'astro:content'
import { Resvg } from '@resvg/resvg-js'
import { siteConfig } from '@/config'

/* TTF, OTF and WOFF, this import may not compatible with all static pages services (?) */
// import Roboto300 from 'node_modules/@fontsource/roboto/files/roboto-latin-300-normal.woff'
// import Roboto700 from 'node_modules/@fontsource/roboto/files/roboto-latin-700-normal.woff'
import IBMPlexSansJP300 from 'node_modules/@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-100-normal.woff'
import IBMPlexSansJP700 from 'node_modules/@fontsource/ibm-plex-sans-jp/files/ibm-plex-sans-jp-japanese-700-normal.woff'

const ogOptions: SatoriOptions = {
  width: 1200,
  height: 630,
  // debug: true,
  fonts: [
    {
      name: 'IBM Plex Sans JP',
      data: Buffer.from(IBMPlexSansJP300),
      weight: 400,
      style: 'normal',
    },
    {
      name: 'IBM Plex Sans JP',
      data: Buffer.from(IBMPlexSansJP700),
      weight: 700,
      style: 'normal',
    },
  ],
}

const markup = (
  title: string,
  published: Date,
  description?: string,
  category?: string,
  tags?: string[],
) =>
  /* Satori uses tailwind! Create or view a desing using https://og-playground.vercel.app/ */
  html`
  <div tw="flex flex-col w-full h-full items-center justify-center bg-[#1c1c24] p-8">
    <div tw="flex flex-col w-full h-full bg-white rounded-xl drop-shadow-xl">
      <span tw="text-5xl font-bold pt-12 pl-8 pb-4">${title}</span>
      <span tw="text-2xl pl-8 pb-36">${description}</span>
      <span tw="text-3xl pl-140">ab2m.link</span>
    </div>
  </div>
  `

type Props = InferGetStaticPropsType<typeof getStaticPaths>

/**
 * Route for dynamic Open Graph images.
 * This function will generate Open Graph images only if enabled in `config.ts`.
 *
 * @returns {Promise<object>} An object containing the GET, getStaticPaths methods for astro.
 */
async function getOpenGraphData() {
  if (siteConfig.postOGImageDynamic) {
    return {
      GET: async function GET(context: APIContext) {
        const { title, description, published, category, tags } =
          context.props as Props
        const svg = await satori(
          markup(title, published, description, category, tags),
          ogOptions,
        )
        const png = new Resvg(svg).render().asPng()

        return new Response(png, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
      getStaticPaths: async function getStaticPaths() {
        const posts = await getCollection('posts')
        const result = posts
          .filter(({ data }) => !data.draft)
          .map(post => ({
            params: { slug: post.slug },
            props: {
              title: post.data.title,
              description: post.data.description,
              published: post.data.published,
              category: post.data.category,
              tags: post.data.tags,
            },
          }))
        return result
      },
    }
  }
  return { getStaticPaths: {}, GET: {} }
}

export const { getStaticPaths, GET } = await getOpenGraphData()
