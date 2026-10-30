# TokenEconomizer：面向编码智能体的、经验驱动的黑盒成本控制

<p align="center">
  Aaron J. Li<sup>1</sup>,
  Weijia Xu<sup>2</sup>,
  Chandan Singh<sup>2</sup>,
  Zixiao Chen<sup>3</sup>,
  Jeevana Priya Inala<sup>2</sup>,
  Charlotte Siska<sup>3</sup>,
  <br>
  Acar Tamersoy<sup>3</sup>,
  Bin Yu<sup>1</sup>,
  Ion Stoica<sup>1</sup>,
  Michel Galley<sup>2</sup>,
  Jianfeng Gao<sup>2</sup>
</p>
<p align="center">
  <sup>1</sup>加州大学伯克利分校 &nbsp; <sup>2</sup>微软研究院 &nbsp; <sup>3</sup>微软安全部门
</p>

<p align="center">
  <a href="https://arxiv.org/abs/2610.22732"><img src="https://img.shields.io/badge/arXiv-2610.22732-b31b1b.svg" alt="arXiv"></a>
  <a href="https://tokeneconomizer.github.io"><img src="https://img.shields.io/badge/project-page-2f6fb0.svg" alt="项目主页"></a>
  <a href="https://x.com/aaron_jli/status/2114797313613053952"><img src="https://img.shields.io/badge/X-post-000000.svg?logo=x&logoColor=white" alt="X 动态"></a>
  <img src="https://img.shields.io/badge/python-3.10%2B-3776ab.svg" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="Apache 2.0 许可证">
</p>

<p align="center">
  我们在 SWE-Bench 任务上的实测：在五种「智能体–模型」组合上，平均成本降低 <b>18.4–30.9%</b>，在全部 <b>30</b> 个「仓库 × 组合」单元中都更便宜，且 Pass@1 在 <b>5 个中的 4 个</b>上有所提升。<a href="#results">结果</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-reduced-motion: reduce)" srcset="https://raw.githubusercontent.com/microsoft/TokenEconomizer/main/docs/assets/teaser.png">
    <img src="https://raw.githubusercontent.com/microsoft/TokenEconomizer/main/docs/assets/teaser.gif" width="100%" alt="一段动画，开头是一张标题卡：TokenEconomizer，面向编码智能体的经验驱动黑盒成本控制，附带它的三种机制（微技能、工具剪枝、失败循环干预）、它所支持的智能体（Claude Code、Codex、GitHub Copilot CLI、Pi）以及加州大学伯克利分校与微软的 logo。接着是一个示意图，展示同一个仓库里的六次会话，每次会话都是一根表示其成本的条形：工作本身，加上三种浪费——重新学习仓库、从未用到的工具、陷入循环卡住。前三场会话依次教给 TokenEconomizer 一件事：1 微技能记住仓库怎么运作（用 python -m pytest 跑测试），2 工具剪枝跳过这里从未用到的工具（保留 Read 与 Edit，排除 Notebook 与 Browser），3 失败循环干预发现循环并介入（同样的错误出现三次，就会收到一条「换种思路」的提示）。在每堂课之后的会话里，浪费随之缩小，于是条形逐根下降，跌到标记「无 TokenEconomizer 时成本」的虚线以下。结尾是 SWE-Bench 任务上的实测结果：五种智能体–模型组合平均成本降低 18.4–30.9%，在 30 个「仓库 × 组合」单元中全部比默认更便宜，Pass@1 在 5 个中的 4 个上提升；逐组合来看，Claude Code 配 Sonnet 5 成本降低 23.6%、Pass@1 +1.3，Opus 4.8 为 30.9% 与 −1.0，Codex 配 GPT-5.6 Terra 为 24.7% 与 +0.9，GPT-5.6 Sol 为 26.1% 与 +1.6，Copilot CLI 配 Sonnet 5 为 18.4% 与 +2.6。">
  </picture>
</p>

TokenEconomizer 让你经常工作的那些仓库里的编码智能体运行得更便宜，且不需要改动智能体本身。它会从一个智能体在某个仓库中已经跑过的会话中学习，并用这些经验去削减后续会话中的浪费。它包含三种机制：

