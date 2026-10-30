import { Link } from '@tanstack/react-router'
import { docPages } from '../data/content'

export function DocHeader({ title, lead }: { title: string; lead: string }) {
  const isOverview = title === '文档'
  return (
    <>
      <div className="doc-crumb">
        <Link to="/">首页</Link>
        <span>/</span>
        {isOverview ? (
          <span style={{ color: 'var(--muted)' }}>文档</span>
        ) : (
          <>
            <Link to="/docs">文档</Link>
            <span>/</span>
            <span style={{ color: 'var(--muted)' }}>{title}</span>
          </>
        )}
      </div>
      <h1 className="doc-title">{title}</h1>
      <p className="doc-lead">{lead}</p>
    </>
  )
}

export function DocPager({ current }: { current: string }) {
  const index = docPages.findIndex((p) => p.path === current)
  const prev = index > 0 ? docPages[index - 1] : undefined
  const next = index >= 0 && index < docPages.length - 1 ? docPages[index + 1] : undefined

  if (!prev && !next) return null

  return (
    <nav className="doc-pager" aria-label="上下页">
      {prev ? (
        <Link className="pager-item" to={prev.path}>
          <span>上一节</span>
          <b>{prev.path === '/docs' ? '文档总览' : prev.title}</b>
        </Link>
      ) : null}
      {next ? (
        <Link className="pager-item next" to={next.path}>
          <span>下一节</span>
          <b>{next.title}</b>
        </Link>
      ) : null}
    </nav>
  )
}
