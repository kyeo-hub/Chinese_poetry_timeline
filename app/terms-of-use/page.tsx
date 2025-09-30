import Link from "next/link"

export default function TermsOfUsePage() {
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
              <h1 className="text-3xl font-bold mb-2">使用条款</h1>
              <p className="text-muted-foreground">最后更新日期：{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </header>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">接受条款</h2>
              <p className="mb-4">
                欢迎使用中华诗词时间轴网站（以下简称"本网站"）。通过访问或使用本网站，您同意遵守以下使用条款。
                如果您不同意这些条款，请不要使用本网站。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">内容所有权</h2>
              <p className="mb-4">
                本网站包含的诗词内容、图像、设计、文本和其他材料受到版权法和知识产权法的保护。
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  诗词作品的版权归属原作者所有，我们仅提供展示和学习用途
                </li>
                <li>
                  本网站的设计、布局、标志和原创内容版权归本网站所有
                </li>
                <li>
                  数据来源于公开资源，如 chinese-poetry 项目、维基百科等
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">使用许可</h2>
              <p className="mb-4">
                在遵守这些条款的前提下，我们授予您有限的、非独占的、不可转让的许可，以：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>个人学习和研究目的访问网站内容</li>
                <li>非商业性分享网站链接</li>
                <li>在适当署名的情况下引用诗词内容</li>
              </ul>
              <p className="mb-4">
                您不得：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>复制、修改、分发网站内容用于商业目的</li>
                <li>逆向工程、反编译或尝试获取网站源代码</li>
                <li>使用自动化工具大量抓取网站内容</li>
                <li>干扰或破坏网站的正常运行</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">用户行为规范</h2>
              <p className="mb-4">
                您在使用本网站时，同意不进行以下行为：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>发布违法、有害、虚假或侵犯他人权益的内容</li>
                <li>干扰其他用户正常使用网站</li>
                <li>尝试绕过网站的安全措施</li>
                <li>使用网站从事任何非法活动</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">免责声明</h2>
              <p className="mb-4">
                本网站按"现状"提供，不提供任何形式的明示或暗示保证，包括但不限于：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>内容的准确性、完整性或时效性</li>
                <li>网站功能的连续性或无错误</li>
                <li>对特定用途的适用性</li>
              </ul>
              <p className="mb-4">
                我们不对因使用或无法使用本网站而导致的任何直接、间接、附带或后果性损害承担责任。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">链接到第三方网站</h2>
              <p className="mb-4">
                本网站可能包含指向第三方网站的链接，仅为方便用户而提供。
                我们不对这些外部网站的内容或隐私实践负责，您访问这些网站的风险自负。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">修改和终止</h2>
              <p className="mb-4">
                我们保留随时修改、暂停或终止本网站或任何部分的权利，恕不另行通知。
                我们也可能随时修改这些使用条款。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">适用法律</h2>
              <p className="mb-4">
                这些条款受中华人民共和国法律管辖，不考虑法律冲突原则。
                因这些条款或使用本网站而产生的任何争议应提交至有管辖权的法院解决。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
              <p className="mb-4">
                如果您对这些使用条款有任何疑问，请通过以下方式联系我们：
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