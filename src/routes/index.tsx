import { createFileRoute, Link } from '@tanstack/react-router'
import { Meter } from '../components/Meter'
import { InstallTabs } from '../components/InstallTabs'
import { results } from '../data/content'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="wrap">
      <section className="hero">
        <div className="hero-copy">
          <div className="meta-line">
            <span>
              <i />
              微软研究院
            </span>
            <span>加州大学伯克利分校</span>
            <span>arXiv 2610.22732</span>
          </div>
          <h1>
            同一个仓库里，
            <br />
            不该从头学两遍。
          </h1>
          <p className="lede">
            编码智能体每开一个会话，都要重新摸索一遍仓库：构建怎么跑、命令怎么写、哪些工具根本用不上。TokenEconomizer
            把这些答案从已跑过的会话里记下来。插件不改动模型、权重与代码。
          </p>
          <div className="cta-row">
            <a className="btn btn-solid" href="#install">
              开始安装
            </a>
            <Link className="btn btn-line" to="/docs">
              读文档
            </Link>
          </div>
          <div className="agents">
            <b>支持</b>
            <span className="chip">Claude Code</span>
            <span className="chip">Codex</span>
            <span className="chip">Copilot CLI</span>
            <span className="chip">Pi</span>
            <span className="chip">opencode · 实验性</span>
          </div>
        </div>

        <div className="hero-meter">
          <Meter />
        </div>
      </section>

      <section className="stats">
        <div className="stat">
          <span className="n a">18.4–30.9%</span>
          <span className="l">五种「智能体–模型」组合的平均成本降幅</span>
        </div>
        <div className="stat">
          <span className="n">30 / 30</span>
          <span className="l">「仓库 × 组合」单元中更便宜的个数</span>
        </div>
        <div className="stat">
          <span className="n c">4 / 5</span>
          <span className="l">Pass@1 有所提升的组合数</span>
        </div>
        <div className="stat">
          <span className="n">277</span>
          <span className="l">SWE-Bench 任务，来自六个仓库</span>
        </div>
      </section>

      <div className="sec-head" id="mech">
        <h2>三种机制，各管一类浪费</h2>
        <p className="sec-note">每种机制都能单独开关；斜体字母是各自的设置，均有默认值。</p>
      </div>

      <section className="mech">
        <article className="tile">
          <div className="tile-top">
            <h3>
              微技能 <i>microskills</i>
            </h3>
            <p>
              <b>记住仓库是怎么运作的。</b>
              构建必须先跑哪一步、命令在这里该怎么写、需要哪个环境变量、生成文件落在哪里。事实来自两处：跨会话反复出现的失败，以及每隔
              <b>k</b> 个会话审阅近期会话的模型。
            </p>
          </div>
          <figure>
            <div className="sess-row">
              <span className="sess">S1</span>
              <span className="sess">S2</span>
              <span className="sess">S3</span>
              <span className="sess on">S4</span>
              <span className="sess on">S5</span>
              <span className="sess on">S6</span>
              <span className="sess on">S7</span>
            </div>
            <div className="fig-cap">连续三个会话都确认，事实从 S4 起每轮陈述一次</div>
          </figure>
          <div className="params">
            <span className="param">
              k = <b>3</b>
            </span>
            <span className="param">
              确认 <b>3</b> 次后陈述
            </span>
            <span className="param">被推翻即丢弃</span>
          </div>
        </article>

        <article className="tile">
          <div className="tile-top">
            <h3>
              工具剪枝 <i>tool pruning</i>
            </h3>
            <p>
              <b>停止加载用不到的工具。</b>
              每个被加载的工具定义都会随每次请求一起发送。一个工具若横跨 <b>m</b> 个会话、在 <b>p</b>{' '}
              次提示中未被使用，或在任意长度的 <b>s</b> 个会话中未被使用，就会通过智能体自身的设置被排除。
            </p>
          </div>
          <figure>
            <div className="tool-row">
              <span className="tool">Read</span>
              <span className="tool">Edit</span>
              <span className="tool">Bash</span>
              <span className="tool">Grep</span>
              <span className="tool cut">Notebook</span>
              <span className="tool cut">Browser</span>
            </div>
            <div className="fig-cap">横跨两个会话、十次提示都没用到，才会被排除</div>
          </figure>
          <div className="params">
            <span className="param">
              p = <b>10</b>
            </span>
            <span className="param">
              m = <b>2</b>
            </span>
            <span className="param">
              s = <b>5</b>
            </span>
            <span className="param">
              q = <b>60</b> 分钟
            </span>
          </div>
        </article>

        <article className="tile">
          <div className="tile-top">
            <h3>
              失败循环干预 <i>loop guard</i>
            </h3>
            <p>
              <b>在某一轮卡住时介入。</b>
              当一轮持续撞上同样的失败，裁判模型判断它是否卡住；把握达到 <b>c</b> 时注入一条重定向，每轮最多{' '}
              <b>r</b> 次。之后仍然卡住，它会告诉你怎么停下，而它自己绝不终止某一轮。
            </p>
          </div>
          <figure>
            <div className="trace">
              <i>
                <b>×</b>
                <span>ModuleNotFoundError: pytest</span>
              </i>
              <i>
                <b>×</b>
                <span>ModuleNotFoundError: pytest</span>
              </i>
              <i>
                <b>×</b>
                <span>ModuleNotFoundError: pytest</span>
                <em>重定向</em>
              </i>
            </div>
            <div className="fig-cap">同样的失败第三次出现，裁判确认后注入一条提示</div>
          </figure>
          <div className="params">
            <span className="param">
              c = <b>0.7</b>
            </span>
            <span className="param">
              r = <b>1</b>
            </span>
            <span className="param">
              b = <b>2.5</b>×
            </span>
            <span className="param">绝不自行终止</span>
          </div>
        </article>
      </section>

      <div className="sec-head" id="principles">
        <h2>为什么这些浪费会重复</h2>
        <p className="sec-note">智能体被设计来完成任务，而不是来省钱。</p>
      </div>

      <section className="why">
        <p>
          每一轮都要为智能体的指令、每个被加载的工具，以及到目前为止的对话重新付费。开发者在同一仓库上反复使用同一个智能体，于是大量成本被重复支付：同样的事实被重新发现、同样的未用工具被发送、同样类型的失败循环。
        </p>
        <p>
          TokenEconomizer 不去动智能体的模型、权重和代码，而是跨仓库的多个会话去学习，而不是把每个会话孤立对待，因此插件付出的任何开销，都会在后续会话中回本。
        </p>
      </section>

      <section className="principles">
        <div className="pr">
          <h4>经由智能体本就在读的东西</h4>
          <p>事实在会话开始时进入上下文，工具通过智能体自身的设置被移除，因此不依赖智能体学会一个新的工具。</p>
        </div>
        <div className="pr">
          <h4>按账单上的方式计算成本</h4>
          <p>一个会话里大多数 token 都是带缓存的重读，因此成本按缓存定价计算，并且包含了插件自身的模型调用。</p>
        </div>
        <div className="pr">
          <h4>保护任务成功率</h4>
          <p>事实只从反复出现的证据中形成，工具只在长期未用之后才被移除，而循环守卫会放过仍在推进的某一轮。</p>
        </div>
        <div className="pr">
          <h4>让每个动作都可逆</h4>
          <p>被后续会话推翻的事实会被丢弃，被移除的工具可以还给智能体，循环守卫只会重定向并告诉你：是否停掉某一轮，由你决定。</p>
        </div>
      </section>

      <div className="sec-head" id="results">
        <h2>在 277 个 SWE-Bench 任务上实测</h2>
        <p className="sec-note">六个仓库、五种组合，一开始什么都还没学到；成本包含插件发出的每一次模型调用。</p>
      </div>

      <section className="results">
        <div className="res-table">
          <table>
            <thead>
              <tr>
                <th>智能体–模型</th>
                <th className="r">成本</th>
                <th className="r">Pass@1</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={`${r.agent}-${r.model}`}>
                  <td className="agent">
                    {r.agent}
                    <small>{r.model}</small>
                  </td>
                  <td className="num good">{r.cost}</td>
                  <td className={r.good ? 'num good' : 'num bad'}>{r.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="res-foot">
            <span>
              每个仓库内部：<b>5–40%</b>
            </span>
            <span>
              Web-Bench：<b>16–21%</b>
            </span>
            <span>
              安全审计基准：<b>6–20%</b>
            </span>
            <span>
              完整数据：<a href="https://tokeneconomizer.github.io" target="_blank" rel="noreferrer">
                项目主页
              </a>
            </span>
          </div>
        </div>

        <div className="res-side">
          <h4>成本降幅</h4>
          <p className="hint">同一批任务，与各自的默认配置相比。</p>
          <div className="bar-row">
            <div className="bl">
              <span>Opus 4.8</span>
              <em>−30.9%</em>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="bar-row">
            <div className="bl">
              <span>GPT-5.6 Sol</span>
              <em>−26.1%</em>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '84%' }} />
            </div>
          </div>
          <div className="bar-row">
            <div className="bl">
              <span>GPT-5.6 Terra</span>
              <em>−24.7%</em>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '80%' }} />
            </div>
          </div>
          <div className="bar-row">
            <div className="bl">
              <span>Sonnet 5 / Claude Code</span>
              <em>−23.6%</em>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '76%' }} />
            </div>
          </div>
          <div className="bar-row">
            <div className="bl">
              <span>Sonnet 5 / Copilot CLI</span>
              <em>−18.4%</em>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: '60%' }} />
            </div>
          </div>
          <p className="res-tail">
            Pass@1 的下降只出现在 Opus 4.8；其余四种组合在变便宜的同时更准。Web-Bench 上同样成立（16–21%），在两个「每个任务都在全新仓库里」的安全审计基准上也成立（6–20%）。
          </p>
        </div>
      </section>

      <div className="sec-head" id="install">
        <h2>快速开始</h2>
        <p className="sec-note">
          需要已登录的智能体之一，以及 PATH 上的 Python 3.10+。插件不需要自己的 API 密钥，也从不处理凭证。
        </p>
      </div>

      <InstallTabs />

      <section className="next-band">
        <p>
          装好就照常工作，插件不需要你做任何事。想知道它学到了什么、改了哪些设置、每个智能体的细节差别，去文档里看。
        </p>
        <Link className="btn btn-line" to="/docs">
          打开文档
        </Link>
      </section>
    </main>
  )
}
