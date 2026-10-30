import { Link, createFileRoute } from '@tanstack/react-router'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO, expVsPlugin, hookLifecycle } from '../data/content'

export const Route = createFileRoute('/docs/architecture')({
  head: () =>
    pageHead(
      '架构与接口设计',
      'TokenEconomizer 标准库包的四大抽象接口、插件与基准测试两条调用链路、六个生命周期钩子拆解，以及插件与论文实验设置的差异对照。',
    ),
  component: ArchitecturePage,
})

const toc = [
  { id: 'interfaces', label: '四个核心接口' },
  { id: 'callers', label: '两条调用链路' },
  { id: 'hooks', label: '六个生命周期钩子' },
  { id: 'diff', label: '与论文实验设置的差异' },
]

function ArchitecturePage() {
  return (
    <>
      <DocHeader
        title="架构与接口设计"
        lead="微技能、工具剪枝与失败循环干预这三种核心机制，本身既不知道自己跑在哪个编码智能体上，也不知道评测框架或任务领域是什么。所有与智能体、宿主环境或领域相关的差异，全部收敛在纯标准库包 tokeneconomizer 的四个轻量接口中。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="interfaces">四个核心接口</h2>
        <p>
          <code>tokeneconomizer</code> 包不依赖任何第三方库。要接入一个新的智能体或一个新的任务领域，只需要实现下列四个边界之一，无需改动任何机制本身的代码：
        </p>

        <ul>
          <li>
            <strong>会话轨迹读取层（<code>tokeneconomizer.trace</code>）</strong>：唯一负责读取已保存会话日志的模块（暴露{' '}
            <code>load_trajectory</code>、<code>call_cwds</code>、<code>tool_usage</code> 与{' '}
            <code>parse_catalog</code>），每种智能体的日志格式对应其中一个子模块。要支持一个新的编码智能体，只需在这里新增一个读取器，其余代码无需改动。
          </li>
          <li>
            <strong>统一账本与计价层（<code>tokeneconomizer.ledger</code> 与 <code>tokeneconomizer.pricing</code>）</strong>：全项目对「成本」的唯一定义。各机制在此记录自己每次任务的额外开销（在插件中，一次会话算作一个任务）；插件的会话账本与实验的汇总脚本都通过同一组模块读回数据，从而保证记录成本与报告成本绝不发生漂移。
          </li>
          <li>
            <strong>领域适配器（<code>tokeneconomizer.domain.DomainAdapter</code>）</strong>：面向任务领域的接口，负责定义如何读取会话、工具剪枝应当保护或直接排除哪些工具、如何从轨迹中提取循环信号、传给可选裁判模型的任务文本，以及微技能的领域词表。插件使用的是{' '}
            <code>tokeneconomizer.plugin.adapter.LiveAdapter</code>；论文基准测试的适配器（SWE-Bench、Web-Bench、CredData、ReposVul）则位于{' '}
            <code>experiments/te_bench/adapters/</code>。
          </li>
          <li>
            <strong>阶段生命周期接口（<code>tokeneconomizer.stage.Stage</code>）</strong>：每种机制向调用方暴露的统一四阶段钩子集合：
            <code>before_task</code>、<code>build_tools</code>、<code>run_kwargs</code> 与{' '}
            <code>after_task</code>。
          </li>
        </ul>

        <h2 id="callers">两条调用链路</h2>
        <p>
          共有两个调用方负责驱动上述 Stage，而核心机制模块绝不反向导入这两个调用方中的任何一个：
        </p>
        <ul>
          <li>
            <strong>日常插件运行时（<code>tokeneconomizer.plugin</code>）</strong>：通过各智能体暴露的钩子（Pi 上为扩展事件），在开发者的日常会话中运行这些机制。每次会话结束时，在后台对完整会话日志运行{' '}
            <code>PrefixStage</code>（微技能）与 <code>ToolingStage</code>（工具剪枝）；而在会话进行中，每次工具调用都会实时驱动{' '}
            <code>loopguard.TurnGuard</code>（循环守卫）。
          </li>
          <li>
            <strong>论文基准评估框架（<code>experiments/te_bench</code>）</strong>：在基准任务流上顺序运行三大机制。
            <code>Economizer</code> 门面类将三个 Stage 围绕同一个领域适配器组装起来；
            <code>te_bench.runner.AgentRunner</code> 定义了任务执行容器（Docker、智能体 CLI、评分器）的抽象接口，论文实际使用的实现位于{' '}
            <code>experiments/te_harness</code>。仅用于基准测试的控制器（如 <code>SpiralStage</code>、流式{' '}
            <code>NudgeGuard</code> 以及 Codex 终止策略）也存放在该目录中。
          </li>
        </ul>

        <div className="callout cool">
          <b>架构边界由测试强制锁定。</b> <code>tests/test_plugin_package.py</code> 静态断言了两条铁律：三大核心机制模块绝不导入{' '}
          <code>tokeneconomizer.plugin</code>，且 <code>tokeneconomizer/</code> 下的任何代码绝不导入{' '}
          <code>experiments/</code>。
        </div>

        <h2 id="hooks">六个生命周期钩子</h2>
        <p>
          在插件模式下，六个标准钩子把三大机制串联进智能体的日常会话。每一个钩子都遵循<strong>故障开放（fail-open）</strong>原则：任何异常都会退化为空输出（不对会话做任何改动），并将完整回溯写入{' '}
          <code>~/.tokeneconomizer/errors.log</code>。钩子进程仅使用 Python 标准库，且<strong>绝不阻塞等待任何模型调用</strong>。
        </p>

        <table>
          <thead>
            <tr>
              <th style={{ width: 170 }}>钩子事件</th>
              <th style={{ width: 150 }}>驱动的机制</th>
              <th>插件在该钩子中执行的动作</th>
            </tr>
          </thead>
          <tbody>
            {hookLifecycle.map((h) => (
              <tr key={h.hook}>
                <td>
                  <code>{h.hook}</code>
                </td>
                <td>
                  <code>{h.mech}</code>
                </td>
                <td>{h.what}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>插件运行时的三处针对性增强</h3>
        <p>
          后台归档进程 <code>te fold</code> 与轮次守卫 <code>TurnGuard</code> 复用了论文实验中的同一套核心类（
          <code>PrefixStage</code>、<code>ToolingStage</code>、<code>SpiralState.update</code>、
          <code>assess_abort</code> 等），所有默认阈值均未重新调参，但针对真实交互式场景做了三项关键适配：
        </p>
        <ol>
          <li>
            <strong>识别经由 Shell 命令完成的源码编辑</strong>：除了专用的 Edit 工具外，守卫还会统计通过{' '}
            <code>sed -i</code>、<code>perl -pi</code>、重定向或 <code>tee</code> 写入源文件、内联 Python 脚本写回文件、
            <code>patch</code> / <code>git apply</code>，以及 Codex 的{' '}
            <code>{"apply_patch <<'PATCH'"}</code> 所做的修改。若不计入这些操作，全程通过 Bash 改代码的智能体会被误认为「从未编辑过文件」。
          </li>
          <li>
            <strong>确保重定向永远先于「仍然卡住」提示触发</strong>：基准测试中的任务流很长，学习到的包络（envelope）很大，因此硬兜底线（默认 2.5 倍包络）总在卡死规则底线（默认 20 次调用）之后才触发。而在交互式仓库中，平时的一轮往往很短，学习到的包络较小，2.5 倍包络可能落在 20 次调用以内。为此，插件强制保证：只要本轮还有未使用的重定向配额，第一次触发卡死判定时必定先发送重定向，唯有重定向之后的第二个卡死片段才会向用户发出停止提示。
          </li>
          <li>
            <strong>裁判与重定向生成脱离钩子异步执行</strong>：卡死裁判与重定向文本生成运行在独立的后台进程{' '}
            <code>te judge</code> 中，而非阻塞在钩子内部。当前 <code>PostToolUse</code> 仅负责启动后台任务并立即返回；待后续工具调用触发{' '}
            <code>PostToolUse</code> 时，再拾取已生成的裁决与重定向文本并注入上下文。
          </li>
        </ol>

        <h2 id="diff">与论文实验设置的差异</h2>
        <p>
          自主连续运行的基准测试与人类开发者的日常交互会话在工作方式上存在本质差异。下表总结了插件相比论文实验设置所做的八项调整及其设计原因：
        </p>

        <table>
          <thead>
            <tr>
              <th style={{ width: 120 }}>维度</th>
              <th>论文实验（Experiments）</th>
              <th>日常插件（Plugin）</th>
              <th>为什么这样设计</th>
            </tr>
          </thead>
          <tbody>
            {expVsPlugin.map((row) => (
              <tr key={row.dim}>
                <td>
                  <strong>{row.dim}</strong>
                </td>
                <td>{row.exp}</td>
                <td>{row.plugin}</td>
                <td>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          关于各智能体钩子行为的实测细节与缓存保护验证，请继续阅读下一节{' '}
          <Link to="/docs/plugin-internals">插件验证与状态隐私</Link>；原始英文设计文档见仓库中的{' '}
          <a href={`${REPO}/blob/main/docs/ARCHITECTURE.md`} target="_blank" rel="noreferrer">
            docs/ARCHITECTURE.md
          </a>{' '}
          与{' '}
          <a href={`${REPO}/blob/main/docs/PLUGIN.md`} target="_blank" rel="noreferrer">
            docs/PLUGIN.md
          </a>
          。
        </p>
      </div>

      <DocPager current="/docs/architecture" />
    </>
  )
}

