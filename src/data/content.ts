export type Agent = {
  id: string
  name: string
  note?: string
  install: string[]
  inspect: string
  update: string
  prefix: string
  prefixLabel: string
}

export const agents: Agent[] = [
  {
    id: 'claude',
    name: 'Claude Code',
    install: [
      'git clone https://github.com/microsoft/TokenEconomizer.git',
      'claude plugin marketplace add "$PWD/TokenEconomizer"',
      'claude plugin install tokeneconomizer@tokeneconomizer',
    ],
    inspect:
      '启动 claude，信任该文件夹（Yes, I trust this folder），并运行 /tokeneconomizer:status，如被询问则允许其脚本运行。每台机器一次，并在 Claude Code 更新之后，再次运行 /tokeneconomizer:toolprune refresh-catalog。',
    update: '在克隆目录里 git pull',
    prefix: '/tokeneconomizer:<命令>',
    prefixLabel: 'Claude Code、Copilot CLI',
  },
  {
    id: 'codex',
    name: 'Codex',
    install: [
      'git clone https://github.com/microsoft/TokenEconomizer.git',
      'codex plugin marketplace add "$PWD/TokenEconomizer"',
      'codex plugin add tokeneconomizer@tokeneconomizer',
    ],
    inspect:
      '启动 codex，为该文件夹选择 Trust and continue，接着在 Hooks need review 处选择 Trust all and continue。钩子从你的下一次 Codex 会话开始生效，因此请退出（/exit）、重新启动 codex，并用 $tokeneconomizer:status 检查。',
    update: '在克隆目录里 git pull，然后再次执行 codex plugin add 那一行',
    prefix: '$tokeneconomizer:<命令>',
    prefixLabel: 'Codex',
  },
  {
    id: 'copilot',
    name: 'Copilot CLI',
    install: [
      'git clone https://github.com/microsoft/TokenEconomizer.git',
      'copilot plugin marketplace add "$PWD/TokenEconomizer"',
      'copilot plugin install tokeneconomizer@tokeneconomizer',
    ],
    inspect:
      '启动 copilot，选择 Yes, and remember this folder for future sessions，并运行 /tokeneconomizer:status，选择 Yes 以运行其脚本。每台机器一次，并在 Copilot 更新之后，再次运行 /tokeneconomizer:toolprune refresh-catalog。',
    update: '在克隆目录里 git pull',
    prefix: '/tokeneconomizer:<命令>',
    prefixLabel: 'Claude Code、Copilot CLI',
  },
  {
    id: 'pi',
    name: 'Pi',
    install: ['pi install git:github.com/microsoft/TokenEconomizer'],
    inspect: '启动 pi 并运行 /te status。',
    update: 'pi update --extensions',
    prefix: '/te <命令>',
    prefixLabel: 'Pi',
  },
  {
    id: 'opencode',
    name: 'opencode',
    note: '实验性',
    install: [
      'git clone https://github.com/microsoft/TokenEconomizer.git',
      'mkdir -p ~/.config/opencode/plugins',
      'ln -s "$PWD/TokenEconomizer/plugin/opencode/tokeneconomizer.ts" ~/.config/opencode/plugins/',
    ],
    inspect:
      '启动 opencode 并发送一条提示，然后在仓库里用 ~/.tokeneconomizer/bin/te --host opencode status 检查。opencode 没有插件命令，因此插件的命令从终端运行。',
    update: '在克隆目录里 git pull',
    prefix: '~/.tokeneconomizer/bin/te --host opencode <命令>',
    prefixLabel: 'opencode',
  },
]

export const commandPrefixes = [
  { where: 'Claude Code、Copilot CLI', how: '/tokeneconomizer:<命令>' },
  { where: 'Codex', how: '$tokeneconomizer:<命令>' },
  { where: 'Pi', how: '/te <命令>' },
  { where: 'opencode', how: '从终端：~/.tokeneconomizer/bin/te --host opencode <命令>' },
  { where: '在仓库中的终端', how: '~/.tokeneconomizer/bin/te <命令>' },
]

