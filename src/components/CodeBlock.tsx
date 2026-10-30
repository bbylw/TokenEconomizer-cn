import { useState } from 'react'

type Props = {
  code: string
  label?: string
  className?: string
}

export function CodeBlock({ code, label = 'shell', className }: Props) {
  const [copied, setCopied] = useState(false)

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
    <div className={`code-block ${className ?? ''}`.trim()}>
      <div className="code-head">
        <span>{label}</span>
        <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="code-body">
        <code>{code}</code>
      </pre>
    </div>
  )
}
