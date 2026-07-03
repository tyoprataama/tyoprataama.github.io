import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useReveal from '../hooks/useReveal.js'
import { fetchArticles } from '../api/articles.js'
import { projects, experiences } from '../data/portfolio.js'
import { sortPinnedThenDate, getExcerpt } from '../lib/helpers.js'

const scrollTo = (id) => (e) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const facts = [
  { k: 'Education', v: '3.56', s: ' / 4.00 GPA' },
  { k: 'Certification', v: 'AK3 Umum', s: ' BNSP & Kemnaker' },
  { k: 'Discipline', v: 'Data', s: ' & Operations' },
  { k: 'Focus', v: 'Mining', s: ' & Resource' },
]

export default function Home() {
  const [articles, setArticles] = useState([])
  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error)
  }, [])
  const latest = sortPinnedThenDate(articles).slice(0, 3)
  useReveal([articles])

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div>
            <div className="lead-eyebrow fade">
              <span className="dot" />
              <span className="eyebrow">Available for work</span>
            </div>
            <h1 className="fade">
              Turning economics, data
              and field <em className="u">safety</em> into
              real <em>impact</em>.
            </h1>
            <p className="sub fade">
              Fresh graduate blending economics, data analysis, software, and real operational
              experience. Certified in Occupational Health &amp; Safety (AK3 Umum), building toward
              Indonesia’s mining &amp; resource industry.
            </p>
            <div className="actions fade">
              <a href="#work" className="btn btn-solid" onClick={scrollTo('work')}>
                Selected work <span className="arw">↗</span>
              </a>
            <Link to="/blog" className="btn btn-line">
            Read my writing
            </Link>
            </div>
          </div>
          <aside className="fade">
            <div className="meta">
              <div className="k">Based in</div>
              <div className="v">Kediri, East Java, ID</div>
            </div>
            <div className="meta">
              <div className="k">Focus</div>
              <div className="v">Mining &amp; Resource Industry</div>
            </div>
          </aside>
        </div>
      </section>

      <div className="wrap">
        <hr className="rule" />
      </div>

      {/* ---------------- WORK ---------------- */}
      <section className="section" id="work">
        <div className="wrap">
          <div className="shead sr">
            <h2>Selected work</h2>
            <span className="no">01 / Projects</span>
          </div>
          <div>
            {projects.map((p, i) => (
              <div className="work-item sr" key={i}>
                <div className="wmain">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="stack">
                    {p.tech.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  {p.links && (
                    <a
                      className="btn btn-line wbtn"
                      href={p.links}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View project <span className="arw">↗</span>
                    </a>
                  )}
                </div>
                <div className="wnum">{`0${i + 1}`}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT (no photo) ---------------- */}
      <section className="section" id="about">
        <div className="wrap">
          <div className="shead sr">
            <h2>About</h2>
            <span className="no">02 / Profile</span>
          </div>
          <div className="about">
            <div className="body sr">
              <p>
                An economics graduate from IAIN Kediri, certified in Occupational Health &amp; Safety
                (AK3 Umum), currently managing family owned agricultural operations in East Java.
              </p>
              <p className="small">
                My background spans financial analysis, real field operations, data, and software
                engineering. I want to move into Indonesia’s mining and resource industry, bringing an
                analytical mindset, operational discipline, and K3 certification to contribute from
                day one.
              </p>
              <div className="facts">
                {facts.map((f) => (
                  <div className="f" key={f.k}>
                    <div className="k">{f.k}</div>
                    <div className="v">
                      {f.v} <small>{f.s}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- EXPERIENCE ---------------- */}
      <section className="section" id="experience">
        <div className="wrap">
          <div className="shead sr">
            <h2>Experience</h2>
            <span className="no">03 / Journey</span>
          </div>
          <div>
            {experiences.map((ex, i) => (
              <div className="exp sr" key={i}>
                <div className="when">{ex.period}</div>
                <div>
                  <div className="role">{ex.title}</div>
                  <div className="org">{ex.company}</div>
                  <div className="desc">{ex.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WRITING (with excerpt) ---------------- */}
      {latest.length > 0 && (
        <section className="section" id="writing">
          <div className="wrap">
            <div className="shead sr">
              <h2>Writing</h2>
              <span className="no">04 / Notes</span>
            </div>
            <div className="writing">
              {latest.map((a) => (
                <Link className="wrow sr" key={a.slug} to={`/blog/${a.slug}`}>
                  <div className="wtop">
                    <span className="tag">{a.tag}</span>
                    <span className="rt">{a.readTime}</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p className="wex">{getExcerpt(a.body)}</p>
                </Link>
              ))}
            </div>
            <Link to="/blog" className="morelink">
              Read all writing →
            </Link>
          </div>
        </section>
      )}

      {/* ---------------- CONTACT (avatar bulat kecil) ---------------- */}
      <section className="contact" id="contact">
        <div className="wrap">
          <div className="avatar sr">
            <img
              src={`${import.meta.env.BASE_URL}assets/profile.JPG`}
              alt="Tyo Pratama"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <span className="eyebrow sr">Let’s work together</span>
          <h2 className="sr">
            Say <em>hello</em>.
          </h2>
          <br />
          <a href="mailto:tyopriyantoputra@gmail.com" className="mail sr">
            tyopriyantoputra@gmail.com
          </a>
        </div>
      </section>
    </>
  )
}
