import { createClient } from "@/lib/supabase/server"
import { Timeline } from "@/components/timeline"
import { PoetList } from "@/components/poet-list"
import { SearchBar } from "@/components/search-bar"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: poets } = await supabase.from("poets").select("*").order("birth_year", { ascending: true })

  const { data: dynasties } = await supabase.from("dynasties").select("*").order("start_year", { ascending: true })

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-foreground mb-2">中华诗词时间轴</h1>
            <p className="text-lg text-muted-foreground">穿越千年，品味诗词之美</p>
          </div>
          <div className="max-w-md mx-auto">
            <SearchBar />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <PoetList poets={poets || []} dynasties={dynasties || []} />
            </div>
          </aside>

          <section className="lg:col-span-3">
            <Timeline poets={poets || []} dynasties={dynasties || []} />
          </section>
        </div>
      </div>
    </main>
  )
}
