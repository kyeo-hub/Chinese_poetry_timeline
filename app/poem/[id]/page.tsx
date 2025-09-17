import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PoemDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch poem details with poet information
  const { data: poem, error: poemError } = await supabase
    .from("poems")
    .select(
      `
      *,
      poets (
        id,
        name,
        dynasty,
        brief_tag,
        portrait_url
      )
    `,
    )
    .eq("id", id)
    .single()

  if (poemError || !poem) {
    notFound()
  }

  // Fetch other poems by the same poet
  const { data: otherPoems } = await supabase
    .from("poems")
    .select("id, title, writing_year")
    .eq("poet_id", poem.poet_id)
    .neq("id", id)
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
            <Link href={`/poet/${poem.poets.id}`}>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                诗人详情
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{poem.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <Badge variant="default" className="text-sm">
                {poem.dynasty}
              </Badge>
              {poem.writing_year && (
                <Badge variant="secondary" className="text-sm">
                  {poem.writing_year}年
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <img
                src={poem.poets.portrait_url || "/placeholder.svg?height=32&width=32"}
                alt={poem.poets.name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <span className="text-lg">{poem.poets.name}</span>
              {poem.poets.brief_tag && (
                <Badge variant="outline" className="text-xs">
                  {poem.poets.brief_tag}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Original Text */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>原文</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 rounded-lg p-6">
                  <div className="text-lg leading-loose text-foreground font-medium text-center">
                    {poem.content.split("\n").map((line, index) => (
                      <div key={index} className="mb-2">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Translation */}
            {poem.translation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>白话翻译</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed">{poem.translation}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Background */}
            {poem.background && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>创作背景</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed">{poem.background}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Appreciation */}
            {poem.appreciation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>赏析解读</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-foreground leading-relaxed">{poem.appreciation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Poem Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">作品信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">作品名</div>
                    <div className="text-foreground">{poem.title}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">作者</div>
                    <Link href={`/poet/${poem.poets.id}`}>
                      <div className="text-foreground hover:text-primary transition-colors cursor-pointer">
                        {poem.poets.name}
                      </div>
                    </Link>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">朝代</div>
                    <div className="text-foreground">{poem.dynasty}</div>
                  </div>
                  {poem.writing_year && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">创作年份</div>
                      <div className="text-foreground">{poem.writing_year}年</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Author's Other Works */}
              {otherPoems && otherPoems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">作者其他作品</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {otherPoems.map((otherPoem) => (
                        <Link key={otherPoem.id} href={`/poem/${otherPoem.id}`}>
                          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{otherPoem.title}</div>
                              {otherPoem.writing_year && (
                                <div className="text-xs text-muted-foreground">{otherPoem.writing_year}年</div>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Link href={`/poet/${poem.poets.id}`}>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          查看全部作品
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">快速导航</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/">
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      返回时间轴
                    </Button>
                  </Link>
                  <Link href={`/poet/${poem.poets.id}`}>
                    <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      诗人详情
                    </Button>
                  </Link>
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

  const { data: poem } = await supabase
    .from("poems")
    .select(
      `
      title,
      dynasty,
      writing_year,
      poets (name)
    `,
    )
    .eq("id", id)
    .single()

  if (!poem) {
    return {
      title: "诗词未找到",
    }
  }

  return {
    title: `${poem.title} - ${poem.poets.name} · ${poem.dynasty} | 中华诗词时间轴`,
    description: `${poem.dynasty}诗人${poem.poets.name}的经典作品《${poem.title}》${poem.writing_year ? `，创作于${poem.writing_year}年` : ""}`,
  }
}
