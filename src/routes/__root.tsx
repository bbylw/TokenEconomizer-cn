import type { ReactNode } from 'react'
import { Link, Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { SiteHeader } from '../components/SiteHeader'
import { SiteFooter } from '../components/SiteFooter'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import '../styles/app.css'

const title = 'TokenEconomizer 中文站：在同一座仓库里，不必从头学两遍'
const description =
  'TokenEconomizer 是面向 Claude Code、Codex、GitHub Copilot CLI 与 Pi 的插件，从已跑过的会话中学习，削减重复支付的三类浪费。SWE-Bench 实测平均成本降低 18.4–30.9%。'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: description },
      { name: 'theme-color', content: '#080b0a' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'zh_CN' },
      { property: 'og:image', content: '/og-card.svg' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: '/og-card.svg' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <div className="wrap">
          <SiteFooter />
          <div className="bottom">
            <span>本站为 TokenEconomizer 论文与仓库的中文导览 · Apache-2.0</span>
            <span>加州大学伯克利分校 · 微软研究院</span>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main className="wrap" id="main-content" tabIndex={-1} style={{ paddingTop: 8 }}>
      <div className="frame" style={{ padding: '56px 40px' }}>
        <h1 className="doc-title">404 · 页面不存在</h1>
        <p className="doc-lead" style={{ borderBottom: 0, marginBottom: 24 }}>
          这个地址没有对应的页面。你可以返回首页，或从文档总览开始浏览。
        </p>
        <div className="cta-row" style={{ marginBottom: 0 }}>
          <Link className="btn btn-solid" to="/docs">
            打开文档总览
          </Link>
          <Link className="btn btn-line" to="/">
            返回首页
          </Link>
        </div>
      </div>
    </main>
  )
}
