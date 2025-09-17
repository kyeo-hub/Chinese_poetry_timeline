"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

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

interface TimelineProps {
  poets: Poet[]
  dynasties: Dynasty[]
}

export function Timeline({ poets, dynasties }: TimelineProps) {
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPoetIndex, setCurrentPoetIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const poetCardsRef = useRef<HTMLDivElement>(null)

  const filteredPoets = poets.filter((poet) => {
    const matchesDynasty = selectedDynasty ? poet.dynasty === selectedDynasty : true
    const matchesSearch = searchTerm
      ? poet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poet.dynasty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (poet.brief_tag && poet.brief_tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (poet.introduction && poet.introduction.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    return matchesDynasty && matchesSearch
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (filteredPoets.length === 0) return

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault()
          setCurrentPoetIndex((prev) => (prev > 0 ? prev - 1 : filteredPoets.length - 1))
          break
        case "ArrowRight":
          event.preventDefault()
          setCurrentPoetIndex((prev) => (prev < filteredPoets.length - 1 ? prev + 1 : 0))
          break
        case "Enter":
          event.preventDefault()
          if (filteredPoets[currentPoetIndex]) {
            window.location.href = `/poet/${filteredPoets[currentPoetIndex].id}`
          }
          break
        case "Escape":
          event.preventDefault()
          setSearchTerm("")
          setSelectedDynasty(null)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredPoets, currentPoetIndex])

  useEffect(() => {
    setCurrentPoetIndex(0)
  }, [selectedDynasty, searchTerm])

  useEffect(() => {
    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const diffX = startX - endX
      const diffY = startY - endY

      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next poet
          setCurrentPoetIndex((prev) => (prev < filteredPoets.length - 1 ? prev + 1 : 0))
        } else {
          // Swipe right - previous poet
          setCurrentPoetIndex((prev) => (prev > 0 ? prev - 1 : filteredPoets.length - 1))
        }
      }

      startX = 0
      startY = 0
    }

    const timeline = timelineRef.current
    if (timeline) {
      timeline.addEventListener("touchstart", handleTouchStart)
      timeline.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      if (timeline) {
        timeline.removeEventListener("touchstart", handleTouchStart)
        timeline.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [filteredPoets.length])

  const getTimelinePosition = (year: number | null) => {
    if (!year) return 0
    const minYear = -800 // Approximate start of recorded Chinese poetry
    const maxYear = 1200 // End of classical period
    const range = maxYear - minYear
    return ((year - minYear) / range) * 100
  }

  const goToPreviousPoet = () => {
    setCurrentPoetIndex((prev) => (prev > 0 ? prev - 1 : filteredPoets.length - 1))
  }

  const goToNextPoet = () => {
    setCurrentPoetIndex((prev) => (prev < filteredPoets.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="space-y-8" ref={timelineRef}>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索诗人、朝代或标签..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDynasty === null ? "default" : "outline"}
            onClick={() => setSelectedDynasty(null)}
            className="text-sm"
          >
            全部朝代
          </Button>
          {dynasties.map((dynasty) => (
            <Button
              key={dynasty.id}
              variant={selectedDynasty === dynasty.name ? "default" : "outline"}
              onClick={() => setSelectedDynasty(dynasty.name)}
              className="text-sm"
            >
              {dynasty.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          找到 {filteredPoets.length} 位诗人
          {filteredPoets.length > 0 && ` (${currentPoetIndex + 1}/${filteredPoets.length})`}
        </div>
        {filteredPoets.length > 1 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousPoet}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextPoet}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground text-center">使用 ← → 键导航，Enter 键查看详情，Esc 键清除筛选</div>

      <div className="relative">
        {/* Timeline line */}
        <div className="timeline-line h-1 w-full mb-8"></div>

        {/* Dynasty markers */}
        <div className="relative mb-12">
          {dynasties.map((dynasty) => {
            const startPos = getTimelinePosition(dynasty.start_year)
            const endPos = getTimelinePosition(dynasty.end_year)
            const width = endPos - startPos

            return (
              <div
                key={dynasty.id}
                className="absolute top-0 transform -translate-y-1/2"
                style={{ left: `${startPos}%`, width: `${width}%` }}
              >
                <div className="dynasty-marker h-3 rounded-full mb-2"></div>
                <div className="text-xs text-center text-muted-foreground">
                  <div className="font-medium">{dynasty.name}</div>
                  <div>
                    {dynasty.start_year &&
                      dynasty.end_year &&
                      `${dynasty.start_year > 0 ? dynasty.start_year : Math.abs(dynasty.start_year) + "前"}年 - ${dynasty.end_year}年`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" ref={poetCardsRef}>
          {filteredPoets.length > 0 ? (
            filteredPoets.map((poet, index) => (
              <Card
                key={poet.id}
                className={`poet-card hover:shadow-lg transition-all duration-300 ${
                  index === currentPoetIndex ? "ring-2 ring-primary shadow-lg scale-105" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={poet.portrait_url || "/placeholder.svg?height=80&width=80"}
                        alt={poet.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{poet.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {poet.dynasty}
                        </Badge>
                        {poet.brief_tag && (
                          <Badge variant="outline" className="text-xs">
                            {poet.brief_tag}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {poet.birth_year && poet.death_year && (
                          <span>
                            {poet.birth_year > 0 ? poet.birth_year : Math.abs(poet.birth_year) + "前"}年 -{" "}
                            {poet.death_year}年
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{poet.introduction}</p>
                      <Link href={`/poet/${poet.id}`}>
                        <Button size="sm" className="w-full">
                          了解更多
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>未找到匹配的诗人</p>
                <p className="text-sm">请尝试调整搜索条件</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedDynasty(null)
                }}
              >
                清除筛选条件
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
