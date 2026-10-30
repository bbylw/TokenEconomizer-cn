import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { REPO } from '../data/content'

type NavLink = {
  to: '/' | '/docs'
  hash?: 'mech' | 'principles' | 'results' | 'install' | 'faq'
  label: string
}

const links: NavLink[] = [
  { to: '/', hash: 'mech', label: '机制' },
  { to: '/', hash: 'principles', label: '原理' },
  { to: '/', hash: 'results', label: '结果' },
  { to: '/', hash: 'install', label: '快速开始' },
  { to: '/', hash: 'faq', label: '问答' },
  { to: '/docs', hash: undefined, label: '文档' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isDocs = pathname.startsWith('/docs')

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="topbar">
      <div className="wrap top-in">
        <Link to="/" className="brand" aria-label="TokenEconomizer 中文站首页">
          <b>TokenEconomizer</b>
          <span>经验驱动的黑盒成本控制</span>
        </Link>

        <nav className="nav" aria-label="主导航">
          {links.map((l) => {
            const active = l.to === '/docs' && isDocs
            return (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                className={active ? 'is-active' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="top-right">
          <a
            className="ghost arxiv"
            href="https://arxiv.org/abs/2610.22732"
            target="_blank"
            rel="noreferrer"
          >
            arXiv
          </a>
          <a className="ghost" href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? '关闭导航菜单' : '展开导航菜单'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '关闭' : '菜单'}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav-panel"
        aria-label="移动端导航"
        className={`mobile-nav ${open ? 'open' : ''}`}
      >
        <div className="wrap">
          {links.map((l, idx) => {
            const active = l.to === '/docs' && isDocs
            return (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                className={active ? 'is-active' : undefined}
                style={{ transitionDelay: open ? `${Math.min(idx * 45, 240)}ms` : '0ms' }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
