import { createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager } from '../components/DocParts'
import { REPO, commandPrefixes, commands } from '../data/content'

export const Route = createFileRoute('/docs/commands')({
  component: Commands,
})

function Commands() {
  return (
    <>
      <DocHeader
        title="日常命令"
        lead="照常工作即可；插件不需要你做任何事。要查看或更改它的行为，使用它的命令。这些命令在每个智能体上名字都相同，只有输入方式不同。"
      />

      <div className="prose">
        <h2 id="how">怎么输入</h2>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>这样输入命令</th>
            </tr>
          </thead>
          <tbody>
            {commandPrefixes.map((c) => (
              <tr key={c.where}>
                <td>{c.where}</td>
                <td>
                  <code>{c.how}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="list">命令</h2>
        <table>
          <thead>
            <tr>
              <th>命令</th>
              <th>作用</th>
            </tr>
          </thead>
          <tbody>
            {commands.map((c) => (
              <tr key={c.cmd}>
                <td>
                  <code>{c.cmd}</code>
                </td>
                <td>{c.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          在智能体内部，一条命令消耗一次模型轮次；从终端运行则是免费的。其他命令（<code>repos</code>、
          <code>doctor</code>、<code>config unset</code>{' '}
          等）以及每个智能体的权限提示，列在{' '}
          <a href={`${REPO}/blob/main/plugin/README.md#commands`}>plugin/README.md 的 Commands 一节</a>。
        </p>

        <div className="callout">
          <b>用哪个入口跑命令。</b> 在智能体会话里跑，命令能直接看到插件注入的事实和被剪掉的工具；在仓库终端里跑{' '}
          <code>~/.tokeneconomizer/bin/te</code>，不消耗任何模型调用，适合随时查账。
        </div>

        <h2 id="patterns">几条常用写法</h2>
        <p>以 Claude Code 的输入方式为例，其他智能体把前缀换掉即可（见上表）。</p>
        <ul>
          <li>
            <code>/tokeneconomizer:status</code>：它在这里学到了什么、做了什么，以及你的会话花了多少。
          </li>
          <li>
            <code>/tokeneconomizer:microskills</code>：已注入的事实，以及仍在形成、尚在观察中的那些。
          </li>
          <li>
            <code>/tokeneconomizer:toolprune</code>：被排除的工具与证据；Pi 与 opencode 上不可用。
          </li>
          <li>
            <code>/tokeneconomizer:toolprune restore</code>：把工具还回来，它们不会再被移除。
          </li>
        </ul>
      </div>

      <DocPager current="/docs/commands" />
    </>
  )
}
