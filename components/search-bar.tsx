"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface SearchResult {
  type: "poet" | "poem"
  id: number
  title: string
  subtitle: string
  dynasty: string
  brief_tag?: string
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      const supabase = createClient()

      try {
        // Search poets
        const { data: poets } = await supabase
          .from("poets")
          .select("id, name, dynasty, brief_tag")
          .or(`name.ilike.%${query}%,dynasty.ilike.%${query}%,brief_tag.ilike.%${query}%`)
          .limit(5)

        // Search poems
        const { data: poems } = await supabase
          .from("poems")
          .select("id, title, dynasty, poets(name)")
          .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(5)

        const searchResults: SearchResult[] = []

        // Add poet results
        if (poets) {
          searchResults.push(
            ...poets.map((poet) => ({
              type: "poet" as const,
              id: poet.id,
              title: poet.name,
              subtitle: poet.brief_tag || "诗人",
              dynasty: poet.dynasty,
              brief_tag: poet.brief_tag,
            })),
          )
        }

        // Add poem results
        if (poems) {
          searchResults.push(
            ...poems.map((poem) => ({
              type: "poem" as const,
              id: poem.id,
              title: poem.title,
              subtitle: poem.poets?.name || "未知作者",
              dynasty: poem.dynasty,
            })),
          )
        }

        setResults(searchResults)
        setShowResults(true)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="搜索诗人或诗词..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">搜索中...</div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.type === "poet" ? `/poet/${result.id}` : `/poem/${result.id}`}
                    onClick={() => setShowResults(false)}
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.dynasty}
                        </Badge>
                        <Badge variant={result.type === "poet" ? "default" : "secondary"} className="text-xs">
                          {result.type === "poet" ? "诗人" : "诗词"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">未找到相关结果</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
