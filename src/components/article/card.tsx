import { SimpleIconsZenn } from "@/components/logos/zenn"
import { MaterialSymbolsFavorite } from "@/components/logos/favorite"
import { ZennArticleData } from "@/types/articles/zennapi"

export default function ArticleCard(props: { data: ZennArticleData, className?: string }) {
  const { title, path, published_at, body_updated_at, liked_count } = props.data

  return (
    <div className={props.className}>
      <div className="rounded-md bg-base-200 p-4">
        <a href={`https://zenn.dev${path}`}>
          <div className="flex flex-col">
            <div className="flex gap-1">
              <SimpleIconsZenn className="mt-1" />
              <h2 className="card-title">{title}</h2>
            </div>
            <div className="flex gap-1">
              <p>投稿: {new Date(Date.parse(published_at)).toLocaleDateString("ja-JP")}</p>
              <p>更新: {new Date(Date.parse(body_updated_at)).toLocaleDateString("ja-JP")}</p>
              <MaterialSymbolsFavorite className="mt-0.5" />
              <p>{liked_count}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}