- **微技能（Micro-skills）：记住仓库是怎么运作的。** 会话总是反复重新发现同样的「事实」：必须先跑的构建步骤、在这里能用的命令该怎么写（`pytest` 缺失时用 `python -m pytest`，`tsc` 缺失时用 `npx tsc`）、某条命令需要的环境变量、生成文件放在哪里。微技能会用任意语言，从两个来源学习这类事实：跨会话反复出现的失败，以及一个每隔 *k* 个会话（*k* = 3）就审阅近期会话并提出事实的模型。一条事实在连续三个会话确认后，会在每个会话开始时陈述一次；若后续会话与之矛盾，则被丢弃。
- **工具剪枝（Tool pruning）：停止加载用不到的工具。** 每个被加载的工具的定义都会随每次请求一起发送。一个工具若横跨至少 *m* 个会话、在 *p* 次提示中都没被用过，或者在任意长度的 *s* 个会话中都没被用过（*p* = 10、*m* = 2、*s* = 5），就会通过智能体自身的设置，被排除在后续会话之外。一条命令就能把它请回来。
- **失败循环干预（即循环守卫 loop guard）：在某一轮卡住时介入。** 当某一轮（智能体针对一条提示的工作）持续撞上同样的失败时，一个裁判模型会判断它是否卡住了。若裁判至少有 *c* 的把握（*c* = 0.7），智能体会收到一次「重定向」（一条加进它上下文的简短提示，让它换一种思路），每轮最多 *r* 次（*r* = 1）。如果重定向之后这一轮仍然卡住，TokenEconomizer 会告诉你该如何让它停下来；它自己绝不会主动停掉某一轮。

