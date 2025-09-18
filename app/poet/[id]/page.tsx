import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatLifeSpan } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PoetDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch poet details
  const { data: poet, error: poetError } = await supabase.from("poets").select("*").eq("id", id).single()

  if (poetError || !poet) {
    notFound()
  }

  // Fetch poet's poems
  const { data: poems } = await supabase
    .from("poems")
    .select("*")
    .eq("poet_id", id)
    .order("writing_year", { ascending: true })

  // Fetch related poets
  const { data: relatedPoets } = await supabase
    .from("poets")
    .select("id, name, brief_tag, portrait_url")
    .eq("dynasty", poet.dynasty)
    .neq("id", poet.id)
    .limit(5)

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={poet.portrait_url || "/placeholder.svg?height=120&width=120"}
                alt={poet.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{poet.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="default" className="text-sm">
                  {poet.dynasty}
                </Badge>
                {poet.brief_tag && (
                  <Badge variant="secondary" className="text-sm">
                    {poet.brief_tag}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {poet.birth_year && poet.death_year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {formatLifeSpan(poet.birth_year, poet.death_year)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{poet.dynasty}朝</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Biography Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>生平简介</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-foreground leading-relaxed">{poet.introduction || "暂无详细生平介绍。"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Poems Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>代表作品</span>
                  <Badge variant="outline">{poems?.length || 0}首</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {poems && poems.length > 0 ? (
                  <div className="grid gap-4">
                    {poems.map((poem) => (
                      <Link key={poem.id} href={`/poem/${poem.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                                {poem.title}
                              </h3>
                              {poem.writing_year && (
                                <Badge variant="outline" className="text-xs">
                                  {poem.writing_year}年
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">
                              {poem.dynasty} · {poet.name}
                            </div>
                            <div className="text-sm text-foreground leading-relaxed">
                              {poem.content.split("\n").slice(0, 2).join("\n")}
                              {poem.content.split("\n").length > 2 && "..."}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>暂无收录的作品</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">姓名</div>
                    <div className="text-foreground">{poet.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">朝代</div>
                    <div className="text-foreground">{poet.dynasty}</div>
                  </div>
                  {poet.birth_year && poet.death_year && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">生卒年</div>
                      <div className="text-foreground">
                        {poet.birth_year > 0 ? poet.birth_year : Math.abs(poet.birth_year) + "前"}年 - {poet.death_year}
                        年
                      </div>
                    </div>
                  )}
                  {poet.brief_tag && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">称号</div>
                      <div className="text-foreground">{poet.brief_tag}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Related Poets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">同朝代诗人</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedPoets && relatedPoets.length > 0 ? (
                    <div className="space-y-3">
                      {relatedPoets.map((relatedPoet) => (
                        <Link key={relatedPoet.id} href={`/poet/${relatedPoet.id}`}>
                          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <img
                              src={relatedPoet.portrait_url || "/placeholder.svg?height=32&width=32"}
                              alt={relatedPoet.name}
                              className="w-8 h-8 rounded-full object-cover border border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground">{relatedPoet.name}</div>
                              {relatedPoet.brief_tag && <div className="text-xs text-muted-foreground">{relatedPoet.brief_tag}</div>}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">暂无同朝代诗人</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: poet } = await supabase.from("poets").select("name, dynasty, brief_tag").eq("id", id).single()

  if (!poet) {
    return {
      title: "诗人未找到",
    }
  }

  return {
    title: `${poet.name} - ${poet.dynasty}${poet.brief_tag ? ` · ${poet.brief_tag}` : ""} | 中华诗词时间轴`,
    description: `了解${poet.dynasty}诗人${poet.name}的生平和代表作品`,
  }
}
