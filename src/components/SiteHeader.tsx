import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { REPO } from '../data/content'

type NavLink = {
  to: '/' | '/docs'
  hash?: 'mech' | 'principles' | 'results' | 'install'
  label: string
}

const links: NavLink[] = [
  { to: '/', hash: 'mech', label: '机制' },
  { to: '/', hash: 'principles', label: '原理' },
  { to: '/', hash: 'results', label: '结果' },
  { to: '/', hash: 'install', label: '快速开始' },
  { to: '/docs', hash: undefined, label: '文档' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="topbar">
      <div className="wrap top-in">
        <Link to="/" className="brand" aria-label="TokenEconomizer 中文站首页">
          <b>TokenEconomizer</b>
          <span>经验驱动的黑盒成本控制</span>
        </Link>

        <nav className="nav" aria-label="主导航">
          {links.map((l) => (
            <Link key={l.label} to={l.to} hash={l.hash}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="top-right">
          <a className="ghost arxiv" href="https://arxiv.org/abs/2610.22732" target="_blank" rel="noreferrer">
            arXiv
          </a>
          <a className="ghost" href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-label="展开导航"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? '关闭' : '菜单'}
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${open ? 'open' : ''}`}>
        <div className="wrap">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              hash={l.hash}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
