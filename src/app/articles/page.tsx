import { MaterialSymbolsFavorite } from "@/components/logos/favorite";
import { SimpleIconsZenn } from "@/components/logos/zenn";

export type ZennArticleData = {
  id: number;
  post_type: "Article";
  title: string;
  slug: string;
  published: boolean;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  article_type: "tech" | "idea";
  emoji: string;
  is_suspending_private: boolean;
  published_at: string;
  body_updated_at: string;
  source_repo_updated_at: string;
  path: string;
  user: {
    id: number
    username: string
    name: string
    avatar_small_url: string
  }
  publication: null;
}
async function fetchArticleData() {
  const res = await fetch("https://zenn.dev/api/articles?username=alliana_ab2m&order=latest")
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

function ArticleCard(props: { data: ZennArticleData, className?: string }) {
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

export default async function Articles() {
  const data: { articles: ZennArticleData[] } = await fetchArticleData()
  return (
    <div className="mx-auto px-4 mt-4 container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data.articles.map((a) =>
          <ArticleCard
            data={a}
            key={a.slug}
          />)}
      </div>
    </div>
  )
}
