import { createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO } from '../data/content'

export const Route = createFileRoute('/docs/plugin-internals')({
  head: () =>
    pageHead(
      '插件验证与状态隐私',
      'TokenEconomizer 在五种编码智能体上的真机验证细节、提示缓存（Prompt Caching）前缀一致性保护、按提示计数消融实验、本地状态归并规则与隐私安全边界。',
    ),
  component: PluginInternalsPage,
})

const toc = [
  { id: 'verified', label: '各智能体实测验证' },
  { id: 'caching', label: '提示缓存（Prompt Caching）保护' },
  { id: 'prompts-vs-sessions', label: '按提示计数 vs 按会话计数' },
  { id: 'test-runner', label: '测试运行器状态识别' },
  { id: 'state-privacy', label: '状态归并、目录识别与隐私' },
  { id: 'limitations', label: '已知限制' },
]

function PluginInternalsPage() {
  return (
    <>
      <DocHeader
        title="插件验证与状态隐私"
        lead="每个编码智能体的钩子协议、配置文件作用范围、会话恢复机制与日志格式各不相同。本页记录了插件在各智能体上的端到端真机验证结论、提示缓存（Prompt Caching）前缀保护机制，以及本地状态与隐私安全设计。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="verified">各智能体实测验证</h2>
        <p>
          插件不假设文档与实际行为一致，每一项关键能力均在真实智能体版本上通过本地拦截或端到端会话验证：
        </p>

        <h3>Claude Code（验证版本 2.1.286 – 2.1.310）</h3>
        <ul>
          <li>
            <strong>上下文与同轮重定向</strong>：<code>SessionStart</code> 与 <code>PostToolUse</code> 返回的{' '}
            <code>additionalContext</code> 均被证实可在当前轮次内直接送达模型，无需重启会话。
          </li>
          <li>
            <strong>工具拒绝列表的作用位置</strong>：插件自身的 <code>settings.json</code> 无法承载工具拒绝规则；只有写入项目本地的{' '}
            <code>.claude/settings.local.json</code> 中的裸名称 <code>permissions.deny</code> 规则，才能真正把工具从会话加载列表中移除（效果与启动参数{' '}
            <code>--disallowed-tools</code> 完全一致）。
          </li>
          <li>
            <strong>失败工具调用的独立事件</strong>：当工具执行失败时，Claude Code 触发的是{' '}
            <code>PostToolUseFailure</code> 而非 <code>PostToolUse</code>，且要求钩子返回对象中显式声明该事件名；同时由于 Claude Code 平时将插件单行消息隐藏在详细记录（Ctrl+O）中，当某轮在重定向后仍然卡住时，插件会额外通过上下文请求 Claude 在回复开头原样复述停止提示。
          </li>
          <li>
            <strong>账本去重与子智能体统计</strong>：交互式日志会按内容块（content block）重复记录同一条助手消息的 token 用量，插件账本按{' '}
            <code>message.id</code> 严格去重，并自动合并 <code>&lt;session&gt;/subagents/</code> 下的子智能体开销。
          </li>
        </ul>

        <h3>Codex（验证版本 0.153.1 – 0.164.0）</h3>
        <ul>
          <li>
            <strong>信任门控与事件命名</strong>：Codex 的钩子受信任门控保护（需在首次启动或 <code>/hooks</code> 中批准），且事件名必须采用 PascalCase。由于钩子会继承父进程环境变量（例如从 Claude Code 终端里启动 Codex 时会继承{' '}
            <code>CLAUDE_*</code>），插件一律根据载荷结构（如是否存在 <code>turn_id</code>）而非环境变量来识别宿主智能体。
          </li>
          <li>
            <strong>Code Mode 下的能力包剪枝</strong>：Codex 在 Code Mode 下通过单一 <code>exec</code> 工具暴露内嵌能力说明，因此工具剪枝针对的是能力包（
            <code>collaboration</code> 子智能体、<code>goals</code> 目标管理、<code>image_media</code> 图像查看）。这些开关写入项目本地的{' '}
            <code>.codex/config.toml</code>（每条带 <code># tokeneconomizer:&lt;capability&gt;</code> 标记），且 Codex 仅在<strong>已信任（trusted）</strong>的项目目录中读取该文件。
          </li>
          <li>
            <strong>命令技能命名</strong>：Codex 会将插件技能挂载在插件命名空间下，因此必须输入完整名称{' '}
            <code>$tokeneconomizer:status</code>、<code>$tokeneconomizer:config</code> 等，而不能靠自然语言提问（实测自然语言提问时模型往往直接去读状态文件，而不执行插件脚本）。
          </li>
        </ul>

        <h3>GitHub Copilot CLI（验证版本 1.0.83 – 1.0.102）</h3>
        <ul>
          <li>
            <strong>双清单分流与顶层上下文</strong>：当仓库同时存在 <code>.github/plugin/plugin.json</code> 与{' '}
            <code>.claude-plugin/plugin.json</code> 时，Copilot 优先读取前者，从而加载专属的{' '}
            <code>hooks/copilot-hooks.json</code>。上下文必须放在顶层 <code>additionalContext</code> 字段才能送达模型（嵌套在{' '}
            <code>hookSpecificOutput</code> 中会被忽略）。
          </li>
          <li>
            <strong>TUI 状态行播报</strong>：Copilot 交互式终端界面从不展示 <code>systemMessage</code> 字段；插件通过在最终 JSON 之前先打印一行{' '}
            <code>{`{"type": "progress", "message": "…"}`}</code>，使其在 TUI 中作为状态行正常显示。
          </li>
          <li>
            <strong>MCP 服务器级剪枝</strong>：Copilot 的 <code>permissions.deny</code> 只拦截调用而不移除工具定义；唯一能真正从请求中剔除工具定义的是{' '}
            <code>.github/copilot/settings.local.json</code> 中的 <code>disabledMcpServers</code>（需文件夹已加入{' '}
            <code>trustedFolders</code>）。因此当某个 MCP 服务器下的<strong>所有工具</strong>均长期未用时，插件才会提议关闭该服务器。
          </li>
        </ul>

        <h3>Pi（验证版本 0.99.2、1.2.0 – 1.3.0）与 opencode（1.19.5、2.2.0）</h3>
        <ul>
          <li>
            <strong>Pi 扩展桥接</strong>：<code>plugin/pi/tokeneconomizer.ts</code> 将 Pi 的五个生命周期事件（
            <code>session_start</code>、<code>before_agent_start</code>、<code>tool_result</code>、
            <code>agent_end</code>、<code>session_shutdown</code>）转为 <code>te-hook --host pi</code> 调用，并通过系统提示词的{' '}
            <code>&lt;tokeneconomizer&gt;</code> 段落注入微技能，通过 <code>deliverAs: "steer"</code> 消息在轮中注入循环守卫重定向。
          </li>
          <li>
            <strong>opencode 双版本兼容</strong>：单文件插件同时导出 1.x 的 <code>server</code> 入口与 2.x 的{' '}
            <code>setup</code> 入口；侧调用在禁用 <code>bash</code>、<code>edit</code>、<code>webfetch</code> 与{' '}
            <code>websearch</code> 的只读无插件模式下运行，结束后自动清理临时会话。
          </li>
        </ul>

        <h2 id="caching">提示缓存（Prompt Caching）保护</h2>
        <p>
          大模型 API 的提示缓存严格匹配请求的前缀顺序：<strong>工具定义列表 → 系统提示词 → 按时间顺序排列的对话历史</strong>。插件的任何动作如果改动了正在使用或即将恢复的会话前缀，都会导致整段历史缓存失效、重新按写入计费。为此，插件设计了三道缓存保护机制：
        </p>
        <ol>
          <li>
            <strong>运行中会话绝不中途改前缀</strong>：微技能事实块在会话归档时预先渲染并固定，仅在会话启动时注入一次；循环守卫的重定向与提示则始终附在最新的工具结果之后，绝不触碰历史前缀。
          </li>
          <li>
            <strong>工具剪枝的 60 分钟空闲等待窗口</strong>：实测发现，当用户使用 <code>claude --continue</code>、
            <code>codex exec resume --last</code> 或 <code>copilot --continue</code> 恢复一段刚结束不久的对话时，智能体会用<strong>当前最新的工具列表</strong>搭配旧对话历史发送请求。如果会话刚结束就立刻修改本地工具配置，用户一恢复对话就会丢失整段热缓存。因此，自动剪枝（
            <code>toolprune=auto</code>）会将新生成的拒绝列表暂存为 pending，交由后台进程在仓库所有会话<strong>空闲满 60 分钟</strong>（此时 API 端的提示缓存本就已自然过期）后再写入配置文件。
          </li>
          <li>
            <strong>恢复会话时字节级重放初始事实</strong>：Claude Code 与 Codex 在恢复会话时会从自身日志重放启动时的上下文；而 Copilot 与 Pi 则会重新组装首条消息或系统提示词。插件为此专门记录了每个会话启动时注入的精确文本，当检测到 Copilot 或 Pi 恢复旧会话时，原封不动地交还当年那份事实文本（即便磁盘上的事实后来已更新或退役），确保缓存前缀字节级一致。
          </li>
        </ol>

        <h2 id="prompts-vs-sessions">按提示计数 vs 按会话计数</h2>
        <p>
          在真实开发机器上回放 12 个项目、61 场 Claude Code 会话（共 893 条用户提示）的实验表明，三种机制适合不同的计数粒度：
        </p>

        <table>
          <thead>
            <tr>
              <th>工具剪枝规则</th>
              <th className="r">形成列表的项目数</th>
              <th className="r">误剪工具数（后续会话又用到）</th>
              <th className="r">累计排除的工具定义数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>满 5 个会话未使用（早期纯会话规则）</td>
              <td className="mono" style={{ textAlign: 'right' }}>7</td>
              <td className="mono good" style={{ textAlign: 'right' }}>1</td>
              <td className="mono" style={{ textAlign: 'right' }}>340</td>
            </tr>
            <tr>
              <td>
                <strong>横跨 ≥2 个会话且满 10 次提示，或满 5 个会话（当前默认）</strong>
              </td>
              <td className="mono" style={{ textAlign: 'right' }}>8</td>
              <td className="mono good" style={{ textAlign: 'right' }}>1</td>
              <td className="mono good" style={{ textAlign: 'right' }}>512</td>
            </tr>
            <tr>
              <td>仅满 10 次提示（不要求跨会话，m = 1）</td>
              <td className="mono" style={{ textAlign: 'right' }}>8</td>
              <td className="mono bad" style={{ textAlign: 'right' }}>7</td>
              <td className="mono" style={{ textAlign: 'right' }}>628</td>
            </tr>
          </tbody>
        </table>

        <p>
          可以看到，如果允许单场长会话里的 10 次提示直接决定剪枝（<code>m = 1</code>），会把下一场会话就要用到的子智能体与连接器工具误剪掉（误剪从 1 次暴增到 7 次）；而要求<strong>至少横跨 2 个会话且满 10 次提示</strong>（并以 5 个单提示短会话作为兜底），既保持了极低的误剪率（仅 1 次），又把排除的无效工具数提升了 50%。相反，微技能必须按「会话」而非按「提示」统计，因为同一个会话一旦在首条提示踩坑并试出正确命令，后续提示自然会沿用对话历史里的正确写法。
        </p>

        <h2 id="test-runner">测试运行器状态识别</h2>
        <p>
          循环守卫需要判断一轮在最后一次代码编辑后是否通过了验证检查（ended green）。然而在复合 Shell 命令中，命令行的退出码往往属于最后一条管道或后续命令：例如{' '}
          <code>npm test 2&gt;&amp;1 | tail -n 8</code> 的退出码来自 <code>tail</code>（恒为 0），
          <code>npm test || true</code> 与 <code>pytest -q; git diff</code> 同样会掩盖测试本身的成败。
        </p>
        <p>
          为此，<code>loopguard.turn.runner_verdict</code> 会直接解析主流测试框架的汇总输出行（覆盖{' '}
          <code>pytest</code>、<code>unittest</code>、TAP、<code>jest</code>、<code>mocha</code>、Go test、
          <code>cargo test</code>、<code>rspec</code> 与 JUnit）。在 22,675 场录制的 SWE-Bench 会话上回放验证，各智能体轮次的正常结束率分别为 85.6%（Claude Code）、84.5%（Copilot）与 87.8%（Codex），而触发裁判门控的比例仅为 18.1%、15.8% 与 5.8%。
        </p>

        <h2 id="state-privacy">状态归并、目录识别与隐私</h2>
        <p>
          插件的所有持久化数据都存放在本地 <code>$TOKENECONOMIZER_HOME</code>（默认为{' '}
          <code>~/.tokeneconomizer</code>），按仓库与宿主智能体分目录保存：包含各机制的状态文件、
          <code>ledger.jsonl</code>（每场会话一条计价账单）与 <code>events.jsonl</code>（每次注入、重定向与停止提示记录）。
        </p>
        <ul>
          <li>
            <strong>同一远端共享经验</strong>：带有 <code>origin</code> 远端的 git 检出目录统一按远端 URL 归并身份，因此同一个仓库的多个克隆目录、子目录与{' '}
            <code>git worktree</code> 自动共享学到的微技能、剪枝证据与包络；而工具剪枝写入的本地设置文件则按各自的检出路径独立记录在{' '}
            <code>untool_applied.json</code> 中。向上查找 <code>.git</code> 的过程会在用户主目录 <code>~</code> 封顶，并遵循{' '}
            <code>GIT_CEILING_DIRECTORIES</code>。
          </li>
          <li>
            <strong>严格的本地权限与脱敏摘要</strong>：状态目录以 <code>0700</code> 创建、内部文件以{' '}
            <code>0600</code> 创建。唯一离开本机的流量是经由你自己的智能体 CLI 发起的裁判与提议器调用，且发送的仅是<strong>脱敏摘要（digests）</strong>——命令模板、被编辑文件的基本文件名、隐去路径与行号数字的归一化报错行，<strong>绝不包含任何源代码文件内容</strong>。
          </li>
          <li>
            <strong>符号链接与防篡改保护</strong>：拒绝列表写入器拒绝穿过任何指向仓库外部的符号链接，也拒绝覆盖任何无法正常解析的已有配置文件；在你不信任的第三方仓库中，建议保持微技能默认关闭或仅使用{' '}
            <code>microskills=envfacts</code>（仅填充固定命令模板，防止恶意仓库通过命令输出构造提示注入）。
          </li>
        </ul>

        <h2 id="limitations">已知限制</h2>
        <ul>
          <li>
            <strong>Copilot CLI 粒度限制</strong>：目前仅支持關閉整个未使用的 MCP 服务器，单工具级持久化过滤需等待 Copilot CLI 自身提供相应配置项。
          </li>
          <li>
            <strong>无头模式下的提示可见性</strong>：<code>codex exec</code> 不打印任何钩子消息，因此无头运行时的卡死提示只能在运行结束后通过{' '}
            <code>te status</code> 查看计数。
          </li>
          <li>
            <strong>经由脚本间接启动的测试</strong>：如果测试被封装在自定义 Shell 脚本内部且未输出标准测试框架汇总行，守卫可能无法将其识别为验证步骤。
          </li>
          <li>
            <strong>工具目录需在更新后刷新一次</strong>：在 Claude Code 与 Copilot CLI 上，首次安装及每次升级智能体后需手动运行一次{' '}
            <code>toolprune refresh-catalog</code>，以便记录默认全量加载的工具清单。
          </li>
        </ul>

        <p>
          完整的逐版本实测日志可参阅上游仓库的{' '}
          <a href={`${REPO}/blob/main/docs/PLUGIN.md`} target="_blank" rel="noreferrer">
            docs/PLUGIN.md
          </a>
          。
        </p>
      </div>

      <DocPager current="/docs/plugin-internals" />
    </>
  )
}