export const commands = [
  { cmd: 'status', desc: '它在这里学到了什么、做了什么，以及你的会话花了多少' },
  { cmd: 'microskills', desc: '它注入的事实，以及仍在形成中的那些' },
  { cmd: 'toolprune', desc: '它排除掉的工具，以及证据（Pi 与 opencode 上不可用）' },
  { cmd: 'toolprune restore', desc: '把工具还回来；它们不会再被移除' },
  { cmd: 'config', desc: '当前生效的全部设置' },
  {
    cmd: 'config set microskills=on',
    desc: '在当前仓库开启某个机制（或 =off）；加上 --global 则对所有仓库生效',
  },
]

export const versions = [
  { agent: 'Claude Code', range: '2.1.300 至 2.1.310', older: '不支持' },
  { agent: 'Codex', range: '0.153.1 至 0.164.0', older: '不支持' },
  { agent: 'Copilot CLI', range: '1.0.83 至 1.0.102', older: '不支持' },
  { agent: 'Pi', range: '1.2.0 至 1.3.0', older: '0.99.x：按路径加载扩展' },
  { agent: 'opencode（实验性）', range: '1.19.5 与 2.2.0', older: '未测试' },
]

export const settings = [
  { key: 'k', name: 'microskills_propose_every', def: '3', desc: '微技能提议器两次运行之间相隔的会话数' },
  { key: 'p', name: 'toolprune_evidence', def: '10', desc: '一个工具在被排除前必须未被使用的提示数' },
  { key: 'm', name: 'toolprune_min_sessions', def: '2', desc: '这些提示必须横跨的会话数' },
  { key: 's', name: 'toolprune_sessions', def: '5', desc: '或者这样多个会话，长度不限' },
  { key: 'q', name: 'toolprune_quiet_minutes', def: '60', desc: '你在这里的会话必须空闲多少分钟，才会写出拒绝列表' },
  { key: 'e', name: 'loopguard.envelope_min_samples', def: '5', desc: '在此处「正常结束」（最后一次编辑后没有失败的检查）的轮数，达到后循环守卫才开始行动' },
  { key: 'c', name: 'loopguard.judge_confidence', def: '0.7', desc: '裁判必须有多确定某一轮卡住了' },
  { key: 'r', name: 'loopguard_nudges', def: '1', desc: '每轮在被守卫仅告知你之前，可重定向的次数' },
  { key: 'b', name: 'loopguard.backstop_mult', def: '2.5', desc: '一个反复空转的轮次，在被无裁判直接重定向之前，可运行到其通常长度的几倍' },
]

export const pruneTargets = [
  { agent: 'Claude Code', target: '单个工具', where: '.claude/settings.local.json' },
  { agent: 'Codex', target: '能力包（capability packages）', where: '.codex/config.toml' },
  { agent: 'Copilot CLI', target: '整个 MCP 服务器', where: '.github/copilot/settings.local.json' },
  { agent: 'Pi', target: '无（Pi 只加载四个工具）', where: '—' },
  { agent: 'opencode', target: '暂不支持', where: '—' },
]

export const stuck = [
  { agent: 'Claude Code', ui: '在 Claude 的回复中', uiStop: 'Esc', headless: '在最终回复中', headlessStop: 'Ctrl+C' },
  { agent: 'Codex', ui: '在对话中', uiStop: 'Esc，然后 /stop', headless: '不显示', headlessStop: 'Ctrl+C' },
  { agent: 'Copilot CLI', ui: '在对话中', uiStop: 'Esc 两次', headless: '在 stdout 上', headlessStop: 'Ctrl+C' },
  { agent: 'Pi', ui: '作为一条通知', uiStop: 'Esc', headless: '在 stderr 上', headlessStop: 'Ctrl+C' },
  { agent: 'opencode', ui: '作为一条通知', uiStop: 'Esc', headless: '在 stderr 上', headlessStop: 'Ctrl+C' },
]

