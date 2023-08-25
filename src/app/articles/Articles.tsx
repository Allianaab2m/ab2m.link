import MotionWrapper, { PopupMotionWrapperLi } from "@/components/motionWrapper";
import { ZennArticleData, fetchArticleData, ArticleCard } from "./page";


export default async function Articles() {
  const data: { articles: ZennArticleData[]; } = await fetchArticleData();
  return (
    <MotionWrapper>
      <div className="mx-auto px-4 mt-4 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.articles.map((a) => <PopupMotionWrapperLi>
            <ArticleCard
              data={a}
              key={a.slug} />
          </PopupMotionWrapperLi>)}
        </div>
      </div>
    </MotionWrapper>
  );
}

