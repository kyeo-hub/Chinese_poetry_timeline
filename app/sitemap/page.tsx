import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function SitemapPage() {
  const supabase = await createClient()
  
  // 获取诗人列表
  const { data: poets } = await supabase
    .from("poets")
    .select("id, name")
    .order("name")
  
  // 获取朝代列表
  const { data: dynasties } = await supabase
    .from("dynasties")
    .select("id, name")
    .order("start_year")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-block mb-6 text-sm text-primary hover:underline"
          >
            ← 返回首页
          </Link>
          
          <article className="prose prose-gray max-w-none dark:prose-invert">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">网站地图</h1>
              <p className="text-muted-foreground">帮助您快速找到网站内容</p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">主要页面</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-primary hover:underline">
                    首页 - 诗人时间轴
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-primary hover:underline">
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-use" className="text-primary hover:underline">
                    使用条款
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="text-primary hover:underline">
                    网站地图
                  </Link>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">朝代</h2>
              {dynasties && dynasties.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {dynasties.map((dynasty) => (
                    <li key={dynasty.id}>
                      <Link 
                        href={`/dynasty/${dynasty.id}`} 
                        className="text-primary hover:underline"
                      >
                        {dynasty.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">暂无朝代信息</p>
              )}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">诗人列表</h2>
              {poets && poets.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {poets.map((poet) => (
                    <li key={poet.id}>
                      <Link 
                        href={`/poet/${poet.id}`} 
                        className="text-primary hover:underline"
                      >
                        {poet.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">暂无诗人信息</p>
              )}
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">帮助与支持</h2>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-primary hover:underline">
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-primary hover:underline">
                    常见问题
                  </Link>
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>
    </div>
  )
}