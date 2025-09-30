"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, MapPin } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "邮箱联系",
      description: "通过电子邮件与我们联系",
       content: "kyeo@kky.ac.cn",
      action: "发送邮件",
      link: "mailto:kyeo@kky.ac.cn"
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: "GitHub 项目",
      description: "查看源代码和项目进展",
      content: "github.com/kyeo-hub/Chinese_poetry_timeline",
      action: "访问项目",
      link: "https://github.com/kyeo-hub/Chinese_poetry_timeline"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "微信公众号",
      description: "关注我们的微信公众号",
      content: "中华诗词时间轴",
      action: "了解更多",
      link: "#"
    }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 显示正在发送的提示
    const toastId = toast.loading("正在发送您的消息...");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("消息已成功发送！", {
          id: toastId,
          description: "感谢您的反馈，我们会尽快回复您。"
        });
        // 重置表单
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        toast.error("发送失败", {
          id: toastId,
          description: result.message
        });
      }
    } catch (error) {
      toast.error("发送失败", {
        id: toastId,
        description: "发送消息时出现错误，请稍后再试。"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="text-3xl font-bold mb-4">联系我们</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              如果您有任何问题、建议或合作意向，欢迎通过以下方式与我们联系。
              我们会尽快回复您的消息。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 font-medium">{item.content}</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href={item.link}>{item.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>反馈与建议</CardTitle>
              <CardDescription>
                您的意见对我们非常重要，帮助我们不断改进网站体验
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="您的姓名"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="您的邮箱"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    主题
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="反馈主题"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    消息内容
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    placeholder="请详细描述您的问题或建议..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "提交中..." : "提交反馈"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}