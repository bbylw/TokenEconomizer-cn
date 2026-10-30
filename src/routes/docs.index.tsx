import { Link, createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager } from '../components/DocParts'
import { docPages } from '../data/content'

export const Route = createFileRoute('/docs/')({
  component: DocsIndex,
})

const cards = docPages.filter((p) => p.path !== '/docs')

function DocsIndex() {
  return (
    <>
      <DocHeader
        title="文档"
        lead="TokenEconomizer 是 Claude Code、Codex、GitHub Copilot CLI 与 Pi 的插件，并对 opencode 提供实验性支持。下面按主题分成六节，从安装到每项设置的默认值。"
      />

      <div className="prose">
        <p>
          插件会用一行字播报每一次动作；如果其中任何环节失败，你的会话会照常继续，就像没装这个插件一样。它的模型调用（提出事实的模型，以及写出重定向的裁判模型）经由你自己的智能体运行，使用同一个套餐或登录身份，其成本也被计入它的报告。它学到的东西留在你的机器上，位于{' '}
          <code>~/.tokeneconomizer</code>。
        </p>
      </div>

      <div className="doc-grid">
        {cards.map((c) => (
          <Link key={c.path} className="doc-card" to={c.path}>
            <span>{c.group}</span>
            <b>{c.title}</b>
            <p>{c.desc}</p>
          </Link>
        ))}
      </div>

      <div className="callout cool" style={{ marginTop: 20 }}>
        <b>第一次读。</b> 先按「快速开始」装好并在仓库里跑一次 status；之后基本只需要「日常命令」里的四个命令。想改默认行为时再翻「设置」。
      </div>

      <DocPager current="/docs" />
    </>
  )
}
