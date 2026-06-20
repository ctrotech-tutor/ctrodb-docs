import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BlogPageContent } from "@/components/blog-page-content"
import { getAllPosts, getAllCategories } from "@/lib/posts"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Blog",
  description: "Thoughts on building ctrodb, client-side databases, and TypeScript.",
}

export default async function BlogPage(props: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await props.searchParams
  const allPosts = getAllPosts()
  const categories = getAllCategories(allPosts)

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <BlogPageContent
          allPosts={allPosts}
          categories={categories}
          initialCategory={category && categories.includes(category) ? category : null}
        />
      </main>
      <Footer />
    </>
  )
}
