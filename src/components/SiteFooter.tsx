import { Link } from '@tanstack/react-router'
import { REPO, authors } from '../data/content'

export function SiteFooter() {
  return (
    <footer className="foot">
      <div>
        <h5>TokenEconomizer</h5>
        <p>面向编码智能体的、经验驱动的黑盒成本控制。让你经常工作的那些仓库里的智能体运行得更便宜。</p>
        <small>{authors.join('、')}</small>
      </div>
      <div>
        <h5>使用指南</h5>
        <Link to="/docs/quickstart">快速开始</Link>
        <Link to="/docs/commands">日常命令</Link>
        <Link to="/docs/settings">设置与阈值预设</Link>
        <Link to="/docs/agents">各智能体上的行为</Link>
        <Link to="/docs/troubleshooting">故障排查与诊断</Link>
      </div>
      <div>
        <h5>深入与参考</h5>
        <Link to="/docs/architecture">架构与接口设计</Link>
        <Link to="/docs/plugin-internals">插件验证与状态隐私</Link>
        <Link to="/docs/experiments">复现论文实验</Link>
        <Link to="/docs/repo">仓库结构</Link>
        <Link to="/docs/citation">引用与许可</Link>
      </div>
      <div>
        <h5>外部资源</h5>
        <a href="https://arxiv.org/abs/2610.22732" target="_blank" rel="noreferrer">
          arXiv 2610.22732
        </a>
        <a href="https://tokeneconomizer.github.io" target="_blank" rel="noreferrer">
          英文项目主页
        </a>
        <a href={REPO} target="_blank" rel="noreferrer">
          GitHub 源码仓库
        </a>
        <a href={`${REPO}/blob/main/experiments/README.md`} target="_blank" rel="noreferrer">
          experiments/README.md
        </a>
        <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
          Apache 2.0 许可证
        </a>
      </div>
    </footer>
  )
}