TokenEconomizer 是 **Claude Code**、**Codex**、**GitHub Copilot CLI** 和 **Pi** 的一个插件，并对 **opencode** 提供实验性支持。上面每个斜体字母都是一项设置，并附有其默认值（[设置](#settings)），且每种机制都能单独开关。插件会用一行字播报每一次动作；如果其中任何环节失败，你的会话会照常继续，就像没装这个插件一样。它的模型调用（提出事实的模型，以及写出重定向的裁判模型）经由你自己的智能体运行，使用同一个套餐或登录身份，其成本也被计入它的报告。它学到的东西留在你的机器上，位于 `~/.tokeneconomizer`。

<a id="results"></a>
## 结果

论文在来自六个仓库的同一批 277 个 SWE-Bench 任务上，跑了五种「智能体–模型」组合。每个任务作为独立会话运行，每个仓库的任务按顺序跑，且一开始什么都还没学到。成本包含了 TokenEconomizer 发出的每一次模型调用。在每个仓库和每种组合内部，成本下降了 5–40%。这一节省在 Web-Bench 上同样成立（降低 16–21%），在两个「每个任务都在全新仓库里」的安全审计基准上也成立（降低 6–20%）。[项目主页](https://tokeneconomizer.github.io) 提供了可交互的图表、按仓库拆分的数字，以及九条带注释的运行记录；[`experiments/`](https://github.com/microsoft/TokenEconomizer/blob/main/experiments/README.md) 则可复现 SWE-Bench 与 Web-Bench 实验。

## 工作原理

<p align="center"><img src="https://raw.githubusercontent.com/microsoft/TokenEconomizer/main/docs/assets/framework_overview.png" width="100%" alt="TokenEconomizer：插件保存它对某个仓库的了解，并将微技能、工具剪枝与失败循环干预应用到你原封未动的编码智能体上；每完成一个会话的日志都会更新这三者"></p>

编码智能体被设计来完成任务，而不是来省钱。每一轮都要为智能体的指令、每个被加载的工具，以及到目前为止的对话重新付费。开发者在同一仓库上反复使用同一个智能体，于是大量成本被重复支付：同样的事实被重新发现、同样的未用工具被发送、同样类型的失败循环。TokenEconomizer 不去动智能体的模型、权重和代码，而是跨仓库的多个会话去学习，而不是把每个会话孤立对待，因此插件付出的任何开销，都会在后续会话中回本。四项原则指导着这些机制：

- **经由智能体本就在读的东西来工作。** 事实在会话开始时进入上下文，工具则通过智能体自身的设置被移除，因此不依赖智能体学会一个新的工具。
- **按账单上的方式计算成本。** 一个会话里大多数 token 都是带缓存的重读，因此成本按缓存定价计算，并且包含了插件自身的模型调用。
- **保护任务成功率。** 事实只从反复出现的证据中形成，工具只在长期未用之后才被移除，而循环守卫会放过仍在推进的某一轮。
- **让每个动作都可逆。** 被后续会话推翻的事实会被丢弃，被移除的工具可以还给智能体，循环守卫只会重定向并告诉你：是否停掉某一轮，由你决定。

## 快速开始

你需要以下智能体之一（以它支持的任何方式登录），以及 `PATH` 上 Python 3.10 或更高版本。插件不需要自己的 API 密钥，也从不处理凭证，因此任何套餐或登录方式都行。

### 安装

在你希望保留克隆的文件夹里运行以下命令。Claude Code、Codex、Copilot CLI 和 opencode 都从克隆目录运行插件，所以请把它留在原位。然后在你的某个仓库里启动智能体。

**Claude Code**

```sh
git clone https://github.com/microsoft/TokenEconomizer.git
claude plugin marketplace add "$PWD/TokenEconomizer"
claude plugin install tokeneconomizer@tokeneconomizer
```

启动 `claude`，信任该文件夹（**Yes, I trust this folder**），并运行 `/tokeneconomizer:status`，如被询问则允许其脚本运行。每台机器一次，并在 Claude Code 更新之后，再次运行 `/tokeneconomizer:toolprune refresh-catalog`。

**Codex**

```sh
git clone https://github.com/microsoft/TokenEconomizer.git
codex plugin marketplace add "$PWD/TokenEconomizer"
codex plugin add tokeneconomizer@tokeneconomizer
```

启动 `codex`，为该文件夹选择 **Trust and continue**，接着在 **Hooks need review** 处选择 **Trust all and continue**。钩子从你的下一次 Codex 会话开始生效，因此请退出（`/exit`）、重新启动 `codex`，并用 `$tokeneconomizer:status` 检查。

**Copilot CLI**

```sh
git clone https://github.com/microsoft/TokenEconomizer.git
copilot plugin marketplace add "$PWD/TokenEconomizer"
copilot plugin install tokeneconomizer@tokeneconomizer
```

启动 `copilot`，选择 **Yes, and remember this folder for future sessions**，并运行 `/tokeneconomizer:status`，选择 **Yes** 以运行其脚本。每台机器一次，并在 Copilot 更新之后，再次运行 `/tokeneconomizer:toolprune refresh-catalog`。

**Pi**

```sh
pi install git:github.com/microsoft/TokenEconomizer
```

启动 `pi` 并运行 `/te status`。

**opencode**（实验性）

```sh
git clone https://github.com/microsoft/TokenEconomizer.git
mkdir -p ~/.config/opencode/plugins
ln -s "$PWD/TokenEconomizer/plugin/opencode/tokeneconomizer.ts" ~/.config/opencode/plugins/
```

启动 `opencode` 并发送一条提示，然后在仓库里用 `~/.tokeneconomizer/bin/te --host opencode status` 检查。opencode 没有插件命令，因此插件的命令从终端运行。

如果安装成功，status 命令会打印一小段状态信息。`refresh-catalog` 会记录一个会话加载过的每一个工具（不涉及模型调用），以便工具剪枝能考虑到它们全部。请像上面那样保持 marketplace 路径为绝对路径：Copilot CLI 会把 `./TokenEconomizer` 这样的相对路径当成某个 GitHub 仓库的名字。

更新方式：

| 智能体 | 更新 |
|---|---|
| Claude Code、Copilot CLI、opencode | 在克隆目录里 `git pull` |
| Codex | 在克隆目录里 `git pull`，然后再次执行 `codex plugin add` 那一行 |
| Pi | `pi update --extensions` |

[`plugin/README.md`](https://github.com/microsoft/TokenEconomizer/blob/main/plugin/README.md) 更详细地讲解了每个智能体，包括卸载、给 Copilot 配上你自己的模型密钥，以及故障排查。

### 支持的版本

| 智能体 | 支持范围 | 更老的版本 |
|---|---|---|
| Claude Code | 2.1.300 至 2.1.310 | 不支持 |
| Codex | 0.153.1 至 0.164.0 | 不支持 |
| Copilot CLI | 1.0.83 至 1.0.102 | 不支持 |
| Pi | 1.2.0 至 1.3.0 | 0.99.x：按路径加载扩展（见下） |
| opencode（实验性） | 1.19.5 与 2.2.0 | 未测试 |

上面的命令在每个范围的最老与最新版本上都测过；更晚的版本尚未测试。

- **Codex 0.141.0 之前** 完全不会运行插件钩子。
- **Pi 0.99.x**：不用 `pi install`，改为克隆仓库，并以 `pi --extension /path/to/TokenEconomizer/plugin/pi/tokeneconomizer.ts` 启动每次会话，使用你克隆目录的完整路径；在克隆目录里 `git pull` 即可更新。
- **opencode** 的支持是实验性的：仅在 1.19.5 与 2.2.0 上测试过，且未在 2.x 的终端 UI 中测试。

<a id="everyday-commands"></a>
### 日常命令

照常工作即可；插件不需要你做任何事。要查看或更改它的行为，使用它的命令。这些命令在每个智能体上名字都相同；只有输入方式不同：

| 智能体 | 这样输入命令 |
|---|---|
| Claude Code、Copilot CLI | `/tokeneconomizer:<命令>` |
| Codex | `$tokeneconomizer:<命令>` |
| Pi | `/te <命令>` |
| opencode | 从终端：`~/.tokeneconomizer/bin/te --host opencode <命令>` |
| 在仓库中的终端 | `~/.tokeneconomizer/bin/te <命令>` |

| 命令 | 作用 |
|---|---|
| `status` | 它在这里学到了什么、做了什么，以及你的会话花了多少 |
| `microskills` | 它注入的事实，以及仍在形成中的那些 |
| `toolprune` | 它排除掉的工具，以及证据（Pi 与 opencode 上不可用） |
| `toolprune restore` | 把工具还回来；它们不会再被移除 |
| `config` | 当前生效的全部设置 |
| `config set microskills=on` | 在当前仓库开启某个机制（或 `=off`）；加上 `--global` 则对所有仓库生效 |

在智能体内部，一条命令消耗一次模型轮次；从终端运行则是免费的。其他命令（`repos`、`doctor`、`config unset` 等）以及每个智能体的权限提示，列在 [Commands](https://github.com/microsoft/TokenEconomizer/blob/main/plugin/README.md#commands) 下。

<a id="settings"></a>
## 设置

工具剪枝和循环守卫默认开启；在这两个默认值下，插件只在某一轮出现循环迹象时才会调用模型：即裁判，以及它发现该轮卡住时写下的重定向。微技能默认关闭，因为它的提议器会增加模型调用，而它能省下多少，取决于仓库以及你在那里做的工作。每种机制都有自己的开关（`microskills`、`toolprune`、`loopguard`），取值为 `on` 或 `off`，而上方的斜体字母就是这些设置：

| | 设置 | 默认值 | 控制什么 |
|---|---|---|---|
| *k* | `microskills_propose_every` | 3 | 微技能提议器两次运行之间相隔的会话数 |
| *p* | `toolprune_evidence` | 10 | 一个工具在被排除前必须未被使用的提示数 |
| *m* | `toolprune_min_sessions` | 2 | 这些提示必须横跨的会话数 |
| *s* | `toolprune_sessions` | 5 | 或者这样多个会话，长度不限 |
| *q* | `toolprune_quiet_minutes` | 60 | 你在这里的会话必须空闲多少分钟，才会写出拒绝列表 |
| *e* | `loopguard.envelope_min_samples` | 5 | 在此处「正常结束」（最后一次编辑后没有失败的检查）的轮数，达到后循环守卫才开始行动 |
| *c* | `loopguard.judge_confidence` | 0.7 | 裁判必须有多确定某一轮卡住了 |
| *r* | `loopguard_nudges` | 1 | 每轮在被守卫仅告知你之前，可重定向的次数 |
| *b* | `loopguard.backstop_mult` | 2.5 | 一个反复空转的轮次，在被无裁判直接重定向之前，可运行到其通常长度的几倍 |

用 `config set` 来修改，这里以 Claude Code 的写法展示（其他智能体的输入方式见 [日常命令](#everyday-commands)）：

```text
/tokeneconomizer:config set microskills=on                 # 开启微技能
/tokeneconomizer:config set microskills_propose_every=5    # k = 5：更不频繁地提议事实
/tokeneconomizer:config set toolprune_evidence=20          # p = 20：等待二十次未使用的提示
/tokeneconomizer:config set loopguard_nudges=2             # r = 2：在告知你之前重定向两次
```

工具剪枝统计提示数，以便长会话权重更大，并且要求 *m* 个会话，使得单个会话永远无法独自决定。它只在你在该仓库的会话空闲了 *q* 分钟后（最迟在列表形成后一天）才写出拒绝列表：因为工具变化后恢复的对话必须把它整段历史重新写入提示缓存，而不是读取它，而空闲一小时后那份缓存本来也已过期。

除了 `on` 和 `off`，还有两种有用的模式：`toolprune=propose` 只提议拒绝列表，在你运行 `toolprune apply` 之前什么都不改变；`microskills=envfacts` 只从反复出现的失败中学习事实，不进行任何模型调用。

要改变单次会话，可在启动智能体时设置一个环境变量：`TE_DISABLE=1 claude` 会关闭整个插件，`TE_LOOPGUARD=off codex` 会关闭某一机制（同理还有 `TE_MICROSKILLS` 和 `TE_TOOLPRUNE`）。每一项设置及其默认值都列在 [Settings](https://github.com/microsoft/TokenEconomizer/blob/main/plugin/README.md#settings) 下；每一项的环境变量名都是 `TE_` 加上其大写名称。

## 各智能体上的行为

微技能和循环守卫在每个智能体上的工作方式相同。每个智能体各自学习：事实、工具证据，以及循环守卫对「通常一轮」的感知，都按智能体和仓库分别保存，而设置是共享的。工具剪枝通过每个智能体自身的设置起作用，因此它能排除的东西各不相同：

| 智能体 | 工具剪枝排除的对象 | 写入位置 |
|---|---|---|
| Claude Code | 单个工具 | `.claude/settings.local.json` |
| Codex | 能力包（capability packages） | `.codex/config.toml` |
| Copilot CLI | 整个 MCP 服务器 | `.github/copilot/settings.local.json` |
| Pi | 无（Pi 只加载四个工具） | — |
| opencode | 暂不支持 | — |

工具剪枝只添加它自己的条目，绝不动你写的拒绝规则；它创建的配置文件会被排除在 git 之外（`.git/info/exclude`）。在 Claude Code 上，说明它排除了哪些东西的「会话起始行」只显示在详细记录（**Ctrl+O**）中，因此请用 `/tokeneconomizer:toolprune` 查看。`toolprune restore` 只移除插件的条目，不动其他东西，而你归还的工具不会再被移除。如果插件无法安全地编辑某个文件（你的仓库提交的 `.codex/config.toml`、不是合法 JSON 的配置文件、指向仓库之外的符号链接），该列表会保持为「提议」状态，会话起始处会说明原因；`toolprune apply` 会再试一次。[`docs/PLUGIN.md`](https://github.com/microsoft/TokenEconomizer/blob/main/docs/PLUGIN.md) 记录了每个智能体的钩子与设置是如何被验证行为的，[`docs/ARCHITECTURE.md`](https://github.com/microsoft/TokenEconomizer/blob/main/docs/ARCHITECTURE.md) 则记录了整个包是如何组合在一起的。

### 当某一轮卡住时

循环守卫首先学习这个仓库里的一轮通常要跑多久：它会等到此处有 *e* 轮「正常结束」——即自行结束，且最后一次编辑后没有失败的检查。此后，出现循环迹象（同样的失败反复出现，或错误不断堆积）的一轮会被送交裁判。有一种情况无需裁判即可重定向：某一轮在反复空转同样的编辑、撞上同样的失败时，运行长度超过了通常长度的 *b* 倍。如果一轮在重定向之后仍然卡住，你会看到一行以「如何停下它」结尾的提示：

> TokenEconomizer：这一轮在重定向之后看起来仍然卡住（judge-stuck@0.82，46 次工具调用）。按 Esc 中断它。

这行出现在哪里、以及如何停下这一轮，在终端 UI 与无头运行（`claude -p`、`codex exec`、`copilot -p`、`pi -p`、`opencode run`）中分别如下：

| 智能体 | 交互模式：出现在哪里 | 如何停止 | 无头模式：出现在哪里 | 如何停止 |
|---|---|---|---|---|
| Claude Code | 在 Claude 的回复中 | Esc | 在最终回复中 | Ctrl+C |
| Codex | 在对话中 | Esc，然后 `/stop` | 不显示 | Ctrl+C |
| Copilot CLI | 在对话中 | Esc 两次 | 在 stdout 上 | Ctrl+C |
| Pi | 作为一条通知 | Esc | 在 stderr 上 | Ctrl+C |
| opencode | 作为一条通知 | Esc | 在 stderr 上 | Ctrl+C |

- **Claude Code** 只在详细记录（Ctrl+O）中显示插件自己的行，因此插件会让 Claude 在回复里把这行再说一遍；模型表述可能不同，也可能略过。
- **Codex**：Esc 会中断这一轮，但它启动的命令会一直运行到 `/stop`。`codex exec` 不打印任何钩子消息。
- **Pi**：Ctrl+C 会结束无头运行，但它启动的命令会一直跑到结束。
- **opencode** 2.x 会把这行打印到 opencode 服务器的错误输出，而不在其终端 UI 中。

在无头运行中可能无人盯着，因此被标记的一轮会一直跑到结束或触及智能体自身的限制；之后，`te status` 会统计重定向与「仍然卡住」的提示。

## 仓库结构

| | |
|---|---|
| [`tokeneconomizer/microskills`](https://github.com/microsoft/TokenEconomizer/tree/main/tokeneconomizer/microskills) | 微技能的合成与注入：从已完成的会话中学到的事实 |
| [`tokeneconomizer/toolprune`](https://github.com/microsoft/TokenEconomizer/tree/main/tokeneconomizer/toolprune) | 工具剪枝：未使用的工具与 Codex 能力包 |
| [`tokeneconomizer/loopguard`](https://github.com/microsoft/TokenEconomizer/tree/main/tokeneconomizer/loopguard) | 失败循环干预：每次调用的守卫及其按仓库的「包络」 |
| [`tokeneconomizer/trace`](https://github.com/microsoft/TokenEconomizer/tree/main/tokeneconomizer/trace) | 每个智能体的会话日志，被读成统一的形态 |
| [`tokeneconomizer/plugin`](https://github.com/microsoft/TokenEconomizer/tree/main/tokeneconomizer/plugin) | 钩子与 `te` 命令运行的运行时 |
| [`plugin`](https://github.com/microsoft/TokenEconomizer/tree/main/plugin) | 可安装的插件：清单、钩子文件、启动器、斜杠命令、Pi 扩展、opencode 插件 |
| [`experiments`](https://github.com/microsoft/TokenEconomizer/tree/main/experiments) | 论文结果背后的框架、启动器与任务集 |
| [`docs`](https://github.com/microsoft/TokenEconomizer/tree/main/docs) | `PLUGIN.md`（设计、已验证的智能体行为）与 `ARCHITECTURE.md`（包如何组合） |
| [`tests`](https://github.com/microsoft/TokenEconomizer/tree/main/tests) | 包与插件的离线测试 |

这个包仅依赖标准库。用 `python -m pytest tests` 运行测试（加上 `experiments/tests` 可覆盖基准侧），并用 `python3 scripts/build_plugin.py --out dist/marketplace` 构建一个自包含的插件包。

## 复现实验

论文结果背后的代码——一个在 SWE-Bench 与 Web-Bench 上运行 Claude Code、Codex 和 Copilot CLI 的框架、各启动器，以及被评估的任务集——都位于 [`experiments/`](https://github.com/microsoft/TokenEconomizer/blob/main/experiments/README.md)，其 README 给出了配置说明，以及每个结果对应的一条命令。它不属于已安装的插件；两者只共享 `tokeneconomizer/`。

## 引用

```bibtex
@misc{li2026tokeneconomizer,
  title         = {{TokenEconomizer}: Experience-Driven Black-Box Cost Control for Coding Agents},
  author        = {Li, Aaron J. and Xu, Weijia and Singh, Chandan and Chen, Zixiao and
                   Inala, Jeevana Priya and Siska, Charlotte and Tamersoy, Acar and Yu, Bin and
                   Stoica, Ion and Galley, Michel and Gao, Jianfeng},
  year          = {2026},
  eprint        = {2610.22732},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL},
  url           = {https://arxiv.org/abs/2610.22732}
}
```

## 许可证

Apache 2.0；见 [`LICENSE`](https://github.com/microsoft/TokenEconomizer/blob/main/LICENSE)。
