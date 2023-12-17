import { z, defineCollection } from "astro:content"
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published_at: z.string()
  })
})

export const collections = {
  blog: blogCollection
}

