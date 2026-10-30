import { Link, createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO, experimentArms } from '../data/content'

export const Route = createFileRoute('/docs/experiments')({
  head: () =>
    pageHead(
      '复现论文实验',
      '复现 TokenEconomizer 论文在 SWE-Bench（277 任务）与 Web-Bench（102 任务）上的全部实验结果：环境准备、5 步配置、实验组启动脚本与结果对比。',
    ),
  component: ExperimentsPage,
})

const toc = [
  { id: 'overview', label: '目录分工' },
  { id: 'requirements', label: '环境要求' },
  { id: 'setup', label: '五步环境配置' },
  { id: 'run', label: '运行论文实验组' },
  { id: 'results', label: '结果汇总与对比' },
]

const cliInstallCmds = `curl -fsSL https://claude.ai/install.sh | bash -s 2.1.170          # Claude Code
npm install -g @openai/codex@0.153.1                                 # Codex
curl -fsSL https://gh.io/copilot-install | VERSION=1.0.84-7 bash     # Copilot CLI`

const step1Cmds = `git clone https://github.com/microsoft/TokenEconomizer.git && cd TokenEconomizer
python3 -m venv .venv && . .venv/bin/activate
pip install -e '.[test,baselines]'        # baselines 会安装 aider，供 RepoMap 对照组使用
cd experiments
python -m pytest tests -q
bash scripts/launch/smoke_test.sh         # 使用桩智能体（stub agent）端到端验证所有实验组接线`

const step2Cmds = `export DATA="$(readlink -f ~/te_data)"
git clone https://github.com/SWE-bench/SWE-bench.git "$DATA/SWE-bench"
pip install -e "$DATA/SWE-bench"          # 将官方评分器安装到当前虚拟环境
python scripts/export_swebench_tasks.py --out-dir "$DATA/swebench"
docker login                              # 匿名拉取镜像会触发速率限制
xargs -a "$DATA/swebench/image_tags.txt" -P 4 -n 1 docker pull -q`

const step3Cmds = `git clone https://github.com/bytedance/web-bench.git "$DATA/web-bench"
( cd "$DATA/web-bench" && npm install -g @microsoft/rush && rush install \\
  && rush build --to @web-bench/eval --to @web-bench/calculator --to @web-bench/expressjs \\
                --to @web-bench/react --to @web-bench/zustand --to @web-bench/table \\
  && cd projects/calculator && npx playwright install chromium chromium-headless-shell )
export TOKENECONOMIZER_WEBBENCH_PROJECTS="$DATA/web-bench/projects"
export TOKENECONOMIZER_WEBBENCH_TASKS="$DATA/webbench_tasks.json"
python scripts/webbench_tasks_from_yaml.py --all    # zustand 项目仅自带 tasks.yml
python scripts/export_webbench_tasks.py`

const step5Cmds = `AGENT=claude MODEL=claude-sonnet-5 DOMAIN=swebench ARMS=baseline REPOS=sympy/sympy SEEDS=0 \\
  LIMIT=1 DETACH=0 RUNNER=te_harness.swebench:make_runner bash scripts/launch/main_sweep.sh`

const sweCmds = `SWE="baseline baseline-medium baseline-low rtk repomap trimech trimech-rtk trimech-repomap"
for MODEL in claude-sonnet-5 claude-opus-4-8; do
  AGENT=claude MODEL=$MODEL DOMAIN=swebench ARMS="$SWE inject-only untool-only spiral-only" \\
    RUNNER=te_harness.swebench:make_runner bash scripts/launch/main_sweep.sh
done
AGENT=copilot MODEL=claude-sonnet-5 DOMAIN=swebench ARMS="$SWE" \\
  RUNNER=te_harness.swebench:make_runner bash scripts/launch/main_sweep.sh
for MODEL in gpt-5.6-terra gpt-5.6-sol; do
  MODEL=$MODEL DOMAIN=swebench \\
    ARMS="baseline baseline-medium baseline-low rtk repomap codex-trimech codex-trimech-rtk codex-trimech-repomap" \\
    RUNNER=te_harness.swebench:make_runner bash scripts/launch/codex_ab.sh
done`

const webCmds = `for MODEL in claude-sonnet-5 claude-opus-4-8; do
  AGENT=claude MODEL=$MODEL DOMAIN=webbench ARMS="baseline trimech-web" \\
    RUNNER=te_harness.webbench:make_runner bash scripts/launch/main_sweep.sh
done
AGENT=copilot MODEL=claude-sonnet-5 DOMAIN=webbench ARMS="baseline trimech-web" \\
  RUNNER=te_harness.webbench:make_runner bash scripts/launch/main_sweep.sh
for MODEL in gpt-5.6-terra gpt-5.6-sol; do
  MODEL=$MODEL DOMAIN=webbench ARMS="baseline codex-trimech" \\
    RUNNER=te_harness.webbench:make_runner bash scripts/launch/codex_ab.sh
done`

