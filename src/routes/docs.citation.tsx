import { createFileRoute } from '@tanstack/react-router'
import { CodeBlock } from '../components/CodeBlock'
import { DocHeader, DocPager, pageHead } from '../components/DocParts'
import { REPO, bibtex } from '../data/content'

export const Route = createFileRoute('/docs/citation')({
  head: () =>
    pageHead(
      '引用与许可',
      '论文《TokenEconomizer: Experience-Driven Black-Box Cost Control for Coding Agents》的 BibTeX 引用条目、作者机构与 Apache 2.0 许可证。',
    ),
  component: CitationPage,
})

const toc = [
  { id: 'bibtex', label: '论文条目' },
  { id: 'authors', label: '作者与单位' },
  { id: 'license', label: '许可证' },
  { id: 'elsewhere', label: '其他入口' },
]

const units = [
  {
    name: '加州大学伯克利分校',
    people: ['Aaron J. Li', 'Bin Yu', 'Ion Stoica'],
  },
  {
    name: '微软研究院',
    people: ['Weijia Xu', 'Chandan Singh', 'Jeevana Priya Inala', 'Michel Galley', 'Jianfeng Gao'],
  },
  {
    name: '微软安全部门',
    people: ['Zixiao Chen', 'Charlotte Siska', 'Acar Tamersoy'],
  },
]

function CitationPage() {
  return (
    <>
      <DocHeader
        title="引用与许可"
        lead="论文《TokenEconomizer: Experience-Driven Black-Box Cost Control for Coding Agents》的条目、作者单位与代码许可。"
        toc={toc}
      />

      <div className="prose">
        <h2 id="bibtex">论文条目</h2>
        <p>
          如果本站介绍的机制或数字对你的工作有帮助，请按下面的条目引用。arXiv 编号为{' '}
          <a href="https://arxiv.org/abs/2610.22732" target="_blank" rel="noreferrer">
            2610.22732
          </a>
          ，分类为 cs.CL。
        </p>
        <CodeBlock code={bibtex} label="bibtex" />

        <h2 id="authors">作者与单位</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: 170 }}>单位</th>
              <th>作者</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => (
              <tr key={u.name}>
                <td>
                  <strong>{u.name}</strong>
                </td>
                <td>{u.people.join('、')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 id="license">许可证</h2>
        <p>
          代码以 Apache 2.0 发布，见{' '}
          <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            LICENSE
          </a>
          。论文与项目主页的图表另按其各自页面说明使用。
        </p>

        <h2 id="elsewhere">其他入口</h2>
        <ul>
          <li>
            <a href="https://tokeneconomizer.github.io" target="_blank" rel="noreferrer">
              项目主页
            </a>
            ：可交互的图表、按仓库拆分的数字，以及九条带注释的运行记录。
          </li>
          <li>
            <a href="https://arxiv.org/abs/2610.22732" target="_blank" rel="noreferrer">
              arXiv 摘要页
            </a>
            ：论文全文与 PDF。
          </li>
          <li>
            <a href={REPO} target="_blank" rel="noreferrer">
              GitHub 仓库
            </a>
            ：代码、插件、实验与文档。
          </li>
          <li>
            <a href="https://x.com/aaron_jli/status/2114797313613053952" target="_blank" rel="noreferrer">
              X 上的发布动态
            </a>
            ：作者本人的简短介绍。
          </li>
        </ul>
      </div>

      <DocPager current="/docs/citation" />
    </>
  )
}
