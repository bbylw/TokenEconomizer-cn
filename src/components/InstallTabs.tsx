import { useState } from 'react'
import { agents } from '../data/content'

export function InstallTabs() {
  const [active, setActive] = useState(agents[0].id)
  const [copied, setCopied] = useState(false)
  const agent = agents.find((a) => a.id === active) ?? agents[0]
  const code = agent.install.join('\n')

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="install">
      <div className="tabs" role="tablist" aria-label="选择智能体">
        {agents.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={a.id === active}
            className={`tab ${a.id === active ? 'on' : ''}`}
            onClick={() => setActive(a.id)}
          >
            {a.name}
            {a.note ? ` · ${a.note}` : ''}
          </button>
        ))}
        <button type="button" className="copy-btn tab-copy" onClick={copy} aria-live="polite">
          {copied ? '已复制' : '复制'}
        </button>
      </div>

      <div className="code">
        {agent.install.map((line, i) => (
          <div className="code-line" key={i}>
            <span className="prompt">$</span>
            <span>{line}</span>
          </div>
        ))}
      </div>

      <div className="install-note">
        <div>
          <b>安装后</b>
          <span>{agent.inspect}</span>
        </div>
        <div>
          <b>更新</b>
          <span>{agent.update}</span>
        </div>
      </div>
    </div>
  )
}
