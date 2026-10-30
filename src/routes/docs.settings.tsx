import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager } from '../components/DocParts'
import { REPO, settings } from '../data/content'

export const Route = createFileRoute('/docs/settings')({
  component: Settings,
})

const setExamples = `/tokeneconomizer:config set microskills=on                 # 开启微技能
/tokeneconomizer:config set microskills_propose_every=5    # k = 5：更不频繁地提议事实
/tokeneconomizer:config set toolprune_evidence=20          # p = 20：等待二十次未使用的提示
/tokeneconomizer:config set loopguard_nudges=2             # r = 2：在告知你之前重定向两次`

const envExamples = `TE_DISABLE=1 claude      # 关闭整个插件
TE_LOOPGUARD=off codex    # 只关掉某一机制`

function Settings() {
  return (
    <>
      <DocHeader
        title="设置"
        lead="工具剪枝和循环守卫默认开启。在这两个默认值下，插件只在某一轮出现循环迹象时才会调用模型：即裁判，以及它发现该轮卡住时写下的重定向。"
      />

      <div className="prose">
        <h2 id="defaults">默认状态</h2>
        <p>
          微技能默认关闭，因为它的提议器会增加模型调用，而它能省下多少，取决于仓库以及你在那里做的工作。每种机制都有自己的开关（
          <code>microskills</code>、<code>toolprune</code>、<code>loopguard</code>），取值为{' '}
          <code>on</code> 或 <code>off</code>，而下表的斜体字母就是这些设置。
        </p>

        <h2 id="table">九项设置</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: 58 }}>字母</th>
              <th>设置</th>
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

        <h2 id="set">用 config set 修改</h2>
        <p>下面以 Claude Code 的写法展示；其他智能体的输入方式见「日常命令」。</p>
        <CodeBlock code={setExamples} label="Claude Code" />
        <p>
          除了 <code>on</code> 和 <code>off</code>，还有两种有用的模式：<code>toolprune=propose</code>{' '}
          只提议拒绝列表，在你运行 <code>toolprune apply</code> 之前什么都不改变；
          <code>microskills=envfacts</code> 只从反复出现的失败中学习事实，不进行任何模型调用。
        </p>

        <h2 id="prune-patience">剪枝为什么要等</h2>
        <p>
          工具剪枝统计提示数，以便长会话权重更大，并且要求 m 个会话，使得单个会话永远无法独自决定。它只在你在该仓库的会话空闲了 q
          分钟后（最迟在列表形成后一天）才写出拒绝列表：因为工具变化后恢复的对话必须把它整段历史重新写入提示缓存，而不是读取它，而空闲一小时后那份缓存本来也已过期。
        </p>

        <h2 id="env">改变单次会话</h2>
        <p>要改变单次会话，可在启动智能体时设置一个环境变量。</p>
        <CodeBlock code={envExamples} label="环境变量" />
        <p>
          每一项设置及其默认值都列在{' '}
          <a href={`${REPO}/blob/main/plugin/README.md#settings`}>plugin/README.md 的 Settings 一节</a>
          ；每一项的环境变量名都是 <code>TE_</code> 加上其大写名称。
        </p>
      </div>

      <DocPager current="/docs/settings" />
    </>
  )
}
