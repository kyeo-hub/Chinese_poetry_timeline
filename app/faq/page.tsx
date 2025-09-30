import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      question: "网站的内容来源是什么？",
      answer: "我们的内容主要来源于公开的诗词数据库，包括 chinese-poetry 项目、维基百科、古诗文网等。部分AI生成内容经过人工审核以确保准确性。"
    },
    {
      question: "我可以使用网站上的内容吗？",
      answer: "网站内容仅供个人学习和研究使用。如需商业用途，请联系版权所有者。详细信息请查看我们的使用条款页面。"
    },
    {
      question: "如何提交错误报告或建议？",
      answer: "您可以通过联系我们页面的反馈表单，或直接发送邮件至 kyeooeyk@gmail.com 来提交您的意见和建议。"
    },
    {
      question: "网站支持哪些设备和浏览器？",
      answer: "我们的网站支持所有现代浏览器，包括 Chrome、Firefox、Safari 和 Edge 的最新版本。网站也完全响应式，支持手机和平板设备访问。"
    },
    {
      question: "为什么有些诗人的信息不完整？",
      answer: "我们正在持续完善数据库中的信息。部分诗人由于历史资料有限，信息可能不够完整。我们使用AI技术生成部分内容，并逐步补充完善。"
    },
    {
      question: "如何搜索特定的诗词或诗人？",
      answer: "您可以在首页的搜索框中输入关键词（诗词标题、诗人姓名等）进行搜索。搜索结果会显示匹配的诗词和诗人。"
    },
    {
      question: "网站的数据更新频率是怎样的？",
      answer: "我们定期更新网站内容，添加新的诗词和诗人信息。重大更新会通过社交媒体渠道发布通知。"
    },
    {
      question: "我如何支持这个项目？",
      answer: "您可以通过分享网站给更多人、提供反馈意见或在GitHub上贡献代码来支持我们。我们也欢迎内容方面的专家协助审核和补充诗词信息。"
    }
  ]

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
          
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">常见问题</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              在这里您可以找到关于中华诗词时间轴网站的常见问题和解答。
              如果您还有其他问题，请随时联系我们。
            </p>
          </div>

          <div className="space-y-6 mb-12">
            {faqs.map((faq, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-start">
                    <span className="mr-2 text-primary">Q:</span>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    <span className="font-medium mr-2">A:</span>
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>还有其他问题？</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <p className="flex-1 text-muted-foreground">
                  如果您在上方没有找到答案，请通过以下方式联系我们获取帮助。
                </p>
                <Button asChild>
                  <Link href="/contact">
                    联系我们
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}