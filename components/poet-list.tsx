"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { formatLifeSpan } from "@/lib/utils"

interface Poet {
  id: number
  name: string
  birth_year: number | null
  death_year: number | null
  dynasty: string
  portrait_url: string | null
  introduction: string | null
  brief_tag: string | null
}

interface Dynasty {
  id: number
  name: string
  start_year: number | null
  end_year: number | null
  description: string | null
}

interface PoetListProps {
  poets: Poet[]
  dynasties: Dynasty[]
}

export function PoetList({ poets, dynasties }: PoetListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedDynasty, setExpandedDynasty] = useState<string | null>(null)

  const filteredPoets = poets.filter(
    (poet) =>
      poet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poet.dynasty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (poet.brief_tag && poet.brief_tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const poetsByDynasty = dynasties.reduce(
    (acc, dynasty) => {
      acc[dynasty.name] = filteredPoets.filter((poet) => poet.dynasty === dynasty.name)
      return acc
    },
    {} as Record<string, Poet[]>,
  )

  const toggleDynasty = (dynastyName: string) => {
    setExpandedDynasty(expandedDynasty === dynastyName ? null : dynastyName)
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">诗人列表</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索诗人或朝代..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          {/* 朝代横向排列 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {dynasties.map((dynasty) => {
              const dynastyPoets = poetsByDynasty[dynasty.name] || []
              if (dynastyPoets.length === 0) return null

              return (
                <div 
                  key={dynasty.id}
                  className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 px-3 py-2 rounded-lg transition-colors"
                  onClick={() => toggleDynasty(dynasty.name)}
                >
                  {expandedDynasty === dynasty.name ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge variant="default" className="text-xs">
                    {dynasty.name}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-1">({dynastyPoets.length})</span>
                </div>
              )
            })}
          </div>
          
          {/* 展开的朝代诗人列表 */}
          <div className="space-y-4">
            {dynasties.map((dynasty) => {
              const dynastyPoets = poetsByDynasty[dynasty.name] || []
              if (dynastyPoets.length === 0 || expandedDynasty !== dynasty.name) return null

              return (
                <div key={`poets-${dynasty.id}`} className="space-y-2">
                  <h3 className="font-medium text-foreground flex items-center gap-2">
                    <Badge variant="secondary">{dynasty.name}</Badge>
                    <span className="text-sm text-muted-foreground">{dynastyPoets.length}位诗人</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dynastyPoets.map((poet) => (
                      <Link key={poet.id} href={`/poet/${poet.id}`}>
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                          <img
                            src={poet.portrait_url || "/placeholder.svg?height=40&width=40"}
                            alt={poet.name}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground">{poet.name}</div>
                            {poet.brief_tag && <div className="text-xs text-muted-foreground">{poet.brief_tag}</div>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}