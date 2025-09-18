"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
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

interface TimelineProps {
  poets: Poet[]
  dynasties: Dynasty[]
}


interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Timeline({ poets, dynasties }: TimelineProps) {
  const [selectedDynasty, setSelectedDynasty] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPoetIndex, setCurrentPoetIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const poetCardsRef = useRef<HTMLDivElement>(null)
  const [activeDynasty, setActiveDynasty] = useState<string | null>(null)

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

  // 按朝代分组诗人
  const groupedPoets = dynasties.map(dynasty => ({
    ...dynasty,
    poets: filteredPoets.filter(poet => poet.dynasty === dynasty.name)
  })).filter(group => group.poets.length > 0)

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
    // 更新当前朝代
    if (filteredPoets.length > 0 && currentPoetIndex < filteredPoets.length) {
      setActiveDynasty(filteredPoets[currentPoetIndex].dynasty)
    }
  }, [currentPoetIndex, filteredPoets])

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
  
  // 获取实际数据的时间范围
  const getDataTimeRange = () => {
    const startYears = dynasties.map(d => d.start_year).filter((y): y is number => y !== null)
    const endYears = dynasties.map(d => d.end_year).filter((y): y is number => y !== null)
    
    if (startYears.length === 0 || endYears.length === 0) {
      return { min: -800, max: 1200 }
    }
    
    return {
      min: Math.min(...startYears),
      max: Math.max(...endYears)
    }
  }

  // 根据实际数据范围计算位置
  const getAdjustedTimelinePosition = (year: number | null) => {
    if (!year) return 0
    
    const { min: dataMin, max: dataMax } = getDataTimeRange()
    const dataRange = dataMax - dataMin
    
    // 避免除零错误
    if (dataRange === 0) return 0
    
    return ((year - dataMin) / dataRange) * 100
  }

  const goToPreviousPoet = () => {
    setCurrentPoetIndex((prev) => (prev > 0 ? prev - 1 : filteredPoets.length - 1))
  }

  const goToNextPoet = () => {
    setCurrentPoetIndex((prev) => (prev < filteredPoets.length - 1 ? prev + 1 : 0))
  }

  // 跳转到指定朝代
  const jumpToDynasty = (dynastyName: string) => {
    setSelectedDynasty(dynastyName)
    // 找到该朝代的第一个诗人并跳转到它
    const firstPoetIndex = filteredPoets.findIndex(poet => poet.dynasty === dynastyName)
    if (firstPoetIndex !== -1) {
      setCurrentPoetIndex(firstPoetIndex)
    }
  }

  // 滚动到指定诗人
  useEffect(() => {
    if (poetCardsRef.current && filteredPoets.length > 0 && currentPoetIndex < filteredPoets.length) {
      const cardWidth = 320 // 估算每张卡片的宽度
      const scrollPosition = currentPoetIndex * cardWidth - (poetCardsRef.current.clientWidth / 2) + (cardWidth / 2)
      poetCardsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [currentPoetIndex, filteredPoets])

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
              onClick={() => jumpToDynasty(dynasty.name)}
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

      {/* 诗人卡片横向滚动区域 */}
      <div className="relative">
        {filteredPoets.length > 0 ? (
          <div 
            ref={poetCardsRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredPoets.map((poet, index) => (
              <div key={poet.id} className="snap-start flex-shrink-0">
                <Card
                  className={`poet-card hover:shadow-lg transition-all duration-300 w-72 ${
                    index === currentPoetIndex ? "ring-2 ring-primary shadow-lg" : ""
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
                              {formatLifeSpan(poet.birth_year, poet.death_year)}
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
              </div>
            ))}
          </div>
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

      {/* Dynasty markers */}
      <div className="relative mt-12 h-20 w-full">
        {dynasties.map((dynasty) => {
          const startPos = getAdjustedTimelinePosition(dynasty.start_year)
          const endPos = getAdjustedTimelinePosition(dynasty.end_year)
          const width = endPos - startPos

          return (
            <TooltipProvider key={dynasty.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute top-0 transform -translate-y-1/2 cursor-pointer ${
                      activeDynasty === dynasty.name ? "font-bold" : ""
                    }`}
                    style={{ left: `${startPos}%`, width: `${width}%` }}
                    onClick={() => jumpToDynasty(dynasty.name)}
                  >
                    <div className={`h-1 rounded-full mb-2 ${
                      activeDynasty === dynasty.name 
                        ? "bg-primary" 
                        : "bg-muted-foreground"
                    }`}></div>
                    <div className={`text-xs text-center transition-colors whitespace-nowrap ${
                      activeDynasty === dynasty.name 
                        ? "text-foreground font-bold" 
                        : "text-muted-foreground"
                    }`}>
                      <div className="font-medium cursor-pointer">{dynasty.name}</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  align="center"
                  className="bg-background border border-amber-800 rounded-md shadow-lg p-3 text-sm transition-opacity duration-300 ease-in-out"
                  style={{
                    maxWidth: '250px',
                    minWidth: '150px',
                    pointerEvents: 'none', // 防止tooltip干扰鼠标事件
                    backgroundColor: 'rgba(255, 255, 240, 0.95)', // 淡米黄色背景增加历史感
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    fontFamily: 'serif' // 使用衬线字体增加历史感
                  }}
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">{dynasty.name}</div>
                    {dynasty.start_year && dynasty.end_year && (
                      <div className="text-muted-foreground">
                        {formatLifeSpan(dynasty.start_year, dynasty.end_year)}
                      </div>
                    )}
                    {dynasty.description && (
                      <div className="text-muted-foreground text-xs mt-1 italic break-words whitespace-normal">
                        {dynasty.description}
                      </div>
                    )}
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-amber-800"></div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}



