import { type KeyboardEvent, useRef, useState } from 'react'
import { agents } from '../data/content'

export function InstallTabs() {
  const [active, setActive] = useState(agents[0].id)
  const [copied, setCopied] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
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

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % agents.length
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + agents.length) % agents.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = agents.length - 1
    }

    if (nextIndex !== null) {
      e.preventDefault()
      const targetAgent = agents[nextIndex]
      setActive(targetAgent.id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="install">
      <div className="tabs" role="tablist" aria-label="选择智能体">
        {agents.map((a, idx) => {
          const isSelected = a.id === active
          return (
            <button
              key={a.id}
              ref={(el) => {
                tabRefs.current[idx] = el
              }}
              id={`install-tab-${a.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`install-panel-${a.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={`tab ${isSelected ? 'on' : ''}`}
              onClick={() => setActive(a.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {a.name}
              {a.note ? ` · ${a.note}` : ''}
            </button>
          )
        })}
        <button type="button" className="copy-btn tab-copy" onClick={copy} aria-live="polite">
          {copied ? '已复制' : '复制'}
        </button>
      </div>

      <div
        id={`install-panel-${agent.id}`}
        role="tabpanel"
        aria-labelledby={`install-tab-${agent.id}`}
      >
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
            <b>命令</b>
            <span>
              智能体内输入 <code>{agent.prefix}</code>；终端内运行{' '}
              <code>{agent.terminalPrefix}</code>
            </span>
          </div>
          <div>
            <b>更新</b>
            <span>{agent.update}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