const compareCmd = `python scripts/compare_arms.py --baseline <tree>/baseline/<cell> --arm <tree>/<arm>/<cell>`

function ExperimentsPage() {
  return (
    <>
      <DocHeader
        title="复现论文实验"
        lead="仓库中的 experiments/ 目录包含了论文实测结果背后的完整评估框架、容器执行器、启动脚本与汇总分析工具。它独立于日常安装的插件，两者仅共享底层的 tokeneconomizer/ 标准库包。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="overview">目录分工</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: 160 }}>子目录</th>
              <th>职责说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>te_harness/</code>
              </td>
              <td>在每个 SWE-Bench 任务的 Docker 镜像内（Web-Bench 则在宿主机上）运行智能体 CLI，并调用基准自带的官方评分器进行判分</td>
            </tr>
            <tr>
              <td>
                <code>te_bench/</code>
              </td>
              <td>各实验组（arms）定义、基准领域适配器（adapters）以及被评估的任务集加载器（<code>workloads.py</code>）</td>
            </tr>
            <tr>
              <td>
                <code>scripts/</code>
              </td>
              <td>
                <code>launch/</code>（批量启动器）、<code>run_experiment.py</code>（单条任务流运行器）、
                <code>aggregate.py</code>（结果汇总）与 <code>compare_arms.py</code>（成对成本/通过率比较）
              </td>
            </tr>
            <tr>
              <td>
                <code>workloads/</code>
              </td>
              <td>
                被评估的任务 ID 清单：<code>swebench.json</code>（277 个任务）、
                <code>webbench.json</code>（102 个任务）以及两个安全审计任务集
              </td>
            </tr>
            <tr>
              <td>
                <code>tests/</code>
              </td>
              <td>无需 Docker、外部数据集或 API 密钥即可运行的离线单元测试</td>
            </tr>
          </tbody>
        </table>

        <h2 id="requirements">环境要求</h2>
        <ul>
          <li>
            <strong>操作系统与磁盘</strong>：Linux x86_64，配置好免 <code>sudo</code> 的 Docker，并预留约 200 GB 磁盘空间用于存放 SWE-Bench 任务镜像。
          </li>
          <li>
            <strong>基础工具链</strong>：Python 3.10+、git，以及带 npm 的 Node.js（供 Web-Bench 构建使用）。
          </li>
          <li>
            <strong>API 密钥</strong>：一个 Anthropic API Key（供 Claude Code 与 Copilot CLI 计费）和一个 OpenAI API Key（供 Codex 计费）。
          </li>
          <li>
            <strong>宿主机智能体 CLI</strong>：在宿主机上安装论文所使用的精确版本，评估框架会将它们挂载进每个任务容器中：
          </li>
        </ul>
        <CodeBlock code={cliInstallCmds} label="宿主机安装固定版本 CLI" />

        <h2 id="setup">五步环境配置</h2>

        <h3>1. 安装代码与运行离线测试</h3>
        <p>
          进入 <code>experiments</code> 目录后，后续所有命令都在该目录下执行：
        </p>
        <CodeBlock code={step1Cmds} label="步骤 1 · 安装与烟雾测试" />

        <h3>2. 准备 SWE-Bench 数据与镜像</h3>
        <p>
          请在仓库外部选择一个数据目录，并务必使用 <code>readlink -f</code> 解析出规范绝对路径（如果通过符号链接访问，Web-Bench 的所有测试都会失败）：
        </p>
        <CodeBlock code={step2Cmds} label="步骤 2 · 导出任务并拉取 277 个镜像" />

        <h3>3. 构建 Web-Bench 五个受测项目</h3>
        <p>
          拉取并构建评估所用的五个 Web-Bench 项目，同时安装它们锁定的 Playwright 浏览器内核：
        </p>
        <CodeBlock code={step3Cmds} label="步骤 3 · 构建 Web-Bench" />

        <h3>4. 配置 .env 密钥与路径</h3>
        <p>
          复制 <code>cp .env.example .env</code>，并填入展开后的绝对路径（<code>.env</code> 文件不支持变量展开）：
        </p>
        <table>
          <thead>
            <tr>
              <th>环境变量</th>
              <th>填写说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code>
              </td>
              <td>你自己的 Anthropic 与 OpenAI API 密钥</td>
            </tr>
            <tr>
              <td>
                <code>COPILOT_PROVIDER_API_KEY</code>
              </td>
              <td>再次填入你的 Anthropic 密钥（Copilot CLI 通过自带的 provider 设置直接向 Anthropic 计费）</td>
            </tr>
            <tr>
              <td>
                <code>DATA</code>
              </td>
              <td>步骤 2 中确定的规范数据目录绝对路径</td>
            </tr>
            <tr>
              <td>
                <code>TOKENECONOMIZER_RESULTS</code>
              </td>
              <td>实验结果输出目录，例如 <code>$DATA/results</code></td>
            </tr>
            <tr>
              <td>
                <code>TOKENECONOMIZER_SWEBENCH_TASKS</code>
              </td>
              <td>
                <code>$DATA/swebench/swebench_tasks.json</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>TE_SWEBENCH_REPO</code>
              </td>
              <td>
                <code>$DATA/SWE-bench</code>
              </td>
            </tr>
            <tr>
              <td>
                <code>TOKENECONOMIZER_WEBBENCH_PROJECTS</code>, <code>TOKENECONOMIZER_WEBBENCH_TASKS</code>
              </td>
              <td>与步骤 3 中导出的两个绝对路径一致</td>
            </tr>
          </tbody>
        </table>

        <h3>5. 单任务真机冒烟验证</h3>
        <p>
          在启动大规模全量实验前，先跑 1 个真实计费任务，确认能够产出包含评分的完整记录：
        </p>
        <CodeBlock code={step5Cmds} label="步骤 5 · 单任务验证" />
        <p>
          运行完成后，检查 <code>$TOKENECONOMIZER_RESULTS/claude_swebench_sonnet5/baseline/sympy_s0/</code> 下的{' '}
          <code>row.json</code>，应能看到大于 0 的 <code>num_turns</code>、非空的 token 统计以及{' '}
          <code>resolved</code> 布尔值。
        </p>

        <h2 id="run">运行论文实验组</h2>
        <p>
          <code>main_sweep.sh</code> 负责运行 Claude Code 与 Copilot CLI，<code>codex_ab.sh</code> 负责运行 Codex。每条命令代表一条实验通道（lane）：在所有受测仓库或项目上，使用随机种子 0、1、2 依次跑完列出的所有实验组（arms）。重复执行同一条命令会自动跳过已完成的单元（断点续跑）；加上{' '}
          <code>DRYRUN=1</code> 可仅打印执行计划。
        </p>

        <table>
          <thead>
            <tr>
              <th>代码中的 Arm 名称</th>
              <th>对应论文中的实验组</th>
            </tr>
          </thead>
          <tbody>
            {experimentArms.map((a) => (
              <tr key={a.arm}>
                <td>
                  <code>{a.arm}</code>
                </td>
                <td>{a.paper}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>SWE-Bench：复现论文表 1、图 1(b)、图 5 及表 2(a) 消融实验</h3>
        <CodeBlock code={sweCmds} label="SWE-Bench 全量启动脚本" />

        <h3>Web-Bench：复现论文表 2(b)</h3>
        <CodeBlock code={webCmds} label="Web-Bench 全量启动脚本" />

        <div className="callout">
          <b>防作弊答案守卫（Answer-key Guard）。</b> 包括 <code>baseline</code> 在内的所有实验组都运行在统一的防作弊守卫下：通过{' '}
          <code>PreToolUse</code> 钩子与容器内 <code>/etc/hosts</code> 屏蔽规则，禁止智能体直接从 GitHub 获取基准测试的公开答案，并移除联网工具。
        </div>

        <h2 id="results">结果汇总与对比</h2>
        <p>
          每条通道会将结果写入 <code>$TOKENECONOMIZER_RESULTS/&lt;agent&gt;_&lt;benchmark&gt;_&lt;model&gt;/</code>（例如{' '}
          <code>claude_swebench_sonnet5</code>），每个任务目录下包含 <code>row.json</code>、
          <code>transcript.jsonl</code> 与 <code>run_config.json</code>。通道结束时，<code>aggregate.py</code> 会自动生成{' '}
          <code>index/all_rows.csv</code> 与 <code>index/summary_by_cell.csv</code>。
        </p>
        <p>
          使用 <code>compare_arms.py</code> 可以将任意实验组与基线按任务实例一一配对，输出计入缓存定价与插件自身模型调用后的净成本变化及解决任务数对比：
        </p>
        <CodeBlock code={compareCmd} label="成对比较实验组与基线" />
        <p>
          如果你在复现过程中遇到报错，请查阅{' '}
          <Link to="/docs/troubleshooting">故障排查与诊断</Link> 页面中的实验排障表，或参考上游仓库的{' '}
          <a href={`${REPO}/blob/main/experiments/README.md`} target="_blank" rel="noreferrer">
            experiments/README.md
          </a>
          。
        </p>
      </div>

      <DocPager current="/docs/experiments" />
    </>
  )
}

