import { createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO, commandPrefixes, commands } from '../data/content'

export const Route = createFileRoute('/docs/commands')({
  head: () =>
    pageHead(
      '日常命令',
      'TokenEconomizer 全部 15 条命令详解：status、microskills、toolprune、config、repomap、repos 与 doctor，以及在五种智能体与终端中的调用方式。',
    ),
  component: Commands,
})

const toc = [
  { id: 'how', label: '怎么输入' },
  { id: 'list', label: '全部 15 条命令' },
  { id: 'permissions', label: '权限确认与旧版别名' },
]

function Commands() {
  return (
    <>
      <DocHeader
        title="日常命令"
        lead="照常工作即可；插件不需要你做任何事。要查看或更改它的行为，使用它的命令。这些命令在每个智能体上名字都相同，只有输入方式不同。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="how">怎么输入</h2>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>在智能体内部输入</th>
              <th>在仓库终端里运行（零模型调用开销）</th>
            </tr>
          </thead>
          <tbody>
            {commandPrefixes.map((c) => (
              <tr key={c.where}>
                <td>
                  <strong>{c.where}</strong>
                </td>
                <td>
                  <code>{c.inside}</code>
                </td>
                <td>
                  <code>{c.terminal}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="callout">
          <b>智能体内运行 vs 终端运行。</b> 在智能体内部输入斜杠或技能命令（除 Pi 外）会消耗一次模型轮次；而在仓库目录下的普通终端里运行{' '}
          <code>~/.tokeneconomizer/bin/te</code> 完全免费，适合随时查账或修改配置。如果不带{' '}
          <code>--host</code> 参数，<code>te</code> 默认操作最近一次在该仓库中工作过的那个智能体。启动器{' '}
          <code>~/.tokeneconomizer/bin/te</code> 会在第一次会话启动时自动写入；在此之前也可直接运行克隆目录里的{' '}
          <code>plugin/scripts/te</code>。
        </div>

        <h2 id="list">全部 15 条命令</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: '34%' }}>命令</th>
              <th>作用说明</th>
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
          注：<code>doctor</code> 与 <code>repomap</code> 仅从终端运行（或在 Pi 中以{' '}
          <code>/te doctor</code>、<code>/te repomap</code> 运行），没有对应的斜杠命令或 Codex 技能。
        </p>

        <h2 id="permissions">权限确认与旧版别名</h2>
        <ul>
          <li>
            <strong>Codex 沙盒确认</strong>：会改动状态的命令（如 <code>config set</code>、
            <code>config unset</code>、<code>toolprune apply</code>、<code>toolprune restore</code>、
            <code>repos migrate</code>、<code>repos merge</code>）需要写入沙盒外的{' '}
            <code>~/.tokeneconomizer</code>，因此 Codex 会弹窗询问权限，请选择 <strong>Yes, proceed</strong>。
          </li>
          <li>
            <strong>Copilot CLI 确认</strong>：斜杠命令仅在交互模式下可用，且每次执行插件脚本前会询问确认，请选择{' '}
            <strong>Yes</strong>。
          </li>
          <li>
            <strong>旧版命令别名兼容</strong>：在三大机制更名前，微技能与工具剪枝的命令曾叫作{' '}
            <code>facts</code> 与 <code>untool</code>。目前 <code>te facts</code>、<code>te untool</code> 以及{' '}
            <code>/tokeneconomizer:facts</code>、<code>/tokeneconomizer:untool</code> 依然完全兼容可用。详见{' '}
            <a href={`${REPO}/blob/main/plugin/README.md#commands`} target="_blank" rel="noreferrer">
              plugin/README.md 的 Commands 一节
            </a>
            。
          </li>
        </ul>
      </div>

      <DocPager current="/docs/commands" />
    </>
  )
}
