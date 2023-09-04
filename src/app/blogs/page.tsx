import { getPostData, getSlugs } from "@/lib/blog"
import BlogArticleCard from "@/components/blogs/card"
import { AnimatePresenceWrapper, PopupMotionWrapperLi } from "@/components/motionWrapper"

const BlogsPage = () => {
  const slugs = getSlugs()
  return (
    <AnimatePresenceWrapper>
      <div className="mx-auto px-4 my-4 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {
            slugs.map(s => {
              return (
                <PopupMotionWrapperLi key={s}>
                  <BlogArticleCard frontmatter={getPostData(s).data} />
                </PopupMotionWrapperLi>
              )
            })
          }
        </div>
      </div>
    </AnimatePresenceWrapper>
  )
}

export default BlogsPage
