const sessions = [
  { id: 'S1', width: 90.9, work: 60, waste: 30.9, value: '100' },
  { id: 'S2', width: 85.5, work: 60, waste: 25.5, value: '94' },
  { id: 'S3', width: 80, work: 60, waste: 20, value: '88' },
  { id: 'S4', width: 72.7, work: 60, waste: 12.7, value: '80' },
  { id: 'S5', width: 67.3, work: 60, waste: 7.3, value: '74' },
  { id: 'S6', width: 65.5, work: 60, waste: 5.5, value: '72' },
]

export function Meter() {
  return (
    <>
      <div className="m-head">
        <span>同一仓库，连续六个会话</span>
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

      <div className="m-body">
        <div className="m-guide" />
        {sessions.map((s) => (
          <div className="m-row" key={s.id}>
            <span className="m-id">{s.id}</span>
            <div className="m-track">
              <div className="m-bar" style={{ width: `${s.width}%` }}>
                <span className="m-work" style={{ width: `${s.work}%` }} />
                <span className="m-waste" style={{ width: `${s.waste}%` }} />
              </div>
            </div>
            <span className="m-val">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="m-total">
        <span className="tl">六次会话合计</span>
        <span className="tv">600 降到 528</span>
        <span className="td">−12%</span>
      </div>

      <div className="m-foot">
        <span className="cy">S1</span> 记下 python -m pytest，此前 pytest 缺失，记入微技能
        <br />
        <span className="cy">S2</span> 排除 Notebook 与 Browser，工具剪枝生效
        <br />
        <span className="cy">S3</span> 第三次同样的错误，循环守卫重定向
        <br />
        <span style={{ color: 'var(--dim)' }}>
          虚线为不装插件时的单会话成本；此处为示意图，实测见下节。
        </span>
      </div>
    </>
  )
}
