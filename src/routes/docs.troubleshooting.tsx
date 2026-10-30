import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { expTroubleshooting, faqs, pluginTroubleshooting } from '../data/content'

export const Route = createFileRoute('/docs/troubleshooting')({
  head: () =>
    pageHead(
      '故障排查与诊断',
      '使用 te doctor 诊断插件环境、用 te probe 真机验证七次会话闭环、排查 errors.log 常见报错以及复现实验中的常见故障。',
    ),
  component: TroubleshootingPage,
})

const toc = [
  { id: 'doctor', label: 'te doctor 环境自检' },
  { id: 'probe', label: 'te probe 真机端到端探测' },
  { id: 'plugin-issues', label: '插件常见故障与修复' },
  { id: 'exp-issues', label: '实验复现常见故障' },
  { id: 'faq', label: '常见问题解答' },
]

const doctorCmds = `# 检查当前仓库最近使用过的智能体环境
~/.tokeneconomizer/bin/te doctor

# 指定检查某一个宿主智能体（如 codex 或 copilot）
~/.tokeneconomizer/bin/te --host codex doctor
~/.tokeneconomizer/bin/te --host copilot doctor

# 如果还未跑过任何会话（~/.tokeneconomizer/bin 尚未生成），直接从克隆目录运行：
/path/to/TokenEconomizer/plugin/scripts/te doctor`

const probeCmd = `~/.tokeneconomizer/bin/te --host copilot probe      # 在临时仓库中连续跑 7 场真实短会话`

function TroubleshootingPage() {
  return (
    <>
      <DocHeader
        title="故障排查与诊断"
        lead="插件的所有钩子均采用故障开放（fail-open）设计：一旦内部出现任何异常，钩子会静默返回空结果，让你的智能体会话照常继续，同时把错误信息写入 ~/.tokeneconomizer/errors.log。遇到疑问时，先跑一次 te doctor。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="doctor">te doctor 环境自检</h2>
        <p>
          <code>doctor</code> 命令不会发起任何模型调用，也不消耗智能体轮次。它会依次检查：
        </p>
        <ul>
          <li>当前使用的 Python 解释器路径与版本（要求 Python 3.10 或更高版本）；</li>
          <li>状态目录 <code>~/.tokeneconomizer</code> 的读写权限与结构；</li>
          <li>本机已发现的编码智能体、插件安装状态，以及当前目录是否已被 Codex 或 Copilot CLI 标记为受信任（trusted）；</li>
          <li>如果启用了仓库地图（<code>repomap</code>）或安装了 <code>rtk</code>，报告其对应的可执行文件位置；</li>
          <li>当前工作目录被归入哪个仓库身份键（remote URL 或主检出路径），以及侧调用路由与 <code>errors.log</code> 中最近的报错行。</li>
        </ul>
        <CodeBlock code={doctorCmds} label="运行诊断" />

        <h2 id="probe">te probe 真机端到端探测</h2>
        <p>
          如果你想在自己的机器与账号配置（尤其是 Copilot CLI 的 BYOK 模式）上验证插件的三大机制是否完整跑通，可以运行内置的端到端探测命令：
        </p>
        <CodeBlock code={probeCmd} label="真机闭环探测" />
        <p>
          该命令会创建一个用完即删的临时仓库（配置了 pytest 测试但故意不安装 pytest，仅能用{' '}
          <code>python -m unittest</code> 通过），并在隔离的状态目录下自动发起 7 场简短的真实会话：验证微技能是否成功学到事实并在后续会话中改变模型首条测试命令，接着应用提议的工具剪枝列表、对比工具定义 token 数变化，最后自动恢复配置。注意：这会消耗你账号上的少量真实模型调用。
        </p>

        <h2 id="plugin-issues">插件常见故障与修复</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: '36%' }}>症状或报错信息</th>
              <th>原因与修复方式</th>
            </tr>
          </thead>
          <tbody>
            {pluginTroubleshooting.map((item) => (
              <tr key={item.symptom}>
                <td>
                  <strong>{item.symptom}</strong>
                </td>
                <td>{item.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="exp-issues">实验复现常见故障</h2>
        <p>
          在运行 <code>experiments/</code> 下的 SWE-Bench 与 Web-Bench 评测脚本时，如果遇到异常，可对照下表排查：
        </p>
        <table>
          <thead>
            <tr>
              <th style={{ width: '36%' }}>症状或报错信息</th>
              <th>原因与修复方式</th>
            </tr>
          </thead>
          <tbody>
            {expTroubleshooting.map((item) => (
              <tr key={item.symptom}>
                <td>
                  <strong>{item.symptom}</strong>
                </td>
                <td>{item.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="faq">常见问题解答</h2>
        {faqs.map((item) => (
          <div key={item.q} style={{ marginBottom: 22 }}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      <DocPager current="/docs/troubleshooting" />
    </>
  )
}

