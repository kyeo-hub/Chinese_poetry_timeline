import Link from "next/link"

export default function PrivacyPolicyPage() {
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
          
          <article className="prose prose-gray max-w-none dark:prose-invert">
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-2">隐私政策</h1>
              <p className="text-muted-foreground">最后更新日期：{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">信息收集</h2>
              <p className="mb-4">
                我们非常重视您的隐私。本隐私政策说明了我们在您使用中华诗词时间轴网站（以下简称"本网站"）时如何收集、使用、存储和保护您的个人信息。
              </p>
              <p className="mb-4">
                本网站为展示型网站，我们不会主动收集您的个人身份信息。我们可能收集的信息包括：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>浏览器类型和版本</li>
                <li>操作系统</li>
                <li>访问时间</li>
                <li>访问页面</li>
                <li>IP地址（仅用于统计分析）</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cookie和追踪技术</h2>
              <p className="mb-4">
                为了提升您的浏览体验，我们可能使用Cookie和类似技术来：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>记住您的偏好设置</li>
                <li>分析网站流量和使用情况</li>
                <li>改善网站性能</li>
              </ul>
              <p className="mb-4">
                您可以通过浏览器设置拒绝或管理Cookie，但这可能影响网站的部分功能。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">信息使用</h2>
              <p className="mb-4">
                我们收集的信息仅用于以下目的：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>改进网站内容和服务</li>
                <li>分析用户行为和偏好</li>
                <li>监控网站性能</li>
                <li>防范安全威胁</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">信息共享</h2>
              <p className="mb-4">
                我们不会将您的个人信息出售、交易或转让给第三方，除非在以下情况下：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>获得您的明确同意</li>
                <li>法律要求或为保护我们的合法权益</li>
                <li>为提供您要求的服务而与合作伙伴共享必要信息</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">数据安全</h2>
              <p className="mb-4">
                我们采取适当的技术和组织措施保护您的信息安全，防止未经授权的访问、使用或泄露。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">您的权利</h2>
              <p className="mb-4">
                您有权：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>访问我们持有的关于您的个人信息</li>
                <li>要求更正不准确的信息</li>
                <li>要求删除您的个人信息</li>
                <li>撤回您对数据处理的同意</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">儿童隐私</h2>
              <p className="mb-4">
                本网站不面向14岁以下儿童，我们不会故意收集儿童的个人信息。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">政策变更</h2>
              <p className="mb-4">
                我们可能不时更新本隐私政策。任何更改将在本页面发布，并在生效日期更新。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
              <p className="mb-4">
                如果您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
              </p>
              <p className="mb-4">
                邮箱：<Link href="mailto:kyeooeyk@gmail.com" className="text-primary hover:underline">kyeooeyk@gmail.com</Link>
              </p>
            </section>
          </article>
        </div>
      </div>
    </div>
  )
}