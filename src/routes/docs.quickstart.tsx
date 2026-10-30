import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO, agents, versions } from '../data/content'

export const Route = createFileRoute('/docs/quickstart')({
  head: () =>
    pageHead(
      '快速开始',
      '在 Claude Code、Codex、GitHub Copilot CLI、Pi 与 opencode 上安装、检查、更新和卸载 TokenEconomizer 插件，以及支持的版本范围与 BYOK 配置。',
    ),
  component: Quickstart,
})

const toc = [
  { id: 'before', label: '开始之前' },
  { id: 'install', label: '各智能体安装' },
  { id: 'self-contained', label: '自包含安装（Codex）' },
  { id: 'byok', label: 'Copilot 自带密钥（BYOK）' },
  { id: 'update', label: '更新与卸载' },
  { id: 'versions', label: '支持的版本' },
]

const selfContainedCmds = `python3 /path/to/TokenEconomizer/scripts/build_plugin.py --out ~/te-marketplace
codex plugin marketplace add ~/te-marketplace
codex plugin add tokeneconomizer@tokeneconomizer`

const byokAnthropicCmds = `export COPILOT_PROVIDER_TYPE=anthropic                  # 或 openai、azure
export COPILOT_PROVIDER_BASE_URL=https://api.anthropic.com
export COPILOT_PROVIDER_API_KEY=...                     # 你的提供商密钥`

const byokOpenRouterCmds = `export COPILOT_PROVIDER_TYPE=anthropic
export COPILOT_PROVIDER_BASE_URL=https://openrouter.ai/api
export COPILOT_PROVIDER_BEARER_TOKEN=...                        # 你的 OpenRouter 密钥
export COPILOT_PROVIDER_MODEL_ID=claude-haiku-4.5               # Copilot 自身配置的模型名
export COPILOT_PROVIDER_WIRE_MODEL=anthropic/claude-haiku-4.5   # OpenRouter 计费的模型名`

function Quickstart() {
  return (
    <>
      <DocHeader
        title="快速开始"
        lead="需要以下智能体之一（以它支持的任何方式登录），以及 PATH 上 Python 3.10 或更高版本。插件不需要自己的 API 密钥，也从不处理凭证，因此任何套餐或登录方式都行。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="before">开始之前</h2>
        <ul>
          <li>
            已安装并登录你的编码智能体（订阅套餐或 API Key 均可），且版本在下方支持范围内。
          </li>
          <li>
            <code>PATH</code> 上有 Python 3.10 或更高版本（也可通过环境变量{' '}
            <code>TE_PYTHON=/path/to/python3.10+</code> 指定）。
          </li>
          <li>
            <strong>仅 Copilot CLI</strong>：首次在目标仓库启动 <code>copilot</code> 时，需选择{' '}
            <strong>Yes, and remember this folder for future sessions</strong> 信任该文件夹，否则 Copilot 会忽略该仓库下的{' '}
            <code>.github/copilot</code> 工具剪枝配置。
          </li>
        </ul>
        <div className="callout">
          <b>命令在哪里输入。</b> 以 <code>/</code> 或 <code>$</code> 开头的行（如{' '}
          <code>/tokeneconomizer:status</code>、<code>$tokeneconomizer:status</code>、
          <code>/te status</code>）是在<strong>智能体的对话提示框</strong>里输入的，而不是在操作系统的终端 Shell 里。
        </div>

        <h2 id="install">各智能体安装</h2>
        <p>
          在你希望保留克隆的文件夹里运行以下命令。Claude Code、Codex、Copilot CLI 和 opencode
          都从克隆目录运行插件，所以请把它留在原位。插件在会话启动时加载，装好后请在你的某个仓库里开启一个新会话。
        </p>

        {agents.map((a) => (
          <div key={a.id} id={a.id}>
            <h3>
              {a.name}
              {a.note ? `（${a.note}）` : ''}
            </h3>
            <CodeBlock code={a.install.join('\n')} label={`${a.name} · 安装`} />
            <p>{a.inspect}</p>
          </div>
        ))}

        <div className="callout cool">
          <b>安装成功的标志。</b> <code>status</code> 命令会打印一小段状态信息。
          <code>refresh-catalog</code> 会记录一个会话加载过的每一个工具（不涉及模型调用），以便工具剪枝能考虑到它们全部。请像上面那样保持 marketplace
          路径为绝对路径：Copilot CLI 会把 <code>./TokenEconomizer</code> 这样的相对路径当成某个 GitHub 仓库的名字。在 Windows 上为 Claude Code 添加 marketplace 时，请使用带正斜杠的绝对路径（如{' '}
          <code>C:/path/to/TokenEconomizer</code>）。
        </div>

        <h2 id="self-contained">自包含安装（Codex）</h2>
        <p>
          Codex 安装插件时会复制一份插件配置，但默认仍引用克隆目录里的 Python 包。如果你希望把插件包本体也一起打包进去，从而可以自由移动或删除最初的克隆目录，可以先运行构建脚本：
        </p>
        <CodeBlock code={selfContainedCmds} label="构建并安装自包含包" />

        <h2 id="byok">Copilot 自带密钥（BYOK）</h2>
        <p>
          如果组织策略禁用了 Copilot 自带模型（提示 <em>Access denied by policy settings</em>），你可以为 Copilot 配置自己的模型提供商（BYOK）：
        </p>
        <CodeBlock code={byokAnthropicCmds} label="Anthropic 直连" />
        <p>
          如果经由 <strong>OpenRouter</strong> 接入，请保持 <code>anthropic</code> 协议以便提示缓存生效，并同时指定两侧的模型 ID：
        </p>
        <CodeBlock code={byokOpenRouterCmds} label="OpenRouter 接入" />
        <p>
          注意：Copilot CLI 不会将 <code>COPILOT_PROVIDER_*</code> 环境变量传递给插件钩子，因此在 BYOK 模式下，插件自身的模型调用（微技能提议器、循环守卫裁判）会自动暂停并在会话启动时播报一次；无需模型调用的环境事实学习（
          <code>microskills=envfacts</code>）、工具剪枝、<code>refresh-catalog</code> 与{' '}
          <code>measure</code> 则不受影响照常工作。
        </p>

        <h2 id="update">更新与卸载</h2>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>更新方式</th>
              <th>卸载步骤</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.name}</strong>
                </td>
                <td>{a.update}</td>
                <td>
                  <code>{a.uninstall.join(' && ')}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          卸载前先在排除过工具的仓库里运行一次 <code>toolprune restore</code>，即可干净移除插件写入的拒绝规则。若想彻底删除本机学到的所有历史状态，可在卸载后执行{' '}
          <code>rm -rf ~/.tokeneconomizer</code>。更多细节见上游{' '}
          <a href={`${REPO}/blob/main/plugin/README.md`} target="_blank" rel="noreferrer">
            plugin/README.md
          </a>
          。
        </p>

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
