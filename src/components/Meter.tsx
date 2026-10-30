import { useEffect, useRef, useState } from 'react'

type SessionItem = {
  id: string
  width: number
  work: number
  waste: number
  value: string
  saving: string
  tag: string
  detail: string
}

const sessions: SessionItem[] = [
  {
    id: 'S1',
    width: 90.9,
    work: 60,
    waste: 30.9,
    value: '100',
    saving: '基准 100',
    tag: '微技能学习',
    detail: '首次进入仓库：裸跑 pytest 失败后改用 python -m pytest 成功，环境事实层记下这一规律。',
  },
  {
    id: 'S2',
    width: 85.5,
    work: 60,
    waste: 25.5,
    value: '94',
    saving: '−6%',
    tag: '工具剪枝生效',
    detail: '连续两个会话、累计十次提示均未调用 Notebook 与 Browser，工具剪枝在空闲后将它们排除。',
  },
  {
    id: 'S3',
    width: 80,
    work: 60,
    waste: 20,
    value: '88',
    saving: '−12%',
    tag: '循环守卫重定向',
    detail: '同一测试报错连续出现三次，裁判模型判定卡住（置信度 ≥ 0.7）并注入一条「换种思路」的重定向。',
  },
  {
    id: 'S4',
    width: 72.7,
    work: 60,
    waste: 12.7,
    value: '80',
    saving: '−20%',
    tag: '事实正式注入',
    detail: '连续三个会话确认同一事实后，从 S4 起在会话开始时陈述一次，不再重复踩坑试错。',
  },
  {
    id: 'S5',
    width: 67.3,
    work: 60,
    waste: 7.3,
    value: '74',
    saving: '−26%',
    tag: '包络建立完成',
    detail: '正常结束的轮次满 5 次，循环守卫完成该仓库通常轮次长度（包络）建模，精准放过正常长轮次。',
  },
  {
    id: 'S6',
    width: 65.5,
    work: 60,
    waste: 5.5,
    value: '72',
    saving: '−28%',
    tag: '三项机制稳态运行',
    detail: '不改智能体本身，三种重复浪费被持续压缩，单会话成本稳定在基线虚线之下（100 → 72）。',
  },
]

export function Meter() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setEntered(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const selected = sessions.find((s) => s.id === selectedId)

  return (
    <div ref={rootRef} className={`meter-wrap ${entered ? 'is-entered' : ''}`}>
      <div className="m-head">
        <span>同一仓库，连续六个会话（点击行查看详情）</span>
        <span className="legend">
          <span>
            <i className="sw-work" />
            工作
          </span>
          <span>
            <i className="sw-waste" />
            浪费
          </span>
        </span>
      </div>

      <div className="m-body" role="list" aria-label="六个连续会话的成本拆解">
        <div className="m-guide" aria-hidden="true" />
        {sessions.map((s, idx) => {
          const isSelected = selectedId === s.id
          return (
            <button
              type="button"
              className={`m-row ${isSelected ? 'is-selected' : ''}`}
              key={s.id}
              onClick={() => setSelectedId((prev) => (prev === s.id ? null : s.id))}
              aria-pressed={isSelected}
              aria-label={`会话 ${s.id}：总成本 ${s.value}，${s.tag}`}
            >
              <span className="m-id">{s.id}</span>
              <span className="m-track">
                <span
                  className="m-bar"
                  style={{
                    width: `${s.width}%`,
                    transitionDelay: `${idx * 65}ms`,
                  }}
                >
                  <span className="m-work" style={{ width: `${s.work}%` }} />
                  <span className="m-waste" style={{ width: `${s.waste}%` }} />
                </span>
              </span>
              <span className={`m-val ${Number(s.value) <= 80 ? 'down' : ''}`}>{s.value}</span>
            </button>
          )
        })}
      </div>

      <div className="m-total">
        <span className="tl">六次会话合计</span>
        <span className="tv">600 降到 508</span>
        <span className="td">单次最高 −28%</span>
      </div>

      {selected ? (
        <div className="m-foot m-detail" aria-live="polite">
          <div className="m-detail-head">
            <span>
              <strong className="cy">{selected.id}</strong> · {selected.tag}
            </span>
            <span className="m-detail-stat">
              成本 <b>{selected.value}</b>（{selected.saving}）
            </span>
          </div>
          <p className="m-detail-text">{selected.detail}</p>
          <button
            type="button"
            className="m-detail-reset"
            onClick={() => setSelectedId(null)}
          >
            返回全部会话摘要
          </button>
        </div>
      ) : (
        <div className="m-foot">
          <span className="cy">S1</span> 记下 python -m pytest，此前 pytest 缺失，记入微技能
          <br />
          <span className="cy">S2</span> 排除 Notebook 与 Browser，工具剪枝生效
          <br />
          <span className="cy">S3</span> 第三次同样的错误，循环守卫重定向
          <br />
          <span style={{ color: 'var(--dim)' }}>
            虚线为不装插件时的单会话成本；点击上方任一会话行可查看单步详情。
          </span>
        </div>
      )}
    </div>
  )
}
