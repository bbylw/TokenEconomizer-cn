import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager } from '../components/DocParts'
import { REPO, agents, versions } from '../data/content'

export const Route = createFileRoute('/docs/quickstart')({
  component: Quickstart,
})

function Quickstart() {
  return (
    <>
      <DocHeader
        title="快速开始"
        lead="需要以下智能体之一（以它支持的任何方式登录），以及 PATH 上 Python 3.10 或更高版本。插件不需要自己的 API 密钥，也从不处理凭证，因此任何套餐或登录方式都行。"
      />

      <div className="prose">
        <h2 id="install">安装</h2>
        <p>
          在你希望保留克隆的文件夹里运行以下命令。Claude Code、Codex、Copilot CLI 和 opencode
          都从克隆目录运行插件，所以请把它留在原位。然后在你的某个仓库里启动智能体。
        </p>

        {agents.map((a) => (
          <div key={a.id} id={a.id}>
            <h3>
              {a.name}
              {a.note ? `（${a.note}）` : ''}
            </h3>
            <CodeBlock code={a.install.join('\n')} label={a.name} />
            <p>{a.inspect}</p>
          </div>
        ))}

        <h2 id="update">更新方式</h2>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>更新</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Claude Code、Copilot CLI、opencode</td>
              <td>
                在克隆目录里 <code>git pull</code>
              </td>
            </tr>
            <tr>
              <td>Codex</td>
              <td>
                在克隆目录里 <code>git pull</code>，然后再次执行 <code>codex plugin add</code> 那一行
              </td>
            </tr>
            <tr>
              <td>Pi</td>
              <td>
                <code>pi update --extensions</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          <a href={`${REPO}/blob/main/plugin/README.md`}>plugin/README.md</a>{' '}
          更详细地讲解了每个智能体，包括卸载、给 Copilot 配上你自己的模型密钥，以及故障排查。
        </p>

        <div className="callout">
          <b>安装成功的标志。</b> status 命令会打印一小段状态信息。<code>refresh-catalog</code>{' '}
          会记录一个会话加载过的每一个工具（不涉及模型调用），以便工具剪枝能考虑到它们全部。请像上面那样保持 marketplace
          路径为绝对路径：Copilot CLI 会把 <code>./TokenEconomizer</code> 这样的相对路径当成某个 GitHub 仓库的名字。
        </div>

        <h2 id="versions">支持的版本</h2>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>支持范围</th>
              <th>更老的版本</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => (
              <tr key={v.agent}>
                <td>{v.agent}</td>
                <td>{v.range}</td>
                <td>{v.older}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>上面的命令在每个范围的最老与最新版本上都测过；更晚的版本尚未测试。</p>
        <ul>
          <li>
            <strong>Codex 0.141.0 之前</strong>完全不会运行插件钩子。
          </li>
          <li>
            <strong>Pi 0.99.x</strong>：不用 <code>pi install</code>，改为克隆仓库，并以{' '}
            <code>pi --extension /path/to/TokenEconomizer/plugin/pi/tokeneconomizer.ts</code>{' '}
            启动每次会话，使用你克隆目录的完整路径；在克隆目录里 <code>git pull</code> 即可更新。
          </li>
          <li>
            <strong>opencode</strong>{' '}
            的支持是实验性的：仅在 1.19.5 与 2.2.0 上测试过，且未在 2.x 的终端 UI 中测试。
          </li>
        </ul>
      </div>

      <DocPager current="/docs/quickstart" />
    </>
  )
}
