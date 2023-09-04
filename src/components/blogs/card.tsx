import { FrontmatterType } from "@/lib/blog"
import Link from "next/link"

export default function BlogArticleCard(props: { frontmatter: FrontmatterType, className?: string }) {
  const { className } = props
  const { slug, title, publishedAt } = props.frontmatter

  return (
    <div className={className}>
      <Link href={`/blogs/${slug}`}>
        <div className="rounded-md bg-base-200 p-4">
          <div className="flex flex-col">
            <div className="flex gap-1">
              <h2 className="card-title">{title}</h2>
            </div>
            <div className="flex gap-1">
              <p>投稿: {new Date(Date.parse(publishedAt)).toLocaleDateString("ja-JP")}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
