import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DynastyPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch dynasty details
  const { data: dynasty, error: dynastyError } = await supabase
    .from("dynasties")
    .select("*")
    .eq("id", id)
    .single()

  if (dynastyError || !dynasty) {
    notFound()
  }

  // Fetch poets from this dynasty
  const { data: poets } = await supabase
    .from("poets")
    .select("id, name, brief_tag, portrait_url")
    .eq("dynasty", dynasty.name)
    .order("birth_year", { ascending: true })

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
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{dynasty.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {dynasty.start_year}年 - {dynasty.end_year}年
                  </span>
                </div>
              </div>
              {dynasty.description && (
                <p className="mt-4 text-muted-foreground">
                  {dynasty.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>代表诗人</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {poets && poets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {poets.map((poet) => (
                    <Link 
                      key={poet.id} 
                      href={`/poet/${poet.id}`}
                      className="block group"
                    >
                      <Card className="group-hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                <Image
                                  src={poet.portrait_url || "/placeholder.svg?height=48&width=48"}
                                  alt={poet.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {poet.name}
                              </h3>
                              {poet.brief_tag && (
                                <p className="text-sm text-muted-foreground">
                                  {poet.brief_tag}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">暂无诗人信息</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}