import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import {
  REPO,
  extraSettings,
  loopguardPresets,
  mechanismModes,
  settings,
} from '../data/content'

export const Route = createFileRoute('/docs/settings')({
  head: () =>
    pageHead(
      '设置',
      'TokenEconomizer 九项核心设置、三种机制开关模式、循环守卫三档预设阈值对比表、第四机制仓库地图（repomap）与 rtk 协同。',
    ),
  component: Settings,
})

const toc = [
  { id: 'modes', label: '三种机制开关模式' },
  { id: 'table', label: '九项核心设置' },
  { id: 'presets', label: '循环守卫三档预设阈值' },
  { id: 'extra', label: '进阶与其它设置' },
  { id: 'repomap', label: '仓库地图（repomap）与 rtk' },
  { id: 'env', label: '环境变量与优先级' },
]

const setExamples = `/tokeneconomizer:config set microskills=on                 # 在当前仓库开启微技能
/tokeneconomizer:config set microskills=on --global        # 在所有仓库开启微技能
/tokeneconomizer:config set microskills_propose_every=5    # k = 5：更不频繁地提议事实
/tokeneconomizer:config set toolprune_evidence=20          # p = 20：等待二十次未使用的提示
/tokeneconomizer:config set loopguard_nudges=2 loopguard.min_turns=30
/tokeneconomizer:config unset loopguard.min_turns          # 恢复为当前预设档位的默认值`

const repomapCmds = `pip install aider-chat                      # 或 pipx install aider-chat / uv tool install aider-chat
~/.tokeneconomizer/bin/te config set repomap=on      # 设置由该仓库下的所有智能体共享`

const envExamples = `TE_DISABLE=1 claude                                    # 单次会话关闭整个插件
TE_LOOPGUARD=off codex                                 # 单次会话只关掉某一机制
TE_LOOPGUARD_THRESHOLDS='{"min_turns": 30}' claude     # 单次会话覆盖循环守卫子阈值`

