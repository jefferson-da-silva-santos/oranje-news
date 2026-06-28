import { useState, useEffect, useRef, useCallback } from "react";
import {
  articlesApi, standingsApi, convocationApi, fixturesApi, nationsApi,
  scorersApi, configApi, normalizeArticle,
  type Article, type Standing, type Convocation, type Fixture,
  type NationsGroup, type TopScorer, type SiteConfig,
} from "./api";
import { useNotyf } from "./useNotyf";
import Admin from "./Admin";

// ─── Widgets ──────────────────────────────────────────────────────────────────
function StandingsWidget({ standing }: { standing: Standing | null }) {
  if (!standing) return null;
  return (
    <div className="widget">
      <div className="widget-head"><i className="bx bxs-trophy widget-head-icon"/><span>{standing.title}</span></div>
      <div className="widget-table-wrap">
        <table className="wtable">
          <thead><tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>Pts</th></tr></thead>
          <tbody>
            {standing.entries.map(r=>(
              <tr key={r.id} className={r.champion?"row-champ":r.relegation?"row-rel":""}>
                <td className={`pos ${r.clSpot?"cl":r.elSpot?"el":r.relegation?"rd":""}`}>{r.position}</td>
                <td className="tname tl">{r.team}{r.champion&&" 🏆"}</td>
                <td>{r.played}</td><td>{r.wins}</td><td>{r.draws}</td><td>{r.losses}</td>
                <td className={r.goalDiff.startsWith("+")?"pos-sg":"neg-sg"}>{r.goalDiff}</td>
                <td className="pts">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {standing.footer && <p className="widget-foot">{standing.footer}</p>}
    </div>
  );
}

function NationsWidget({ nations }: { nations: NationsGroup | null }) {
  if (!nations) return null;
  return (
    <div className="widget">
      <div className="widget-head"><i className="bx bx-flag widget-head-icon"/><span>{nations.title}</span></div>
      <div className="widget-table-wrap">
        <table className="wtable">
          <thead><tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Pts</th></tr></thead>
          <tbody>
            {nations.entries.map(r=>(
              <tr key={r.id} className={r.highlight?"row-champ":""}>
                <td className={`pos ${r.position===1?"cl":""}`}>{r.position}</td>
                <td className="tname tl">{r.team}{r.highlight&&" 🇳🇱"}</td>
                <td>{r.played}</td><td>{r.wins}</td><td>{r.draws}</td><td>{r.losses}</td>
                <td className="pts">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {nations.footer && <p className="widget-foot">{nations.footer}</p>}
    </div>
  );
}

function ScorersWidget({ scorers }: { scorers: TopScorer[] }) {
  if (!scorers.length) return null;
  return (
    <div className="widget">
      <div className="widget-head"><i className="bx bxs-star widget-head-icon"/><span>Artilheiros Históricos</span></div>
      <div className="scorers">
        {scorers.map(s=>(
          <div key={s.id} className="scorer-row">
            <span className={`sc-rank${s.rank===1?" sc-gold":s.rank===2?" sc-silver":s.rank===3?" sc-bronze":""}`}>{s.rank}</span>
            <span className="sc-name">{s.name}</span>
            <span className="sc-goals">{s.goals} <i className="bx bx-football"/></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({article,onClick}:{article:Article;onClick:()=>void}) {
  return (
    <article className="news-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}>
      <div className="news-thumb"><img src={article.image} alt={article.title} className="thumb-img"/></div>
      <div className="news-info">
        <p className="news-cat">
          <span className="cat-text">{article.category.name}</span>
          {article.club&&<><span className="dot">·</span><span className="club-text">{article.club}</span></>}
        </p>
        <h3 className="news-title">{article.title}</h3>
        <p className="news-date"><i className="bx bx-calendar"/> {article.date}</p>
      </div>
    </article>
  );
}

function HeroCard({article,size,onClick}:{article:Article;size:"large"|"small";onClick:()=>void}) {
  return (
    <article className={`hero-${size}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}>
      <img src={article.image} alt={article.title} className="hero-img"/>
      <div className="hero-overlay"/>
      <div className="hero-body">
        <span className={`badge ${article.category.badgeClass}`}>{article.category.name}</span>
        {size==="large"
          ?<h2 className="hero-title">{article.title}</h2>
          :<h3 className="hero-sub-title">{article.title}</h3>}
        <p className="hero-meta"><i className="bx bx-time-five"/> {article.meta}</p>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="layout-grid">
      <main className="main">
        <div className="skeleton-hero-grid">
          <div className="skeleton skeleton-hero-large"/>
          <div className="skeleton-hero-sub">
            <div className="skeleton skeleton-hero-small"/>
            <div className="skeleton skeleton-hero-small"/>
          </div>
        </div>
        <div className="news-grid" style={{marginTop:"1.5rem"}}>
          {[1,2,3].map(i=><div key={i} className="skeleton skeleton-card"/>)}
        </div>
      </main>
      <aside className="sidebar"><div className="skeleton skeleton-widget"/></aside>
    </div>
  );
}

// ─── Article Page ─────────────────────────────────────────────────────────────
function ArticlePage({ article, articles, standing, nations, onBack, onOpen }: {
  article: Article; articles: Article[]; standing: Standing|null; nations: NationsGroup|null;
  onBack: ()=>void; onOpen: (a:Article)=>void;
}) {
  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[]);
  const related = articles.filter(a=>a.id!==article.id&&a.category.id===article.category.id).slice(0,2);
  const readTime = Math.max(1, Math.ceil(article.body.join(" ").split(" ").length/200));
  return (
    <div className="article-layout">
      <main className="main">
        <nav className="breadcrumb">
          <button className="bread-link" onClick={onBack}><i className="bx bx-home-alt"/> Início</button>
          <i className="bx bx-chevron-right bread-sep"/>
          <span className="bread-current">{article.category.name}</span>
        </nav>
        <div className="art-hero-img">
          <img src={article.image} alt={article.title}/>
          <div className="art-hero-gradient"/>
        </div>
        <article className="art-card">
          <header className="art-header">
            <div className="art-badges">
              <span className={`badge ${article.category.badgeClass}`}>{article.category.name}</span>
              {article.club&&<span className="badge badge-grey">{article.club}</span>}
            </div>
            <h1 className="art-title">{article.title}</h1>
            <div className="art-meta-row">
              <span className="art-meta-item"><i className="bx bx-calendar"/> {article.date}</span>
              <span className="art-meta-item"><i className="bx bx-time-five"/> {readTime} min de leitura</span>
            </div>
          </header>
          <div className="art-body">{article.body.map((p,i)=><p key={i}>{p}</p>)}</div>
          <footer className="art-footer">
            <div className="art-tags">
              {article.tags.map(t=><span key={t} className="art-tag"><i className="bx bx-hash"/>{t}</span>)}
            </div>
            <button className="back-btn" onClick={onBack}><i className="bx bx-arrow-back"/> Voltar</button>
          </footer>
        </article>
        {related.length>0&&(
          <section className="related-section">
            <div className="sec-head"><span className="sec-label"><i className="bx bx-news"/> Relacionadas</span></div>
            <div className={`news-grid cols-${related.length}`}>
              {related.map(n=><ArticleCard key={n.id} article={n} onClick={()=>onOpen(n)}/>)}
            </div>
          </section>
        )}
      </main>
      <aside className="sidebar">
        <StandingsWidget standing={standing}/>
        <NationsWidget nations={nations}/>
      </aside>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({ articles, standing, nations, onOpen }: {
  articles: Article[]; standing: Standing|null; nations: NationsGroup|null; onOpen:(a:Article)=>void;
}) {
  const published  = articles.filter(a=>a.published);
  const highlights = published.slice(0,3);
  const moreNews   = published.slice(3,6);
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head"><span className="sec-label"><i className="bx bxs-star"/> Destaques</span></div>
          {highlights.length>0?(
            <div className="hero-grid">
              <HeroCard article={highlights[0]} size="large" onClick={()=>onOpen(highlights[0])}/>
              {highlights.length>1&&(
                <div className="hero-sub">
                  {highlights.slice(1).map(h=><HeroCard key={h.id} article={h} size="small" onClick={()=>onOpen(h)}/>)}
                </div>
              )}
            </div>
          ):(
            <div className="empty-state"><i className="bx bx-news"/><p>Nenhum artigo publicado ainda.</p></div>
          )}
        </section>
        {moreNews.length>0&&(
          <section className="page-section">
            <div className="sec-head"><span className="sec-label"><i className="bx bx-news"/> Mais Notícias</span></div>
            <div className="news-grid">{moreNews.map(n=><ArticleCard key={n.id} article={n} onClick={()=>onOpen(n)}/>)}</div>
          </section>
        )}
      </main>
      <aside className="sidebar">
        <StandingsWidget standing={standing}/>
        <NationsWidget nations={nations}/>
      </aside>
    </div>
  );
}

function EredivisieePage({ articles, standing, config, onOpen }: {
  articles: Article[]; standing: Standing|null; config: SiteConfig; onOpen:(a:Article)=>void;
}) {
  const news = articles.filter(a=>a.category.name==="Eredivisie"&&a.published);
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head"><span className="sec-label"><i className="bx bxs-trophy"/> {standing?.title||"Eredivisie"}</span></div>
          {config.eredivisie_intro && (
            <p className="page-intro" dangerouslySetInnerHTML={{__html: config.eredivisie_intro.replace(/PSV Eindhoven/g,"<strong>PSV Eindhoven</strong>")}}/>
          )}
        </section>
        <section className="page-section">
          <div className="sec-head"><span className="sec-label"><i className="bx bx-news"/> Notícias</span></div>
          {news.length>0
            ?<div className="news-grid">{news.map(n=><ArticleCard key={n.id} article={n} onClick={()=>onOpen(n)}/>)}</div>
            :<div className="empty-state"><i className="bx bx-news"/><p>Nenhuma notícia da Eredivisie.</p></div>}
        </section>
        {standing && (
          <section className="page-section">
            <div className="sec-head"><span className="sec-label"><i className="bx bx-bar-chart-alt-2"/> Classificação Final</span></div>
            <div className="table-wrap">
              <table className="full-table">
                <thead><tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>Pts</th></tr></thead>
                <tbody>
                  {standing.entries.map(r=>(
                    <tr key={r.id} className={r.champion?"row-champ":r.relegation?"row-rel":""}>
                      <td className={`pos ${r.clSpot?"cl":r.elSpot?"el":r.relegation?"rd":""}`}>{r.position}</td>
                      <td className="tname tl">{r.team}{r.champion&&" 🏆"}</td>
                      <td>{r.played}</td><td>{r.wins}</td><td>{r.draws}</td><td>{r.losses}</td>
                      <td className={r.goalDiff.startsWith("+")?"pos-sg":"neg-sg"}>{r.goalDiff}</td>
                      <td className="pts">{r.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-legend">
                <span><span className="leg cl"/> Champions League</span>
                <span><span className="leg el"/> Europa League</span>
                <span><span className="leg rd"/> Rebaixamento</span>
              </div>
            </div>
          </section>
        )}
      </main>
      <aside className="sidebar"><StandingsWidget standing={standing}/></aside>
    </div>
  );
}

function SelecaoPage({ articles, nations, scorers, convocation, fixtures, onOpen }: {
  articles: Article[]; nations: NationsGroup|null; scorers: TopScorer[];
  convocation: Convocation|null; fixtures: Fixture[]; onOpen:(a:Article)=>void;
}) {
  const news = articles.filter(a=>a.category.name==="Seleção Holandesa"&&a.published);
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head"><span className="sec-label"><i className="bx bx-flag"/> Seleção Holandesa</span></div>
          {news.map(n=><HeroCard key={n.id} article={n} size="large" onClick={()=>onOpen(n)}/>)}
        </section>

        {convocation && convocation.groups.length > 0 && (
          <section className="page-section">
            <div className="sec-head"><span className="sec-label"><i className="bx bxs-group"/> {convocation.title}</span></div>
            <div className="conv-grid">
              {convocation.groups.map(g=>(
                <div key={g.id} className="conv-group">
                  <h4 className="conv-pos"><i className="bx bx-chevron-right"/> {g.position}</h4>
                  <ul>{g.players.map(j=><li key={j}><i className="bx bx-user"/> {j}</li>)}</ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {fixtures.length > 0 && (
          <section className="page-section">
            <div className="sec-head"><span className="sec-label"><i className="bx bx-calendar-event"/> Próximos Jogos</span></div>
            <div className="fixtures">
              {fixtures.map(f=>(
                <div key={f.id} className="fixture">
                  <div className="fx-date"><span className="fx-day">{f.day}</span><span className="fx-month">{f.month}</span></div>
                  <div className="fx-mid">
                    <span className="fx-comp"><i className="bx bx-trophy"/> {f.competition}</span>
                    <div className="fx-teams">
                      <span className={f.homeTeam==="Holanda"?"fx-team hl":"fx-team"}>{f.homeTeam}</span>
                      <span className="fx-vs">vs</span>
                      <span className={f.awayTeam==="Holanda"?"fx-team hl":"fx-team"}>{f.awayTeam}</span>
                    </div>
                  </div>
                  <div className="fx-time"><i className="bx bx-time"/> {f.time}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <aside className="sidebar">
        <NationsWidget nations={nations}/>
        <ScorersWidget scorers={scorers}/>
      </aside>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
type Page = "home"|"eredivisie"|"selecao";

export default function App() {
  const [articles,    setArticles]    = useState<Article[]>([]);
  const [standing,    setStanding]    = useState<Standing|null>(null);
  const [nations,     setNations]     = useState<NationsGroup|null>(null);
  const [scorers,     setScorers]     = useState<TopScorer[]>([]);
  const [convocation, setConvocation] = useState<Convocation|null>(null);
  const [fixtures,    setFixtures]    = useState<Fixture[]>([]);
  const [config,      setConfig]      = useState<SiteConfig>({});
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState<Page>("home");
  const [article,     setArticle]     = useState<Article|null>(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [ereOpen,     setEreOpen]     = useState(false);
  const [adminMode,   setAdminMode]   = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const notyf  = useNotyf();

  const today = new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [artRes, st, nat, sc, conv, fix, cfg] = await Promise.all([
        articlesApi.list({ published: true, limit: 50 }),
        standingsApi.get(),
        nationsApi.get(),
        scorersApi.list(),
        convocationApi.get(),
        fixturesApi.list(),
        configApi.get(),
      ]);
      setArticles(artRes.articles.map(normalizeArticle));
      setStanding(st);
      setNations(nat);
      setScorers(sc);
      setConvocation(conv);
      setFixtures(fix);
      setConfig(cfg);
    } catch {
      notyf.error("Erro ao carregar dados. Verifique a conexão com a API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(()=>{ loadAll(); },[loadAll]);

  useEffect(()=>{
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setEreOpen(false); setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  },[]);

  function nav(p: Page) {
    setPage(p); setArticle(null); setMenuOpen(false); setEreOpen(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function openArticle(a: Article) { setArticle(a); window.scrollTo({top:0,behavior:"smooth"}); }
  function closeArticle() { setArticle(null); window.scrollTo({top:0,behavior:"smooth"}); }
  function exitAdmin() { loadAll(); setAdminMode(false); }

  const siteName    = config.site_name    || "Futebol Holandês";
  const siteSub     = config.site_sub     || "tudo sobre o futebol da Holanda";
  const footerTag   = config.site_tagline || "Tudo sobre o futebol da Holanda em português";
  const footerCopy  = config.footer_copy  || "© 2026 Futebol Holandês · Todos os direitos reservados";

  if (adminMode) return <Admin onExit={exitAdmin}/>;

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-inner">
          <button className="logo-btn" onClick={()=>nav("home")}>
            <img src="logo.png" alt={siteName} className="logo-img"/>
            <div className="logo-text">
              <span className="logo-title">{siteName}</span>
              <span className="logo-sub">{siteSub}</span>
            </div>
          </button>
          <div className="topbar-right">
            <span className="topbar-date"><i className="bx bx-calendar"/> {today}</span>
            <button className="adm-trigger-btn" onClick={()=>setAdminMode(true)} title="Painel Admin">
              <i className="bx bxs-dashboard"/>
            </button>
          </div>
        </div>
      </div>

      <nav className="navbar" ref={navRef}>
        <div className="nav-inner">
          <div className="nav-links">
            <button className={`nav-btn${page==="home"&&!article?" nav-active":""}`} onClick={()=>nav("home")}>
              <i className="bx bx-home-alt"/> Todas
            </button>
            <div className="nav-dropdown">
              <button className={`nav-btn${page==="eredivisie"&&!article?" nav-active":""}`} onClick={()=>setEreOpen(o=>!o)}>
                <i className="bx bxs-trophy"/> Eredivisie
                <i className={`bx ${ereOpen?"bx-chevron-up":"bx-chevron-down"} chevron-icon`}/>
              </button>
              {ereOpen&&(
                <div className="dropdown">
                  <button onClick={()=>nav("eredivisie")}><i className="bx bx-bar-chart-alt-2"/> Classificação</button>
                  <button onClick={()=>nav("eredivisie")}><i className="bx bx-football"/> Resultados</button>
                  <button onClick={()=>nav("eredivisie")}><i className="bx bx-news"/> Notícias</button>
                </div>
              )}
            </div>
            <button className={`nav-btn${page==="selecao"&&!article?" nav-active":""}`} onClick={()=>nav("selecao")}>
              <i className="bx bx-flag"/> Seleção Holandesa
            </button>
          </div>
          <button className="hamburger" onClick={()=>{setMenuOpen(o=>!o);setEreOpen(false);}} aria-label="Menu">
            <i className={`bx ${menuOpen?"bx-x":"bx-menu"}`}/>
          </button>
        </div>
        {menuOpen&&(
          <div className="mobile-drawer">
            <button className={`mob-link${page==="home"?" mob-active":""}`} onClick={()=>nav("home")}><i className="bx bx-home-alt"/> Todas</button>
            <button className={`mob-link${page==="eredivisie"?" mob-active":""}`} onClick={()=>nav("eredivisie")}><i className="bx bxs-trophy"/> Eredivisie</button>
            <button className={`mob-link${page==="selecao"?" mob-active":""}`} onClick={()=>nav("selecao")}><i className="bx bx-flag"/> Seleção Holandesa</button>
            <button className="mob-link" onClick={()=>setAdminMode(true)}><i className="bx bxs-dashboard"/> Painel Admin</button>
          </div>
        )}
      </nav>

      <div className="container">
        {loading ? <PageSkeleton/> : article
          ? <ArticlePage article={article} articles={articles} standing={standing} nations={nations} onBack={closeArticle} onOpen={openArticle}/>
          : page==="home"       ? <HomePage articles={articles} standing={standing} nations={nations} onOpen={openArticle}/>
          : page==="eredivisie" ? <EredivisieePage articles={articles} standing={standing} config={config} onOpen={openArticle}/>
          : <SelecaoPage articles={articles} nations={nations} scorers={scorers} convocation={convocation} fixtures={fixtures} onOpen={openArticle}/>
        }
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <img src="logo.png" alt={siteName} className="footer-logo-img"/>
          <p className="footer-title">{siteName}</p>
          <p className="footer-tagline">{footerTag}</p>
          <p className="footer-copy">{footerCopy}</p>
        </div>
      </footer>
    </div>
  );
}