import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager } from '../components/DocParts'
import { REPO, repoTree } from '../data/content'

export const Route = createFileRoute('/docs/repo')({
  component: RepoPage,
})

const buildCmds = `# 运行包与插件的离线测试
python -m pytest tests

# 加上基准侧的实验测试
python -m pytest tests experiments/tests

# 构建一个自包含的插件包
python3 scripts/build_plugin.py --out dist/marketplace`

function RepoPage() {
  return (
    <>
      <DocHeader
        title="仓库结构"
        lead="这个包仅依赖标准库。测试、构建与实验复现都在同一个仓库里，下面按目录说明各自负责什么。"
      />

      <div className="prose">
        <h2 id="tree">目录</h2>
        <table>
          <thead>
            <tr>
              <th>路径</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            {repoTree.map((r) => (
              <tr key={r.path}>
                <td>
                  <a href={`${REPO}/tree/main/${r.path}`}>
                    <code>{r.path}</code>
                  </a>
                </td>
                <td>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="build">测试与构建</h2>
        <p>
          用 <code>python -m pytest tests</code> 运行测试（加上 <code>experiments/tests</code>{' '}
          可覆盖基准侧），并用 <code>python3 scripts/build_plugin.py --out dist/marketplace</code>{' '}
          构建一个自包含的插件包。
        </p>
        <CodeBlock code={buildCmds} label="shell" />

        <h2 id="experiments">复现实验</h2>
        <p>
          论文结果背后的代码——一个在 SWE-Bench 与 Web-Bench 上运行 Claude Code、Codex 和 Copilot CLI
          的框架、各启动器，以及被评估的任务集——都位于{' '}
          <a href={`${REPO}/blob/main/experiments/README.md`}>experiments/</a>
          ，其 README 给出了配置说明，以及每个结果对应的一条命令。
        </p>
        <p>
          它不属于已安装的插件；两者只共享 <code>tokeneconomizer/</code>。
        </p>

        <div className="callout">
          <b>读代码的顺序。</b> 先看 <code>tokeneconomizer/trace</code>（各智能体的日志如何被读成统一形态），再看三个机制目录，最后看{' '}
          <code>plugin</code>（钩子与 <code>te</code> 命令的运行时）。
        </div>
      </div>

      <DocPager current="/docs/repo" />
    </>
  )
}
