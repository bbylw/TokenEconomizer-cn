export type Agent = {
  id: string
  name: string
  note?: string
  install: string[]
  inspect: string
  update: string
  uninstall: string[]
  prefix: string
  prefixLabel: string
  terminalPrefix: string
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
    update: '在克隆目录里 git pull，再开启新会话（或运行 /reload-plugins）',
    uninstall: [
      '/tokeneconomizer:toolprune restore',
      'claude plugin uninstall tokeneconomizer@tokeneconomizer',
      'claude plugin marketplace remove tokeneconomizer',
    ],
    prefix: '/tokeneconomizer:<命令>',
    prefixLabel: 'Claude Code、Copilot CLI',
    terminalPrefix: '~/.tokeneconomizer/bin/te --host claude <命令>',
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
    update: '在克隆目录里 git pull，然后再次执行 codex plugin add tokeneconomizer@tokeneconomizer',
    uninstall: [
      '~/.tokeneconomizer/bin/te --host codex toolprune restore',
      'codex plugin remove tokeneconomizer@tokeneconomizer',
      'codex plugin marketplace remove tokeneconomizer',
    ],
    prefix: '$tokeneconomizer:<命令>',
    prefixLabel: 'Codex',
    terminalPrefix: '~/.tokeneconomizer/bin/te --host codex <命令>',
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
    update: '在克隆目录里 git pull（Copilot 直接从克隆目录加载插件）',
    uninstall: [
      '/tokeneconomizer:toolprune restore',
      'copilot plugin uninstall tokeneconomizer@tokeneconomizer',
      'copilot plugin marketplace remove tokeneconomizer',
    ],
    prefix: '/tokeneconomizer:<命令>',
    prefixLabel: 'Claude Code、Copilot CLI',
    terminalPrefix: '~/.tokeneconomizer/bin/te --host copilot <命令>',
  },
  {
    id: 'pi',
    name: 'Pi',
    install: ['pi install git:github.com/microsoft/TokenEconomizer'],
    inspect: '启动 pi 并运行 /te status。',
    update: 'pi update --extensions（普通 pi update 不会更新扩展）',
    uninstall: ['pi remove git:github.com/microsoft/TokenEconomizer'],
    prefix: '/te <命令>',
    prefixLabel: 'Pi',
    terminalPrefix: '~/.tokeneconomizer/bin/te --host pi <命令>',
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
    uninstall: ['rm ~/.config/opencode/plugins/tokeneconomizer.ts'],
    prefix: '~/.tokeneconomizer/bin/te --host opencode <命令>',
    prefixLabel: 'opencode',
    terminalPrefix: '~/.tokeneconomizer/bin/te --host opencode <命令>',
  },
]

export const commandPrefixes = [
  {
    where: 'Claude Code',
    inside: '/tokeneconomizer:<命令>',
    terminal: '~/.tokeneconomizer/bin/te --host claude <命令>',
  },
  {
    where: 'Codex',
    inside: '$tokeneconomizer:<命令>（status、microskills、toolprune、config、repos）',
    terminal: '~/.tokeneconomizer/bin/te --host codex <命令>',
  },
  {
    where: 'Copilot CLI',
    inside: '/tokeneconomizer:<命令>（仅交互模式）',
    terminal: '~/.tokeneconomizer/bin/te --host copilot <命令>',
  },
  {
    where: 'Pi',
    inside: '/te <命令>',
    terminal: '~/.tokeneconomizer/bin/te --host pi <命令>',
  },
  {
    where: 'opencode',
    inside: '无（请从终端运行）',
    terminal: '~/.tokeneconomizer/bin/te --host opencode <命令>',
  },
]

