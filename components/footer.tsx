"use client"

import { useState, useEffect } from "react"
import { Github, Mail, ExternalLink, MapPin, Link as LinkIcon, Eye } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [visitorCount, setVisitorCount] = useState<number | null>(null)
  


  useEffect(() => {
    // 使用我们自定义的Supabase计数器
    const fetchViewCount = async () => {
      try {
        const response = await fetch('/api/analytics?type=site', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setViewCount(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch view count:", error)
      }
    }

    fetchViewCount()

    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/analytics?type=unique', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setVisitorCount(data.count)
        }
      } catch (error) {
        console.error("Failed to fetch view count:", error)
      }
    }

    fetchVisitorCount()
    
    // 记录页面访问
    const recordView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error("Failed to record view:", error)
      }
    }

    recordView()
  }, [])

  const currentYear = new Date().getFullYear()

  // 数据来源列表
  const dataSources = [
    { name: "Chinese-Poetry", url: "https://github.com/chinese-poetry/chinese-poetry" },
    { name: "维基百科", url: "https://zh.wikipedia.org" },
    { name: "百度百科", url: "https://baike.baidu.com" },
    { name: "搜狗百科", url: "https://baike.sogou.com" },
    { name: "古诗文网", url: "https://www.gushiwen.cn" },
    { name: "中国哲学书电子化计划", url: "https://ctext.org" },
    { name: "全唐诗", url: "#" },
    { name: "旧唐书", url: "#" },
    { name: "新唐书", url: "#" },
    { name: "唐才子传", url: "#" },
  ]

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 网站信息和访问量统计 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">中华诗词时间轴</h3>
            <p className="text-muted-foreground mb-4">
              探索中国古典诗词的魅力，感受千年文化底蕴
            </p>
            {viewCount !== null && visitorCount !== null &&(
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="w-4 h-4 mr-2" />
                <span>{visitorCount.toLocaleString()} 人访问 {viewCount.toLocaleString()} 次</span>
              </div>
            )}

            {/* 备案信息 */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                备案号: 京ICP备00000000号-1
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                京公网安备00000000000000号
              </p>
            </div>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:kyeooeyk@gmail.com"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  kyeooeyk@gmail.com
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub 项目
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  微信公众号
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>

            {/* 法律链接 */}
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">法律声明</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    <LinkIcon className="w-3 h-3 mr-2" />
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-use"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    <LinkIcon className="w-3 h-3 mr-2" />
                    使用条款
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                  >
                    <LinkIcon className="w-3 h-3 mr-2" />
                    网站地图
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 数据来源 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">数据来源</h3>
            <ul className="space-y-2">
              {dataSources.map((source, index) => (
                <li key={index}>
                  <Link
                    href={source.url}
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start"
                  >
                    <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{source.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 友情链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">友情链接</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://www.gushiwen.org/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start"
                >
                  <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                  古诗文网
                </Link>
              </li>
              <li>
                <Link
                  href="https://poetry.taiwan.gov.tw/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start"
                >
                  <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                  中华诗词网
                </Link>
              </li>
              <li>
                <Link
                  href="http://www.shici.net/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start"
                >
                  <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                  诗词名句网
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.shicimingju.com/"
                  target="_blank"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start"
                >
                  <ExternalLink className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                  诗词名句网
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-border/50 mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} 中华诗词时间轴. 保留所有权利.</p>
          <p className="mt-1">此项目基于 v0 生成并在 Vercel 上部署</p>
        </div>
      </div>
    </footer>
  )
}