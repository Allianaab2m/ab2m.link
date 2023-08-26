import fs from "fs"
import { getSlugs, getPostDir } from "@/lib/blog"
import { join } from "path"
import { cache } from "react"
import compiler from "@/lib/compiler"
import { JSDOM } from "jsdom"

const fetchPost = cache(async (slug: string) => {
  const post = fs.readFileSync(join(getPostDir(), `${slug}.mdx`), "utf-8")
  return post
})

const BlogPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params
  const file = await fetchPost(slug)

  const lines = file.split("\n")

  await Promise.all(lines.map(async (line, index) => {
    if (line.indexOf("https://") === 0) {
      const res = await fetch(line)
      const html = await res.text()
      const doms = new JSDOM(html)
      const metadata = {
        url: line,
        title: "(Fetch error)",
        description: "(Fetch error)",
        image: "",
      }

      const metas = doms.window.document.getElementsByTagName("meta")
      metadata.title = doms.window.document.getElementsByTagName("title")[0].text

      for (let i = 0; i < metas.length; i++) {
        let pro = metas[i].getAttribute("property")
        if (typeof pro == "string") {
          if (pro.match("description")) metadata.description = metas[i].getAttribute("content") ?? "(Fetch error)";
          if (pro.match("og:image")) metadata.image = metas[i].getAttribute("content") ?? "(Fetch error)";
        }
        pro = metas[i].getAttribute("name")
        if (typeof pro == "string") {
          if (pro.match("description")) metadata.description = metas[i].getAttribute("content") ?? "(Fetch error)"
          if (pro.match("og:image")) metadata.image = metas[i].getAttribute("content") ?? "(Fetch error)"
        }
      }
      console.log(metadata)
      const title = `<div className="text-xl font-bold">${metadata.title}</div>`
      const description = `<div className="text-xs">${metadata.description.length > 20 ? metadata.description.substring(0, 20) + "..." : metadata.description}</div>`
      const favicon = `<img className="w-4 h-4 mt-0.5" src="http://www.google.com/s2/favicons?domain=${metadata.url}" />`

      lines[index] = `
<a href="${metadata.url}">
  <div className="rounded-md p-4 bg-neutral my-4 flex">
    <div className="flex flex-col">
      ${title}
      ${description}
      <div className="flex gap-2 text-sm">
        ${favicon}
        ${metadata.url}
      </div>
    </div>
  </div>
</a>
`
    }
  }))

  const { content } = await compiler(lines.join("\n"))
  console.log(content)

  return (
    <div className="container px-4 mx-auto">
      {content}
    </div>
  )
}

export const generateStaticParams = async () => {
  const slugs = getSlugs()
  return slugs.map(s => {
    return {
      slug: s
    }
  })
}

export default BlogPage
