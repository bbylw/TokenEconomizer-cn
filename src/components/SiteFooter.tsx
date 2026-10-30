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
        <h5>代码</h5>
        <a href={`${REPO}/tree/main/tokeneconomizer/microskills`} target="_blank" rel="noreferrer">
          microskills
        </a>
        <a href={`${REPO}/tree/main/tokeneconomizer/toolprune`} target="_blank" rel="noreferrer">
          toolprune
        </a>
        <a href={`${REPO}/tree/main/tokeneconomizer/loopguard`} target="_blank" rel="noreferrer">
          loopguard
        </a>
        <a href={`${REPO}/tree/main/tokeneconomizer/trace`} target="_blank" rel="noreferrer">
          trace
        </a>
        <a href={`${REPO}/tree/main/plugin`} target="_blank" rel="noreferrer">
          plugin
        </a>
      </div>
      <div>
        <h5>文档</h5>
        <Link to="/docs/quickstart">快速开始</Link>
        <Link to="/docs/commands">日常命令</Link>
        <Link to="/docs/settings">设置</Link>
        <Link to="/docs/agents">各智能体上的行为</Link>
        <Link to="/docs/repo">仓库结构</Link>
      </div>
      <div>
        <h5>其他</h5>
        <a href="https://arxiv.org/abs/2610.22732" target="_blank" rel="noreferrer">
          arXiv 2610.22732
        </a>
        <a href="https://tokeneconomizer.github.io" target="_blank" rel="noreferrer">
          项目主页
        </a>
        <a href={`${REPO}/blob/main/experiments/README.md`} target="_blank" rel="noreferrer">
          复现实验
        </a>
        <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
          Apache 2.0 许可证
        </a>
      </div>
    </footer>
  )
}
