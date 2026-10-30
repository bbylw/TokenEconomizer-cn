import { Link } from '@tanstack/react-router'
import { docPages } from '../data/content'

export type TocItem = {
  id: string
  label: string
}

export function pageHead(pageTitle: string, description: string) {
  const fullTitle = `${pageTitle} · TokenEconomizer 中文站`
  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:image', content: '/og-card.svg' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: '/og-card.svg' },
    ],
  }
}

export function DocHeader({
  title,
  lead,
  toc,
}: {
  title: string
  lead: string
  toc?: TocItem[]
}) {
  const isOverview = title === '文档'
  return (
    <>
      <nav className="doc-crumb" aria-label="面包屑导航">
        <Link to="/">首页</Link>
        <span aria-hidden="true">/</span>
        {isOverview ? (
          <span style={{ color: 'var(--muted)' }} aria-current="page">
            文档
          </span>
        ) : (
          <>
            <Link to="/docs">文档</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--muted)' }} aria-current="page">
              {title}
            </span>
          </>
        )}
      </nav>
      <h1 className="doc-title">{title}</h1>
      <p className="doc-lead">{lead}</p>
      {toc && toc.length > 0 ? (
        <nav className="doc-toc" aria-label="本页目录">
          <span className="doc-toc-label">本页小节</span>
          <div className="doc-toc-links">
            {toc.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="doc-toc-chip">
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </>
  )
}

export function DocPager({ current }: { current: string }) {
  const index = docPages.findIndex((p) => p.path === current)
  const prev = index > 0 ? docPages[index - 1] : undefined
  const next = index >= 0 && index < docPages.length - 1 ? docPages[index + 1] : undefined

  if (!prev && !next) return null

  return (
    <nav className="doc-pager" aria-label="上下页导航">
      {prev ? (
        <Link className="pager-item" to={prev.path}>
          <span>← 上一节</span>
          <b>{prev.path === '/docs' ? '文档总览' : prev.title}</b>
        </Link>
      ) : null}
      {next ? (
        <Link className="pager-item next" to={next.path}>
          <span>下一节 →</span>
          <b>{next.title}</b>
        </Link>
      ) : null}
    </nav>
  )
}