export const commands = [
  { cmd: 'status', desc: '它在这里学到了什么、做了什么，以及你的会话花了多少' },
  { cmd: 'microskills', desc: '它在会话开始时注入的事实，以及仍在形成中的那些' },
  { cmd: 'toolprune', desc: '拒绝列表：它排除掉的工具、接下来拟排除的工具，以及证据（Pi 与 opencode 上不可用）' },
  {
    cmd: 'toolprune apply [ITEM …]',
    desc: '应用等待中的提议列表（toolprune=propose 下），或指定条目；从下一次会话生效',
  },
  {
    cmd: 'toolprune restore [ITEM …]',
    desc: '把插件移除的条目还回来（全部或指定名称）；归还后不会再被自动移除',
  },
  {
    cmd: 'toolprune refresh-catalog',
    desc: '记录一次会话加载的全部工具目录（Claude Code、Copilot CLI），不涉及模型调用',
  },
  {
    cmd: 'toolprune measure',
    desc: '对比应用提议列表前后的请求开销（Codex 与 Copilot 上不发起模型调用）',
  },
  { cmd: 'config', desc: '当前开启的机制与所有生效中的设置值' },
  {
    cmd: 'config set KEY=VALUE … [--global]',
    desc: '修改当前仓库的设置（加 --global 则对所有仓库生效）',
  },
  {
    cmd: 'config unset KEY … [--global]',
    desc: '移除当前层级的设置，回退到全局值或默认值',
  },
  {
    cmd: 'repomap / repomap refresh',
    desc: '查看缓存的仓库地图，或立即重新生成一份（需安装 aider-chat）',
  },
  {
    cmd: 'repos',
    desc: '列出保存了状态的全部仓库：识别方式、各智能体的会话数、已见过的检出路径',
  },
  {
    cmd: 'repos migrate',
    desc: '将旧版本记录的状态归入其所属仓库（升级后会自动在后台运行一次）',
  },
  {
    cmd: 'repos merge KEY [INTO]',
    desc: '将一个仓库的状态合并进另一个仓库（默认为当前仓库），适合旧检出目录已删除的情况',
  },
  {
    cmd: 'doctor',
    desc: '检查 Python 环境、状态目录、已发现的智能体、当前目录识别方式以及 errors.log 错误日志',
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
  { key: 'k', name: 'microskills_propose_every', def: '3', desc: '微技能提议器两次运行之间相隔的会话数（首次运行提前一个会话，即默认在第 2 个会话后）' },
  { key: 'p', name: 'toolprune_evidence', def: '10', desc: '一个工具在被排除前必须未被使用的提示数（NotebookEdit 与 Codex image_media 为 3 倍）' },
  { key: 'm', name: 'toolprune_min_sessions', def: '2', desc: '这些未使用提示必须横跨的会话数；设为 1 则允许单个长会话决定' },
  { key: 's', name: 'toolprune_sessions', def: '5', desc: '或者横跨这么多会话均未使用，不论每个会话跑了多少条提示' },
  { key: 'q', name: 'toolprune_quiet_minutes', def: '60', desc: '仓库会话空闲多少分钟后才写出拒绝列表，避免热缓存失效（最迟在列表形成一天后写入）' },
  { key: 'e', name: 'loopguard.envelope_min_samples', def: '5', desc: '在此处「正常结束」（最后一次编辑后没有失败检查）的轮数，达到后循环守卫才开始行动' },
  { key: 'c', name: 'loopguard.judge_confidence', def: '0.7', desc: '裁判模型判定某一轮「卡住」所需的最低把握度' },
  { key: 'r', name: 'loopguard_nudges', def: '1', desc: '每轮在守卫仅向你发出停止提示之前，最多可注入重定向的次数' },
  { key: 'b', name: 'loopguard.backstop_mult', def: '2.5', desc: '反复空转的轮次超过通常长度（包络）的几倍时，无需裁判同意也直接重定向并标记' },
]

export const mechanismModes = [
  {
    mech: '微技能（默认关闭）',
    key: 'microskills',
    onMeaning: 'envfacts+distiller：无模型调用的环境事实层，加上每隔 microskills_propose_every 个会话运行一次的提议器模型',
    otherValues: 'off：关闭；envfacts：仅从反复失败中提取事实（零模型调用）；distiller：仅运行提议器模型',
  },
  {
    mech: '工具剪枝（默认开启）',
    key: 'toolprune',
    onMeaning: 'auto：证据充足且会话空闲满 toolprune_quiet_minutes（或满一天）后自动写入拒绝列表，并在下次会话开始时播报',
    otherValues: 'off：停止生成新列表（已应用的列表需用 toolprune restore 归还）；propose：仅提议，等你运行 toolprune apply 后再生效',
  },
  {
    mech: '循环守卫（默认开启）',
    key: 'loopguard',
    onMeaning: 'nudge：裁判模型判断疑似循环的轮次是否卡住；若卡住则注入最多 loopguard_nudges 次重定向，仍卡住则提示你如何中断',
    otherValues: 'off：关闭守卫与裁判调用；stop：在插件中等同于 nudge（插件绝不自行终止轮次）',
  },
]

export const extraSettings = [
  { name: 'microskills_max_facts', def: '4', desc: '会话开始时从「反复出现的失败」注入的事实条数上限（提议器生成的事实不受此上限约束）' },
  { name: 'microskills_max_tokens', def: '150', desc: '上述环境事实块的体积上限（按 token 计，约每 4 个字符 1 token）' },
  { name: 'toolprune_protect', def: '无', desc: '永不排除的工具名或通配模式（如 mcp__headroom__*），逗号分隔；插件此前为其写下的拒绝规则会在下次归档时移除' },
  { name: 'loopguard_aggr', def: 'default', desc: '循环守卫阈值预设档位：conservative（保守）、default（默认）或 aggressive（激进）' },
  { name: 'repomap', def: 'off', desc: '第四机制「仓库地图」：on 为按首条提示中的标识符排序；start 为会话开始时直接注入缓存地图' },
  { name: 'repomap_tokens', def: '2048', desc: '仓库地图的最大 token 预算' },
  { name: 'repomap_timeout', def: '8', desc: '首条提示等待排序版仓库地图的秒数上限，超时则回退使用缓存地图' },
  { name: 'paid_model', def: '""', desc: '插件自身模型调用使用的模型；留空时 Claude Code 用 haiku，Codex 与 Pi 用各自默认模型，Copilot 用具体模型或 Haiku' },
  { name: 'shadow', def: 'false', desc: '影子模式：照常计算并记录所有决策到日志，但不执行任何注入、剪枝或重定向' },
  { name: 'mode', def: 'auto', desc: '强制指定 interactive（交互模式）或 headless（无头模式），覆盖插件的自动检测' },
]

export const loopguardPresets = [
  { name: 'min_turns', cons: '28', def: '20', aggr: '14', desc: '一轮中至少发生多少次工具调用后，才可能被判定为卡住' },
  { name: 'edit_churn', cons: '5', def: '4', aggr: '3', desc: '对同一文件的反复编辑达到多少次算作空转（含 shell 内编辑）' },
  { name: 'distinct_edit_files', cons: '3', def: '3', aggr: '3', desc: '编辑过多少个不同文件算作分散改动' },
  { name: 'error_outputs', cons: '8', def: '6', aggr: '4', desc: '失败的工具结果累计达到多少次算作持续报错' },
  { name: 'stagnation', cons: '0.30', def: '0.20', aggr: '0.12', desc: '重复此前错误的失败结果占比阈值' },
  { name: 'envelope_pct', cons: '90', def: '90', aggr: '90', desc: '计算仓库「正常结束轮次」包络时取用的分位数' },
  { name: 'envelope_margin', cons: '1.5', def: '1.25', aggr: '1.0', desc: '乘在该分位数上的安全裕度系数' },
  { name: 'envelope_min_samples', cons: '7', def: '5', aggr: '3', desc: '循环守卫开始行动前需要积累的「正常结束轮次」样本数' },
  { name: 'backstop_mult', cons: '3.5', def: '2.5', aggr: '1.8', desc: '超出包络多少倍且满足严格空转规则时，即使裁判不同意也强制重定向' },
  { name: 'judge_confidence', cons: '0.85', def: '0.7', aggr: '0.55', desc: '裁判模型判定卡住所需的置信度阈值' },
  { name: 'gate_min_turns', cons: '24', def: '18', aggr: '12', desc: '唤醒裁判模型前至少经过的工具调用次数（不低于 min_turns）' },
  { name: 'gate_error_outputs', cons: '8', def: '8', aggr: '8', desc: '即使没有完全相同的重复失败，累计多少次报错也会唤醒裁判' },
]

export const pruneTargets = [
  { agent: 'Claude Code', target: '单个工具', where: '.claude/settings.local.json' },
  { agent: 'Codex', target: '能力包（capability packages：collaboration、goals、image_media）', where: '.codex/config.toml' },
  { agent: 'Copilot CLI', target: '整个 MCP 服务器（当其下所有工具均未用过时）', where: '.github/copilot/settings.local.json' },
  { agent: 'Pi', target: '无（Pi 默认只加载四个工具）', where: '—' },
  { agent: 'opencode', target: '暂不支持', where: '—' },
]

export const stuck = [
  { agent: 'Claude Code', ui: '在 Claude 的回复中（详细记录 Ctrl+O 亦有）', uiStop: 'Esc', headless: '在最终回复中', headlessStop: 'Ctrl+C' },
  { agent: 'Codex', ui: '在对话中（↳ Hook · …）', uiStop: 'Esc，然后 /stop', headless: '不显示（事后记入 status）', headlessStop: 'Ctrl+C' },
  { agent: 'Copilot CLI', ui: '在对话中（● TokenEconomizer: …）', uiStop: 'Esc 两次', headless: '在 stdout 上', headlessStop: 'Ctrl+C' },
  { agent: 'Pi', ui: '作为一条通知（notify）', uiStop: 'Esc', headless: '在 stderr 上', headlessStop: 'Ctrl+C' },
  { agent: 'opencode', ui: '作为一条通知（1.x Toast / 2.x stderr）', uiStop: 'Esc', headless: '在 stderr 上', headlessStop: 'Ctrl+C' },
]

export const results = [
  { agent: 'Claude Code', model: 'Sonnet 5', cost: '−23.6%', pass: '+1.3', good: true },
  { agent: 'Claude Code', model: 'Opus 4.8', cost: '−30.9%', pass: '−1.0', good: false },
  { agent: 'Codex', model: 'GPT-5.6 Terra', cost: '−24.7%', pass: '+0.9', good: true },
  { agent: 'Codex', model: 'GPT-5.6 Sol', cost: '−26.1%', pass: '+1.6', good: true },
  { agent: 'Copilot CLI', model: 'Sonnet 5', cost: '−18.4%', pass: '+2.6', good: true },
]

export const repoTree = [
  { path: 'tokeneconomizer/microskills', desc: '微技能的合成与注入：从已完成的会话中学到的事实（含零调用的 envfacts 与周期性 distiller）' },
  { path: 'tokeneconomizer/toolprune', desc: '工具剪枝：未使用的工具、Codex 能力包与 Copilot MCP 服务器证据统计' },
  { path: 'tokeneconomizer/loopguard', desc: '失败循环干预：每次工具调用的守卫（TurnGuard）、shell 编辑检测与按仓库学习的包络（Envelope）' },
  { path: 'tokeneconomizer/trace', desc: '唯一读取会话日志的边界层（load_trajectory、call_cwds、tool_usage、parse_catalog），每个智能体一个解析模块' },
  { path: 'tokeneconomizer/plugin', desc: '钩子与 te 命令运行的标准库运行时（LiveAdapter、离线归档 fold、异步裁判 judge）' },
  { path: 'plugin', desc: '可安装的插件打包层：清单、钩子配置、启动器、斜杠命令、Codex 技能、Pi 扩展、opencode 插件' },
  { path: 'experiments', desc: '论文结果背后的评估框架（te_bench）、容器执行器（te_harness）、启动脚本与任务集（workloads）' },
  { path: 'docs', desc: 'PLUGIN.md（钩子设计、各智能体实测验证记录与隐私说明）与 ARCHITECTURE.md（包与接口边界）' },
  { path: 'tests', desc: '包与插件的离线测试（含 test_plugin_package.py 架构边界断言）' },
]

export const hookLifecycle = [
  {
    hook: 'SessionStart',
    mech: 'microskills',
    what: '将当前仓库已确认的微技能（缓存渲染文本）作为 additionalContext 注入；在 Copilot 恢复会话时重放该会话最初启动时的同一份文本以保护缓存；用一行 systemMessage 播报新增事实、新排除的工具或等待确认的提议；顺带归档此前未收到结束钩子的静默会话。',
  },
  {
    hook: 'UserPromptSubmit',
    mech: 'loopguard',
    what: '为循环守卫开启一个新的「提示轮次（prompt-turn）」，重置本轮计数器。',
  },
  {
    hook: 'PostToolUse',
    mech: 'loopguard',
    what: '将该次工具调用折入当前轮次的守卫状态；若异步裁判已判定卡住，将重定向提示作为 additionalContext 附在工具结果后；若重定向后仍卡住，向用户发送一行如何停止的提示（Claude Code 上同时要求模型原样复述）；绝不主动终止轮次。',
  },
  {
    hook: 'PostToolUseFailure',
    mech: 'loopguard',
    what: '处理失败的工具调用（Claude Code 与 Copilot 仅在此事件上报失败调用），返回对应事件名的结构化响应并更新失败与空转计数。',
  },
  {
    hook: 'Stop',
    mech: 'loopguard',
    what: '关闭当前提示轮次；若该轮「正常结束」（智能体自行停下，且最后一次编辑后没有失败的验证检查），将其工具调用长度汇入当前仓库的包络（envelope）样本。',
  },
  {
    hook: 'SessionEnd',
    mech: 'microskills, toolprune, ledger',
    what: '将会话路径交给后台脱离运行的 te fold 进程并立即返回，零阻塞结束会话。',
  },
]

export const expVsPlugin = [
  {
    dim: '工作单元',
    exp: '单个基准测试任务（task）',
    plugin: '微技能与工具剪枝按「会话（session）」；循环守卫按「提示轮次（prompt-turn）」',
    why: '交互式开发里用户天然把工作拆成短轮次；若把整场长会话当成一条轨迹，仅因长度就会误判为卡住。',
  },
  {
    dim: '学习信号',
    exp: '官方评分器的 resolved 结果',
    plugin: '包络从「正常结束（ended green）」的轮次学习：智能体自行停止，且最后一次编辑后无失败检查',
    why: '真实日常仓库没有基准评分器；微技能与证据剪枝本就不依赖评分器。',
  },
  {
    dim: '事实注入通道',
    exp: '任务提示词（prompt）前缀',
    plugin: 'SessionStart 的 additionalContext（Pi 为系统提示词固定段落）',
    why: '实测验证可直达各智能体模型，且不污染用户自己输入的提示词。',
  },
  {
    dim: '工具移除方式',
    exp: '启动参数 --disallowed-tools 或启动时注入 Codex 配置',
    plugin: '写入仓库本地设置文件（.claude/settings.local.json、.codex/config.toml、.github/copilot/settings.local.json），并在仓库空闲满 60 分钟后落盘，从下一次会话生效',
    why: '插件不负责启动智能体；等待空闲是为了防止用户 resume 热会话时因工具列表变化而丢失整个对话历史的提示缓存。',
  },
  {
    dim: '剪枝候选范围',
    exp: '构造上无用的工具（提问、计划模式、子智能体、联网）加证据剪枝',
    plugin: '仅凭未使用证据（10 次提示横跨 2 个会话，或 5 个会话）；向用户提问、计划模式、子智能体与联网工具受到保护永不剪除',
    why: '真实会话中开发者需要提问、规划与查网页。',
  },
  {
    dim: '卡死裁决者',
    exp: '有裁判的实验组由轨迹裁判决定；无裁判组由严格规则直接触发',
    plugin: '守卫开启时始终先经裁判模型（在满 min_turns 且出现重复失败或密集报错时后台唤醒），唯有远超包络 2.5 倍且严格空转的兜底线（backstop）可免裁判触发',
    why: '纯规则会误伤已经找到根因、正在逐步修复的长轮次；交互式轮次常超出小包络，因此仅超包络不会唤醒裁判。',
  },
  {
    dim: '重定向与终止',
    exp: '杀死智能体进程，用续写提示词重启；仍卡住则直接终止任务',
    plugin: '在工具结果后附加轮中重定向提示；仍卡住时仅输出一行停止方式提示，绝不终止轮次',
    why: '并非所有智能体钩子都能中断轮次（Codex 与 Copilot 忽略 continue: false），且交互场景下应由开发者决定去留。',
  },
  {
    dim: '微技能读取范围',
    exp: '按基准定制的领域词表（Python/git 或 Node/web），提示词以测试命令为核心',
    plugin: '通用跨语言摘要：同时识别各生态解释器、构建与检查命令（make、tsc、cargo check 等）、编辑文件与归一化报错行',
    why: '真实仓库可能使用任意语言或多语言混编。',
  },
]

export const experimentArms = [
  { arm: 'baseline / baseline-medium / baseline-low', paper: '默认执行配置（高、中、低推理强度）' },
  { arm: 'rtk / repomap', paper: '固定策略基线：RTK（压缩终端输出）与 RepoMap（仓库符号地图）' },
  { arm: 'trimech（Codex 上为 codex-trimech）', paper: 'TokenEconomizer（三大机制全开）' },
  { arm: 'trimech-rtk / trimech-repomap', paper: 'TokenEconomizer + RTK、TokenEconomizer + RepoMap 组合' },
  { arm: 'inject-only / untool-only / spiral-only', paper: '消融实验：单独启用微技能、工具剪枝或失败循环干预' },
  { arm: 'trimech-web', paper: 'Web-Bench 上的 TokenEconomizer 配置（适配较短的任务流）' },
]

export const pluginTroubleshooting = [
  {
    symptom: '命令打印导入错误（ImportError），或钩子看起来毫无反应',
    fix: '运行 ~/.tokeneconomizer/bin/te doctor（或在克隆目录运行 plugin/scripts/te doctor），查看环境检查项与末尾的 errors.log 报错行。',
  },
  {
    symptom: 'errors.log 提示找不到插件包（package was not found for the plugin）',
    fix: '安装插件时所用的 git 克隆目录被移动或删除了：请把它移回原位、重新添加 marketplace，或使用 scripts/build_plugin.py 构建自包含安装包。',
  },
  {
    symptom: '提示 TokenEconomizer needs Python >= 3.10 (this is 3.x)',
    fix: '安装 Python 3.10 或更高版本，或设置环境变量 TE_PYTHON=/path/to/python3.10+ 指向高版本解释器。',
  },
  {
    symptom: '跑了很多次会话，工具剪枝列表依然什么都没排除',
    fix: '在 Claude Code 或 Copilot CLI 中运行一次 /tokeneconomizer:toolprune refresh-catalog，把默认加载的工具目录记录下来。',
  },
  {
    symptom: 'Codex 上工具剪枝列表已应用，但会话里的能力包没有变化',
    fix: 'Codex 仅在「已信任（trusted）」的项目中读取 .codex/config.toml；在仓库里运行 ~/.tokeneconomizer/bin/te --host codex doctor 可检查当前目录是否已被 Codex 信任。',
  },
  {
    symptom: 'errors.log 出现 sidecall copilot: no reply，且会话开始提示模型调用已暂停',
    fix: 'Copilot CLI 在 BYOK（自带密钥）模式下不会把 COPILOT_PROVIDER_* 环境变量传给钩子，因此侧调用无法连上你的提供商。此时微技能仍保留零调用的环境事实（可设 microskills=envfacts），循环守卫仅在 2.5× 兜底线处重定向；改回 Copilot 登录态后运行 config set microskills=on 即可恢复。',
  },
  {
    symptom: '在终端直接运行 te 时显示的是另一个智能体的状态',
    fix: '不带参数时 te 默认读取最近一次在该仓库工作的智能体；请显式加上 --host claude、codex、copilot、pi 或 opencode。',
  },
]

export const expTroubleshooting = [
  {
    symptom: '启动脚本打印 RUNNER=stub -- SYNTHETIC run',
    fix: '未设置 RUNNER 环境变量；默认 stub 仅用于跑通流水线烟雾测试，不会调用真实智能体。请传入 RUNNER=te_harness.swebench:make_runner 或 webbench:make_runner。',
  },
  {
    symptom: '评分阶段报 ModuleNotFoundError',
    fix: '当前虚拟环境未安装官方 SWE-Bench 评分器；请执行 pip install -e "$DATA/SWE-bench"。',
  },
  {
    symptom: 'Web-Bench 所有测试全部失败，应用根本无法渲染',
    fix: '数据目录路径包含了符号链接（symlink）；请用 export DATA="$(readlink -f ~/te_data)" 解析为真实规范路径。',
  },
  {
    symptom: '报 Executable doesn\'t exist at …/chromium_headless_shell-…',
    fix: 'Playwright 是在项目外部安装的，浏览器构建版本与 Web-Bench 子项目锁定的版本不一致；请进入 projects/calculator 目录内运行 npx playwright install chromium chromium-headless-shell。',
  },
  {
    symptom: 'Codex 密钥有效却收到 401 Unauthorized',
    fix: '该密钥签发自区域性端点（regional endpoint）；请在 experiments/.env 中显式设置 OPENAI_BASE_URL。',
  },
  {
    symptom: '需要中途停止一条后台实验通道（lane）',
    fix: '使用启动时打印的命令 kill -TERM -$(cat <log>.pid)；注意 PID 前面的负号（-）用于停止整个进程组。',
  },
]

export const faqs = [
  {
    q: '插件需要单独配置 API Key 吗？我的代码会被上传到外部服务器吗？',
    a: '不需要任何额外 API Key，代码也绝不会离开你的机器。插件的所有状态保存在本地 ~/.tokeneconomizer（目录权限 0700，文件 0600）。当循环守卫的裁判或微技能提议器需要调用模型时，它直接通过你已登录的智能体 CLI（claude -p、codex exec、copilot -p、pi -p）发起调用，且只发送脱敏后的命令模板、文件名与归一化报错行，从不发送源码内容。',
  },
  {
    q: '工具剪枝修改工具列表后，会不会导致正在进行的对话缓存（Prompt Cache）失效？',
    a: '不会。实测验证表明，运行中的会话会保持启动时的工具列表不变；而恢复旧会话（如 claude --continue 或 codex resume）则会使用新工具列表并重写缓存。因此工具剪枝专门设计了静默等待窗口（默认 toolprune_quiet_minutes = 60）：只有当你在该仓库的所有会话空闲满 60 分钟（此时提示缓存本就已过期）后，插件才真正把拒绝列表写入本地配置文件。',
  },
  {
    q: '如果工具剪枝把某个我偶尔才用的工具排除了，怎么恢复？',
    a: '随时运行 toolprune restore（或指定工具名 toolprune restore NotebookEdit）即可一键归还。被你手动归还的工具会被永久记入保护名单，后续即使长期不用也不会再被自动排除。你也可以通过 config set toolprune_protect=工具名 提前保护特定工具，或设为 toolprune=propose 改为每次由你手动确认。',
  },
  {
    q: '为什么微技能（microskills）默认是关闭的，而工具剪枝和循环守卫默认开启？',
    a: '因为工具剪枝完全不调用模型，循环守卫也只在某一轮出现明显的重复报错循环迹象时才唤醒一次轻量裁判；而微技能的提议器默认每隔 3 个会话会调用一次模型来总结近期会话。如果你希望零模型调用开销地使用微技能，可以运行 config set microskills=envfacts，它只从跨会话重复出现的命令失败中提取确定性事实。',
  },
  {
    q: '循环守卫判定某一轮卡住时，会不会直接强行杀掉我的智能体任务？',
    a: '绝不会。插件奉行「让每个动作都可逆」的原则：第一次判定卡住时，它会在工具返回结果后附带一条简短的重定向提示，建议模型换一种思路（每轮最多 r = 1 次）；如果重定向之后这一轮依然在原地打转，插件只会打印一行提示告诉你当前智能体该如何手动中断（如按 Esc），是否停下完全由你决定。',
  },
  {
    q: '同一个仓库有多个 git worktree 或多个克隆目录，学到的经验会共享吗？',
    a: '会自动共享。插件通过 git origin 远端地址识别仓库身份，因此同一仓库的所有克隆、子目录和 git worktree 共享同一份微技能事实、工具证据与循环包络统计；而工具剪枝生成的本地配置文件（如 .claude/settings.local.json）则按各自的检出目录独立维护，并自动加入 .git/info/exclude 避免污染 git 状态。',
  },
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
    desc: '安装、命令、设置、各智能体行为，以及架构拆解、验证细节、实验复现与故障排查。',
    group: '',
  },
  {
    path: '/docs/quickstart',
    title: '快速开始',
    desc: '五种智能体的安装、检查、更新、卸载、BYOK 配置，以及支持的版本范围。',
    group: '使用',
  },
  {
    path: '/docs/commands',
    title: '日常命令',
    desc: '全部 15 条命令详解：status、microskills、toolprune、config、repomap、repos 与 doctor。',
    group: '使用',
  },
  {
    path: '/docs/settings',
    title: '设置',
    desc: '九项核心设置、三档循环守卫预设阈值表、第四机制仓库地图（repomap）、rtk 协同与环境变量。',
    group: '使用',
  },
  {
    path: '/docs/agents',
    title: '各智能体上的行为',
    desc: '工具剪枝在每种智能体上排除什么、写到哪里，模型调用如何计费，以及卡住时如何停下。',
    group: '使用',
  },
  {
    path: '/docs/troubleshooting',
    title: '故障排查与诊断',
    desc: 'te doctor 自检、te probe 真机探测、errors.log 常见报错修复，以及高频问题解答。',
    group: '使用',
  },
  {
    path: '/docs/architecture',
    title: '架构与接口设计',
    desc: '四大标准库抽象接口、六个生命周期钩子逐一拆解，以及插件与论文实验设置的 8 项对照。',
    group: '深入与参考',
  },
  {
    path: '/docs/plugin-internals',
    title: '插件验证与状态隐私',
    desc: '各智能体实测验证记录、Prompt Caching 保护机制、提示级 vs 会话级消融、仓库识别与隐私边界。',
    group: '深入与参考',
  },
  {
    path: '/docs/experiments',
    title: '复现论文实验',
    desc: 'SWE-Bench 与 Web-Bench 完整复现指南：Docker 镜像、5 步配置、实验组对照表与汇总对比脚本。',
    group: '深入与参考',
  },
  {
    path: '/docs/repo',
    title: '仓库结构',
    desc: '包的九个核心目录、离线测试与自包含插件构建方式。',
    group: '深入与参考',
  },
  {
    path: '/docs/citation',
    title: '引用与许可',
    desc: '论文 BibTeX 条目、三家署名研究机构与 Apache 2.0 许可证。',
    group: '深入与参考',
  },
] as const
