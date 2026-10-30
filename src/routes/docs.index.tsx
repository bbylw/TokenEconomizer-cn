import { Link, createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { docPages } from '../data/content'

export const Route = createFileRoute('/docs/')({
  head: () =>
    pageHead(
      '文档总览',
      'TokenEconomizer 中文文档总览：涵盖五种编码智能体的安装、15 条日常命令、9 项核心设置与三档预设、架构拆解、真机验证细节与论文实验复现指南。',
    ),
  component: DocsIndex,
})

const cards = docPages.filter((p) => p.path !== '/docs')

function DocsIndex() {
  return (
    <>
      <DocHeader
        title="文档"
        lead="TokenEconomizer 是 Claude Code、Codex、GitHub Copilot CLI 与 Pi 的插件，并对 opencode 提供实验性支持。下面按「日常使用」与「深入参考」分成十节，涵盖从安装、调参到架构原理与论文复现的全部细节。"
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
        <b>第一次读。</b> 先按「快速开始」装好并在仓库里跑一次 <code>status</code>；之后日常基本只需要「日常命令」里的前几条。想了解底层钩子如何保护缓存、或者想在本地复现 SWE-Bench 实验，可进一步阅读「架构与接口设计」和「复现论文实验」。
      </div>

      <DocPager current="/docs" />
    </>
  )
}
