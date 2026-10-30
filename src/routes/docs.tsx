import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { docPages } from '../data/content'

export const Route = createFileRoute('/docs')({
  component: DocsLayout,
})

const groups = [
  { label: '总览', key: '' },
  { label: '使用', key: '使用' },
  { label: '深入与参考', key: '深入与参考' },
]

function DocsLayout() {
  return (
    <main className="wrap" id="main-content" tabIndex={-1}>
      <div className="doc-shell">
        <aside className="doc-side" aria-label="文档章节导航">
          {groups.map((g) => (
            <div key={g.label} className="doc-group">
              <h6>{g.label}</h6>
              {docPages
                .filter((p) => p.group === g.key)
                .map((p) => (
                  <Link
                    key={p.path}
                    to={p.path}
                    className="doc-link"
                    activeProps={{ className: 'doc-link active' }}
                    activeOptions={{ exact: true }}
                  >
                    {p.path === '/docs' ? '文档总览' : p.title}
                  </Link>
                ))}
            </div>
          ))}
        </aside>
        <article className="doc-main">
          <Outlet />
        </article>
      </div>
    </main>
  )
}