export const results = [
  { agent: 'Claude Code', model: 'Sonnet 5', cost: '−23.6%', pass: '+1.3', good: true },
  { agent: 'Claude Code', model: 'Opus 4.8', cost: '−30.9%', pass: '−1.0', good: false },
  { agent: 'Codex', model: 'GPT-5.6 Terra', cost: '−24.7%', pass: '+0.9', good: true },
  { agent: 'Codex', model: 'GPT-5.6 Sol', cost: '−26.1%', pass: '+1.6', good: true },
  { agent: 'Copilot CLI', model: 'Sonnet 5', cost: '−18.4%', pass: '+2.6', good: true },
]

export const repoTree = [
  { path: 'tokeneconomizer/microskills', desc: '微技能的合成与注入：从已完成的会话中学到的事实' },
  { path: 'tokeneconomizer/toolprune', desc: '工具剪枝：未使用的工具与 Codex 能力包' },
  { path: 'tokeneconomizer/loopguard', desc: '失败循环干预：每次调用的守卫及其按仓库的「包络」' },
  { path: 'tokeneconomizer/trace', desc: '每个智能体的会话日志，被读成统一的形态' },
  { path: 'tokeneconomizer/plugin', desc: '钩子与 te 命令运行的运行时' },
  { path: 'plugin', desc: '可安装的插件：清单、钩子文件、启动器、斜杠命令、Pi 扩展、opencode 插件' },
  { path: 'experiments', desc: '论文结果背后的框架、启动器与任务集' },
  { path: 'docs', desc: 'PLUGIN.md（设计、已验证的智能体行为）与 ARCHITECTURE.md（包如何组合）' },
  { path: 'tests', desc: '包与插件的离线测试' },
]

export const bibtex = `@misc{li2026tokeneconomizer,
  title         = {{TokenEconomizer}: Experience-Driven Black-Box Cost Control for Coding Agents},
  author        = {Li, Aaron J. and Xu, Weijia and Singh, Chandan and Chen, Zixiao and
                   Inala, Jeevana Priya and Siska, Charlotte and Tamersoy, Acar and Yu, Bin and
                   Stoica, Ion and Galley, Michel and Gao, Jianfeng},
  year          = {2026},
  eprint        = {2610.22732},
  archivePrefix = {arXiv},
  primaryClass  = {cs.CL},
  url           = {https://arxiv.org/abs/2610.22732}
}`

export const authors = [
  'Aaron J. Li',
  'Weijia Xu',
  'Chandan Singh',
  'Zixiao Chen',
  'Jeevana Priya Inala',
  'Charlotte Siska',
  'Acar Tamersoy',
  'Bin Yu',
  'Ion Stoica',
  'Michel Galley',
  'Jianfeng Gao',
]

export const REPO = 'https://github.com/microsoft/TokenEconomizer'

export const docPages = [
  {
    path: '/docs',
    title: '文档',
    desc: '安装、命令、设置与各智能体上的行为，按主题分成六节。',
    group: '',
  },
  {
    path: '/docs/quickstart',
    title: '快速开始',
    desc: '五种智能体的安装命令、安装后的检查，以及支持的版本范围。',
    group: '使用',
  },
  {
    path: '/docs/commands',
    title: '日常命令',
    desc: 'status、microskills、toolprune、config：在每个智能体上怎么输入。',
    group: '使用',
  },
  {
    path: '/docs/settings',
    title: '设置',
    desc: '九项设置与默认值，两种部分启用模式，以及单次会话的环境变量。',
    group: '使用',
  },
  {
    path: '/docs/agents',
    title: '各智能体上的行为',
    desc: '工具剪枝在每种智能体上排除什么、写到哪里，以及卡住时如何停下。',
    group: '使用',
  },
  {
    path: '/docs/repo',
    title: '仓库结构',
    desc: '包的八个目录、测试与构建方式，以及实验如何复现。',
    group: '参考',
  },
  {
    path: '/docs/citation',
    title: '引用与许可',
    desc: '论文条目、作者单位与 Apache 2.0 许可证。',
    group: '参考',
  },
] as const
