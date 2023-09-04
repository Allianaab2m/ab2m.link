import { AnimatePresenceWrapper, PopupMotionWrapperLi } from "@/components/motionWrapper";
import { ZennArticleData } from "@/types/articles/zennApi"
import ArticleCard from "@/components/articles/card"

async function fetchArticleData() {
  const res = await fetch("https://zenn.dev/api/articles?username=alliana_ab2m&order=latest")
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function Articles() {
  const data: { articles: ZennArticleData[] } = await fetchArticleData()
  return (
    <AnimatePresenceWrapper>
      <div className="mx-auto px-4 my-4 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {
            data.articles.map((a) =>
              <PopupMotionWrapperLi key={a.slug}>
                <ArticleCard data={a} />
              </PopupMotionWrapperLi>
            )
          }
        </div>
      </div>
    </AnimatePresenceWrapper>
  )
}