function Settings() {
  return (
    <>
      <DocHeader
        title="设置"
        lead="工具剪枝和循环守卫默认开启。在这两个默认值下，插件只在某一轮出现循环迹象时才会调用模型：即裁判，以及它发现该轮卡住时写下的重定向。设置按仓库生效（加 --global 则全局生效），并由该仓库里的所有智能体共享。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="modes">三种机制开关模式</h2>
        <p>
          微技能默认关闭，因为它的提议器会增加模型调用，而它能省下多少取决于仓库与任务性质。除了{' '}
          <code>on</code> 和 <code>off</code>，微技能与工具剪枝还支持不调模型或仅提议的中间模式：
        </p>

        <table>
          <thead>
            <tr>
              <th style={{ width: 145 }}>机制</th>
              <th style={{ width: 105 }}>配置键</th>
              <th>设为 on 时的行为</th>
              <th>其他可选值</th>
            </tr>
          </thead>
          <tbody>
            {mechanismModes.map((m) => (
              <tr key={m.key}>
                <td>
                  <strong>{m.mech}</strong>
                </td>
                <td>
                  <code>{m.key}</code>
                </td>
                <td>{m.onMeaning}</td>
                <td>{m.otherValues}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="table">九项核心设置</h2>
        <p>首页与论文中用斜体字母标记的九项核心参数及其默认值如下：</p>
        <table>
          <thead>
            <tr>
              <th style={{ width: 58 }}>字母</th>
              <th>设置名称</th>
              <th style={{ width: 92, textAlign: 'center' }}>默认值</th>
              <th>控制什么</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.name}>
                <td>
                  <code>{s.key}</code>
                </td>
                <td>
                  <code>{s.name}</code>
                </td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {s.def}
                </td>
                <td>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>下面以 Claude Code 的写法展示常用修改命令（其他智能体替换前缀即可）：</p>
        <CodeBlock code={setExamples} label="修改与重置设置" />

        <h2 id="presets">循环守卫三档预设阈值</h2>
        <p>
          循环守卫通过 <code>loopguard_aggr</code> 提供三档灵敏度预设（<code>conservative</code>、
          <code>default</code>、<code>aggressive</code>），你也可以用{' '}
          <code>loopguard.&lt;name&gt;=值</code> 单独覆盖其中任意一项：
        </p>
        <table>
          <thead>
            <tr>
              <th>loopguard.&lt;name&gt;</th>
              <th style={{ textAlign: 'center' }}>conservative</th>
              <th style={{ textAlign: 'center' }}>default</th>
              <th style={{ textAlign: 'center' }}>aggressive</th>
              <th>含义说明</th>
            </tr>
          </thead>
          <tbody>
            {loopguardPresets.map((p) => (
              <tr key={p.name}>
                <td>
                  <code>{p.name}</code>
                </td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {p.cons}
                </td>
                <td className="mono" style={{ textAlign: 'center', color: 'var(--amber)' }}>
                  {p.def}
                </td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {p.aggr}
                </td>
                <td>{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="extra">进阶与其它设置</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: 210 }}>设置名称</th>
              <th style={{ width: 88, textAlign: 'center' }}>默认值</th>
              <th>控制什么</th>
            </tr>
          </thead>
          <tbody>
            {extraSettings.map((s) => (
              <tr key={s.name}>
                <td>
                  <code>{s.name}</code>
                </td>
                <td className="mono" style={{ textAlign: 'center' }}>
                  {s.def}
                </td>
                <td>{s.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="repomap">仓库地图（repomap）与 rtk</h2>
        <h3>可选第四机制：仓库地图（Repository map）</h3>
        <p>
          借助 <code>aider-chat</code> 生成仓库关键文件与符号签名的压缩地图（按被引用频次排序，默认最多 2048 tokens），在会话开始时注入上下文，帮助智能体在读取文件前就掌握代码结构，且<strong>不消耗任何模型调用</strong>：
        </p>
        <CodeBlock code={repomapCmds} label="启用仓库地图" />
        <p>
          在 Claude Code、Copilot CLI 与 Pi 上，<code>repomap=on</code> 会根据你首条提示中的标识符动态重排地图（若超过{' '}
          <code>repomap_timeout</code> 秒则回退使用缓存地图）；在 Codex 上或设为{' '}
          <code>repomap=start</code> 时，则在会话启动时直接注入按 commit 缓存的地图，绝不延迟提示响应。
        </p>

        <h3>与 rtk 配合使用</h3>
        <p>
          <a href="https://github.com/rtk-ai/rtk" target="_blank" rel="noreferrer">
            rtk
          </a>{' '}
          用于压缩终端命令输出。两者互不干扰：插件会自动将 <code>rtk</code> 前缀命令还原为其包裹的真实命令来分析；唯一需要注意的细节是在 rtk 0.45.0 下，当环境缺失 pytest 时{' '}
          <code>rtk pytest</code> 退出码为 1 但不打印报错文本，插件无法从中触发环境事实提取，而显式指定解释器的命令（如{' '}
          <code>.venv/bin/python -m pytest</code>）不会被 rtk 改写，仍可正常工作。
        </p>

        <h2 id="env">环境变量与优先级</h2>
        <p>
          配置优先级从高到低依次为：<strong>单次会话环境变量 &gt; 当前仓库设置 &gt; 全局设置（--global） &gt; 内置默认值</strong>。每一项设置的环境变量名均为{' '}
          <code>TE_</code> 加上其大写名称：
        </p>
        <CodeBlock code={envExamples} label="环境变量覆盖" />
        <p>
          早期版本中的旧配置名（<code>inject_*</code>、<code>untool_*</code>、<code>spiral_*</code> 以及环境变量{' '}
          <code>TE_INJECT</code>、<code>TE_UNTOOL</code>、<code>TE_SPIRAL</code>）依然向后兼容读取。完整列表见{' '}
          <a href={`${REPO}/blob/main/plugin/README.md#settings`} target="_blank" rel="noreferrer">
            plugin/README.md 的 Settings 一节
          </a>
          。
        </p>
      </div>

      <DocPager current="/docs/settings" />
    </>
  )
}
