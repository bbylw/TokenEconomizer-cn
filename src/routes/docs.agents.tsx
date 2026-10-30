import { createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager } from '../components/DocParts'
import { REPO, pruneTargets, stuck } from '../data/content'

export const Route = createFileRoute('/docs/agents')({
  component: AgentsPage,
})

function AgentsPage() {
  return (
    <>
      <DocHeader
        title="各智能体上的行为"
        lead="微技能和循环守卫在每个智能体上的工作方式相同。每个智能体各自学习：事实、工具证据，以及循环守卫对「通常一轮」的感知，都按智能体和仓库分别保存，而设置是共享的。"
      />

      <div className="prose">
        <h2 id="prune">工具剪枝排除什么</h2>
        <p>
          工具剪枝通过每个智能体自身的设置起作用，因此它能排除的东西各不相同：
        </p>
        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>排除的对象</th>
              <th>写入位置</th>
            </tr>
          </thead>
          <tbody>
            {pruneTargets.map((p) => (
              <tr key={p.agent}>
                <td>{p.agent}</td>
                <td>{p.target}</td>
                <td>
                  <code>{p.where}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          工具剪枝只添加它自己的条目，绝不动你写的拒绝规则；它创建的配置文件会被排除在 git 之外（
          <code>.git/info/exclude</code>）。在 Claude Code 上，说明它排除了哪些东西的「会话起始行」只显示在详细记录（
          <strong>Ctrl+O</strong>）中，因此请用 <code>/tokeneconomizer:toolprune</code> 查看。
          <code>toolprune restore</code>{' '}
          只移除插件的条目，不动其他东西，而你归还的工具不会再被移除。
        </p>
        <p>
          如果插件无法安全地编辑某个文件（你的仓库提交的 <code>.codex/config.toml</code>、不是合法 JSON
          的配置文件、指向仓库之外的符号链接），该列表会保持为「提议」状态，会话起始处会说明原因；
          <code>toolprune apply</code> 会再试一次。
        </p>

        <h2 id="stuck">当某一轮卡住时</h2>
        <p>
          循环守卫首先学习这个仓库里的一轮通常要跑多久：它会等到此处有 e 轮「正常结束」——即自行结束，且最后一次编辑后没有失败的检查。此后，出现循环迹象（同样的失败反复出现，或错误不断堆积）的一轮会被送交裁判。有一种情况无需裁判即可重定向：某一轮在反复空转同样的编辑、撞上同样的失败时，运行长度超过了通常长度的
          b 倍。
        </p>
        <p>如果一轮在重定向之后仍然卡住，你会看到一行以「如何停下它」结尾的提示：</p>
        <blockquote>
          TokenEconomizer：这一轮在重定向之后看起来仍然卡住（judge-stuck@0.82，46 次工具调用）。按 Esc 中断它。
        </blockquote>
        <p>这行出现在哪里、以及如何停下这一轮，在终端 UI 与无头运行中分别如下。</p>

        <table>
          <thead>
            <tr>
              <th>智能体</th>
              <th>交互模式：出现在哪里</th>
              <th>如何停止</th>
              <th>无头模式：出现在哪里</th>
              <th>如何停止</th>
            </tr>
          </thead>
          <tbody>
            {stuck.map((s) => (
              <tr key={s.agent}>
                <td>{s.agent}</td>
                <td>{s.ui}</td>
                <td>{s.uiStop}</td>
                <td>{s.headless}</td>
                <td>{s.headlessStop}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          无头运行指 <code>claude -p</code>、<code>codex exec</code>、<code>copilot -p</code>、
          <code>pi -p</code>、<code>opencode run</code>。
        </p>

        <ul>
          <li>
            <strong>Claude Code</strong> 只在详细记录（Ctrl+O）中显示插件自己的行，因此插件会让 Claude
            在回复里把这行再说一遍；模型表述可能不同，也可能略过。
          </li>
          <li>
            <strong>Codex</strong>：Esc 会中断这一轮，但它启动的命令会一直运行到 <code>/stop</code>。
            <code>codex exec</code> 不打印任何钩子消息。
          </li>
          <li>
            <strong>Pi</strong>：Ctrl+C 会结束无头运行，但它启动的命令会一直跑到结束。
          </li>
          <li>
            <strong>opencode</strong> 2.x 会把这行打印到 opencode 服务器的错误输出，而不在其终端 UI 中。
          </li>
        </ul>

        <p>
          在无头运行中可能无人盯着，因此被标记的一轮会一直跑到结束或触及智能体自身的限制；之后，
          <code>te status</code> 会统计重定向与「仍然卡住」的提示。
        </p>

        <p>
          <a href={`${REPO}/blob/main/docs/PLUGIN.md`}>docs/PLUGIN.md</a>{' '}
          记录了每个智能体的钩子与设置是如何被验证行为的，
          <a href={`${REPO}/blob/main/docs/ARCHITECTURE.md`}>docs/ARCHITECTURE.md</a>{' '}
          则记录了整个包是如何组合在一起的。
        </p>
      </div>

      <DocPager current="/docs/agents" />
    </>
  )
}
