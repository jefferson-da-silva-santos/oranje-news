import { useState, useEffect, useRef } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Article {
  id: number;
  category: string;
  catClass: string;
  club?: string;
  icon: string;
  title: string;
  meta: string;
  date: string;
  image: string;
  body: string[];
  tags: string[];
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    id: 1,
    category: "Eredivisie",
    catClass: "badge-orange",
    icon: "bx bxs-trophy",
    title: "PSV conquista seu 27º título holandês e faz história na Eredivisie",
    meta: "PSV Eindhoven · 5 de abril de 2026",
    date: "5 abr 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdqC2dqzi2AkWwStd7v_nPDrd_493yJudDQHLwLJ89ww&s=10",
    tags: ["PSV", "Eredivisie", "Campeonato"],
    body: [
      "O PSV Eindhoven escreveu mais um capítulo glorioso na história do futebol holandês ao conquistar seu 27º título da Eredivisie em 5 de abril de 2026 — o feito mais precoce na história da liga. O troféu foi confirmado de forma indireta: com o empate do Feyenoord em 0 a 0 diante do Volendam, a equipe de Peter Bosz abriu 17 pontos de vantagem na liderança, tornando matematicamente impossível qualquer reação dos rivais nas cinco rodadas restantes.",
      "A temporada 2025-26, oficialmente chamada de VriendenLoterij Eredivisie, foi a 70ª edição da principal divisão do futebol dos Países Baixos. O PSV, bicampeão consecutivo, entrou como favorito e não decepcionou: em 29 rodadas acumulava 23 vitórias, 2 empates e apenas 4 derrotas, com 82 gols marcados — números que refletem o domínio absoluto de uma equipe que raramente deu margem para surpresas.",
      "O treinador Peter Bosz, celebrado por seu estilo de jogo ofensivo e intenso, foi peça-chave na construção do grupo. Jogadores como Ruben van Bommel, eleito talento do mês em agosto, e Joey Veerman, melhor jogador de dezembro, foram destaques ao longo da campanha. O clube também contou com a solidez do goleiro Walter Benítez e a criatividade do meio-campo para sustentar sua hegemonia.",
      "Este título também representou um recorde histórico: o PSV superou sua própria marca de campeonato mais antecipado, anterior à data de 8 de abril de 1978. Além disso, entre as 20 principais ligas europeias da temporada, foi o primeiro clube a confirmar o título — antes mesmo do Bayern de Munique na Bundesliga e do Manchester City na Premier League.",
      "O Feyenoord terminou em segundo lugar com 61 pontos, seguido pelo NEC Nijmegen, que realizou uma das melhores campanhas de sua história recente ao somar 56 pontos e garantir vaga nas competições europeias. O Ajax ficou na quarta posição com 55 pontos, enquanto o FC Twente dividiu o mesmo número de pontos no quinto lugar.",
      "Três clubes foram rebaixados à Eerste Divisie: Zwolle (32 pts), Excelsior (26 pts) e Volendam (18 pts), que teve uma temporada para esquecer com apenas quatro vitórias em 34 jogos.",
    ],
  },
  {
    id: 2,
    category: "Eredivisie",
    catClass: "badge-orange",
    icon: "bx bxs-user-badge",
    title: "Ajax anuncia Míchel como novo treinador para a temporada 2026-27",
    meta: "Ajax · 25 de junho de 2026",
    date: "25 jun 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMo9H55TB8IeoTqZn5z7qiFlnPJL3s_msKP02ExgRKew&s=10",
    tags: ["Ajax", "Míchel", "Treinador"],
    body: [
      "O Ajax anunciou oficialmente a contratação do treinador espanhol Míchel Sánchez para comandar a equipe na temporada 2026-27. O técnico, de 50 anos, assinou contrato por duas temporadas, com vínculo válido até 2028, e chega para suceder ao interino Óscar García, que assumiu o cargo após a saída de Francesco Farioli.",
      "A chegada de Míchel foi fortemente influenciada pela presença de Jordi Cruyff como diretor esportivo do clube. O filho do lendário Johan Cruyff apostou no estilo de jogo muito específico do espanhol — um futebol de posse e organização posicional que se tornou marca registrada em sua passagem pelo Girona, clube que levou às competições europeias antes de sofrer o rebaixamento na Primeira Divisão espanhola.",
      "Ex-médio do Rayo Vallecano ao longo de toda a carreira como jogador, Míchel estreou no banco no clube da sua vida antes de se transferir para o Huesca. Suas cinco temporadas no Girona são consideradas seu maior legado: transformou o clube catalão em uma equipe reconhecida por toda a Europa pelo futebol atraente e pelos resultados consistentes.",
      "A chegada do espanhol responde a uma necessidade urgente do Ajax, que viveu uma temporada para esquecer. Após terminar apenas na 5ª posição da Eredivisie, o clube de Amsterdã chegou a sondar Erik ten Hag — que comandou os Lanceiros entre 2017 e 2022 e chegou a uma semifinal de Champions League — mas o treinador optou pelo Bayer Leverkusen. Outra opção estudada no passado recente foi John Heitinga, que dirigiu o Ajax de forma interina em 2022-23.",
      "Agora, com Míchel no comando e a diretoria reforçando o plantel para a próxima temporada, o Ajax pretende voltar a rivalizar com PSV e Feyenoord na briga pelo título da Eredivisie e recuperar seu prestígio nas competições europeias.",
    ],
  },
  {
    id: 3,
    category: "Seleção Holandesa",
    catClass: "badge-blue",
    icon: "bx bx-flag",
    title: "Holanda anuncia convocação para a Nations League 2026-27",
    meta: "Seleção · 24 de junho de 2026",
    date: "24 jun 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaTPgfEzPJlytfaKxYoa0-LuXSn7RqNspL0uOV84Sn7KJsAanFt8X4N3E&s=10",
    tags: ["Seleção", "Nations League", "Koeman"],
    body: [
      "O técnico Ronald Koeman divulgou nesta terça-feira a lista de convocados da Seleção Holandesa para a fase de grupos da UEFA Nations League 2026-27. A Oranje, que já encerrou sua participação na Copa do Mundo de 2026 nos Estados Unidos, foca agora na disputa do Grupo 3 da Liga A, ao lado de Alemanha, Hungria e Bósnia-Herzegovina.",
      "O capitão Virgil van Dijk, do Liverpool, lidera a defesa holandesa e será peça fundamental na fase defensiva. Ao seu lado, Nathan Aké (Manchester City) e Jurriën Timber (Arsenal) formam uma linha sólida. Denzel Dumfries (Inter de Milão) ocupa o lado direito, enquanto Daley Blind (Girona) atua pelo esquerdo.",
      "No meio-campo, Koeman mantém sua dupla de confiança: Frenkie de Jong (Barcelona) e Ryan Gravenberch (Liverpool) são os responsáveis por construir o jogo. Tijjani Reijnders (AC Milan) e Teun Koopmeiners (Juventus) completam o setor, trazendo criatividade e verticalidade.",
      "O ataque conta com os nomes mais badalados da seleção: Cody Gakpo (Liverpool) e Memphis Depay, artilheiro histórico da Holanda com 44 gols, são as principais referências ofensivas. Xavi Simons (PSG) e Donyell Malen (Borussia Dortmund) completam as opções para Koeman. Bart Verbruggen (Brighton) segue como titular na goleira.",
      "A Holanda lidera o Grupo 3A com 13 pontos em seis jogos, dois à frente da Alemanha (12 pts), e busca garantir a classificação para a fase final da competição. Os jogos desta fase decisiva estão previstos para setembro e outubro de 2026.",
    ],
  },
  {
    id: 4,
    category: "Eredivisie",
    catClass: "badge-orange",
    club: "Feyenoord",
    icon: "bx bx-football",
    title: "Feyenoord renova com artilheiro da temporada",
    meta: "Feyenoord · 22 de junho de 2026",
    date: "22 jun 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9TVqWNbW3WN7WwBP8C9nuanYd1_op1v3Xe1MNlXI8vUIBQJZ8JeuN5ZAF&s=10",
    tags: ["Feyenoord", "Ueda", "Transferências"],
    body: [
      "O Feyenoord surpreendeu o mercado ao renovar o contrato do atacante japonês Ayase Ueda até junho de 2029, ampliando o vínculo que era válido até 2028. O jogador de 27 anos foi o artilheiro da VriendenLoterij Eredivisie 2025-26 com impressionantes 25 gols em 34 partidas, estabelecendo-se como um dos atacantes mais prolíficos da liga holandesa.",
      "Ueda chegou ao Feyenoord em agosto de 2023 vindo do Cercle Brugge por 8 milhões de euros, e rapidamente se tornou peça indispensável no De Kuip. Na temporada passada, disputou terreno com Santiago Giménez e foi usado majoritariamente como suplente, mas com a saída do mexicano abriu espaço para se firmar como titular absoluto.",
      "A renovação chegou em um momento delicado: três clubes da Premier League — Everton, Leeds United e Brighton — haviam demonstrado interesse formal no jogador. O Feyenoord chegou a ser cotado para pedir entre 30 e 35 milhões de euros por Ueda caso ele fosse vendido, mas a diretoria optou por mantê-lo como peça central do projeto esportivo.",
      "O técnico Brian Priske, que assume o comando do Feyenoord na próxima temporada, havia deixado claro que Ueda era uma prioridade. 'Ele é o tipo de atacante que define jogos. Sua movimentação, sua finalização e sua liderança no vestiário são fundamentais para o que queremos construir', afirmou o treinador dinamarquês.",
      "Com a renovação garantida, o Feyenoord se prepara para disputar a Eredivisie e as competições europeias com um dos maiores goleadores do continente em seu plantel. A torcida do De Kuip celebrou a permanência do artilheiro nas redes sociais com uma onda de mensagens de apoio.",
    ],
  },
  {
    id: 5,
    category: "Eredivisie",
    catClass: "badge-orange",
    club: "AZ Alkmaar",
    icon: "bx bx-building-house",
    title: "AZ Alkmaar confirma construção de novo estádio para 2027",
    meta: "AZ Alkmaar · 18 de junho de 2026",
    date: "18 jun 2026",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Vooraanzicht_AFAS_Stadion_april2022.jpg/250px-Vooraanzicht_AFAS_Stadion_april2022.jpg",
    tags: ["AZ Alkmaar", "Estádio", "Infraestrutura"],
    body: [
      "O AZ Alkmaar confirmou oficialmente nesta quarta-feira a construção de um novo estádio moderno, com previsão de inauguração para o início da temporada 2027-28. O anúncio foi feito pela diretoria do clube durante coletiva de imprensa em Alkmaar, marcando o encerramento de anos de planejamento e negociações com as autoridades municipais.",
      "O atual AFAS Stadion, inaugurado em 2006 com capacidade para cerca de 17.000 torcedores, será substituído por uma arena moderna com capacidade planejada para 22.000 espectadores. O novo projeto arquitetônico prevê cobertura total, melhora na visibilidade de todos os assentos e uma área de hospitalidade significativamente ampliada.",
      "O investimento total está estimado em 180 milhões de euros, com financiamento misto entre o clube, o município de Alkmaar e parceiros privados. A localização ainda não foi divulgada oficialmente, mas fontes próximas à negociação indicam que o novo estádio será construído em uma área às margens do Noordhollandsch Kanaal.",
      "O presidente do AZ, Henk Hofstede, afirmou que o projeto é fundamental para manter o clube competitivo na Eredivisie e atrair talentos europeus. 'Um estádio moderno não é apenas uma questão de conforto para os torcedores. É uma declaração de ambição. Queremos que o AZ seja cada vez mais respeitado dentro e fora dos Países Baixos', disse.",
      "O AZ encerrou a temporada 2025-26 na sexta posição com 50 pontos, garantindo vaga na fase classificatória da UEFA Europa League. Com a perspectiva do novo estádio e um planejamento esportivo sólido, o clube norte-holandês projeta dar um salto qualitativo nos próximos anos.",
    ],
  },
  {
    id: 6,
    category: "Eredivisie",
    catClass: "badge-orange",
    club: "NEC Nijmegen",
    icon: "bx bxs-medal",
    title: "NEC faz melhor campanha em décadas na Eredivisie",
    meta: "NEC Nijmegen · 12 de junho de 2026",
    date: "12 jun 2026",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThI18yAxgglu8lMEGXunAXgBq75jK9KG1VMvdVbNGiSw&s=10",
    tags: ["NEC", "Nijmegen", "Eredivisie"],
    body: [
      "O NEC Nijmegen encerrou a temporada 2025-26 da Eredivisie em terceiro lugar com 56 pontos, realizando sua melhor campanha em mais de duas décadas. Com 17 vitórias, 5 empates e 12 derrotas em 34 jogos, o clube de Nijmegen superou nomes tradicionais como Ajax e FC Twente na classificação final.",
      "A campanha histórica foi construída sobre uma base sólida de organização defensiva e eficácia ofensiva. O treinador Dick Lukkien, eleito técnico do mês em setembro, implementou um sistema tático coeso que permitiu ao NEC conciliar solidez defensiva com transições rápidas — algo que surpreendeu clubes com orçamentos muito superiores ao longo da temporada.",
      "Entre os destaques individuais, o goleiro Mattijs Branderhorst foi uma das revelações do campeonato, enquanto no ataque a dupla formada por Pedrinho e Denilho Cleonise foi responsável pela maioria dos gols decisivos. A torcida do Goffertstadion, fiel durante toda a temporada, lotou o estádio em praticamente todos os jogos em casa.",
      "A terceira colocação garantiu ao NEC uma vaga direta na fase de grupos da UEFA Europa League, a competição europeia mais importante da história recente do clube. O diretor esportivo Ted van Leeuwen celebrou o feito: 'Esta temporada vai ficar marcada para sempre na história do NEC. Mostramos que com trabalho e organização é possível competir com os grandes.'",
      "O NEC já inicia o planejamento para a próxima temporada visando manter o nível apresentado. Com a perspectiva de disputar o futebol europeu, o clube espera atrair reforços de qualidade e manter o núcleo que foi responsável pela campanha histórica.",
    ],
  },
];

const STANDINGS = [
  { pos: 1, team: "PSV Eindhoven",   champion: true,  j:34, v:22, e:5, d:7,  sg:"+46", pts:71 },
  { pos: 2, team: "Feyenoord",                        j:34, v:19, e:4, d:11, sg:"+22", pts:61 },
  { pos: 3, team: "NEC Nijmegen",                     j:34, v:17, e:5, d:12, sg:"+10", pts:56 },
  { pos: 4, team: "Ajax",                             j:34, v:16, e:7, d:11, sg:"+16", pts:55 },
  { pos: 5, team: "FC Twente",                        j:34, v:16, e:7, d:11, sg:"+9",  pts:55 },
  { pos: 6, team: "AZ Alkmaar",                       j:34, v:14, e:8, d:12, sg:"+8",  pts:50 },
  { pos: 7, team: "Heerenveen",                       j:34, v:14, e:8, d:12, sg:"+3",  pts:50 },
  { pos: 8, team: "Go Ahead Eagles",                  j:34, v:13, e:6, d:15, sg:"-8",  pts:45 },
  { pos: 9, team: "Sparta Rotterdam",                 j:34, v:12, e:8, d:14, sg:"-5",  pts:44 },
  { pos:10, team: "FC Utrecht",                       j:34, v:11, e:9, d:14, sg:"-4",  pts:42 },
  { pos:11, team: "Fortuna Sittard",                  j:34, v:11, e:7, d:16, sg:"-14", pts:40 },
  { pos:12, team: "NAC Breda",                        j:34, v:10, e:9, d:15, sg:"-12", pts:39 },
  { pos:13, team: "Heracles",                         j:34, v:10, e:8, d:16, sg:"-16", pts:38 },
  { pos:14, team: "Groningen",                        j:34, v:9,  e:9, d:16, sg:"-18", pts:36 },
  { pos:15, team: "Telstar",                          j:34, v:9,  e:7, d:18, sg:"-26", pts:34 },
  { pos:16, team: "Zwolle",       relegation: true,   j:34, v:8,  e:8, d:18, sg:"-25", pts:32 },
  { pos:17, team: "Excelsior",    relegation: true,   j:34, v:6,  e:8, d:20, sg:"-35", pts:26 },
  { pos:18, team: "Volendam",     relegation: true,   j:34, v:4,  e:6, d:24, sg:"-50", pts:18 },
];

const NL_GROUP = [
  { pos:1, team:"Holanda",  j:6, v:4, e:1, d:1, pts:13, highlight:true },
  { pos:2, team:"Alemanha", j:6, v:3, e:3, d:0, pts:12 },
  { pos:3, team:"Hungria",  j:6, v:1, e:2, d:3, pts:5  },
  { pos:4, team:"Bósnia",   j:6, v:0, e:1, d:5, pts:1  },
];

const CONVOCADOS = [
  { pos: "Goleiros",       jogadores: ["Bart Verbruggen (Brighton)", "Mark Flekken (Brentford)", "Justin Bijlow (Feyenoord)"] },
  { pos: "Defensores",     jogadores: ["Virgil van Dijk (Liverpool)", "Nathan Aké (Man. City)", "Jurriën Timber (Arsenal)", "Denzel Dumfries (Inter)", "Daley Blind (Girona)"] },
  { pos: "Meio-campistas", jogadores: ["Frenkie de Jong (Barcelona)", "Teun Koopmeiners (Juventus)", "Tijjani Reijnders (AC Milan)", "Ryan Gravenberch (Liverpool)"] },
  { pos: "Atacantes",      jogadores: ["Cody Gakpo (Liverpool)", "Memphis Depay (Corinthians)", "Donyell Malen (B. Dortmund)", "Xavi Simons (PSG)"] },
];

const FIXTURES = [
  { date:"5",  month:"set 2026", comp:"Nations League", home:"Holanda", away:"Alemanha", time:"20h45" },
  { date:"8",  month:"set 2026", comp:"Nations League", home:"Bélgica", away:"Holanda",  time:"18h00" },
  { date:"11", month:"out 2026", comp:"Nations League", home:"Holanda", away:"França",   time:"20h45" },
  { date:"14", month:"out 2026", comp:"Nations League", home:"Holanda", away:"Portugal", time:"20h45" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const HIGHLIGHTS = ARTICLES.slice(0, 3);
const MORE_NEWS  = ARTICLES.slice(3, 6);

// ─── Widgets ──────────────────────────────────────────────────────────────────
function StandingsWidget() {
  return (
    <div className="widget">
      <div className="widget-head">
        <i className="bx bxs-trophy widget-head-icon" />
        <span>Eredivisie 2025-26</span>
      </div>
      <div className="widget-table-wrap">
        <table className="wtable">
          <thead>
            <tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {STANDINGS.map(r => (
              <tr key={r.pos} className={r.champion ? "row-champ" : r.relegation ? "row-rel" : ""}>
                <td className={`pos ${r.pos<=2?"cl":r.pos<=5?"el":r.relegation?"rd":""}`}>{r.pos}</td>
                <td className="tname tl">{r.team}{r.champion && " 🏆"}</td>
                <td>{r.j}</td><td>{r.v}</td><td>{r.e}</td><td>{r.d}</td>
                <td className={r.sg.startsWith("+") ? "pos-sg" : "neg-sg"}>{r.sg}</td>
                <td className="pts">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="widget-foot">Temporada encerrada · Campeão: PSV 🏆</p>
    </div>
  );
}

function NationsWidget() {
  return (
    <div className="widget">
      <div className="widget-head">
        <i className="bx bx-flag widget-head-icon" />
        <span>Nations League — Grupo 3A</span>
      </div>
      <div className="widget-table-wrap">
        <table className="wtable">
          <thead>
            <tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Pts</th></tr>
          </thead>
          <tbody>
            {NL_GROUP.map(r => (
              <tr key={r.pos} className={r.highlight ? "row-champ" : ""}>
                <td className={`pos ${r.pos===1?"cl":""}`}>{r.pos}</td>
                <td className="tname tl">{r.team}{r.highlight && " 🇳🇱"}</td>
                <td>{r.j}</td><td>{r.v}</td><td>{r.e}</td><td>{r.d}</td>
                <td className="pts">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="widget-foot">Grupo 3 · Liga A</p>
    </div>
  );
}

// ─── Article Page ─────────────────────────────────────────────────────────────
function ArticlePage({ article, onBack }: { article: Article; onBack: () => void }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, []);
  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 2);

  return (
    <div className="article-layout">
      <main className="main">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button className="bread-link" onClick={onBack}>
            <i className="bx bx-home-alt" /> Início
          </button>
          <i className="bx bx-chevron-right bread-sep" />
          <span className="bread-current">{article.category}</span>
        </nav>

        {/* Hero image */}
        <div className="art-hero-img">
          <img src={article.image} alt={article.title} />
          <div className="art-hero-gradient" />
        </div>

        {/* Article content */}
        <article className="art-card">
          <header className="art-header">
            <span className={`badge ${article.catClass}`}>{article.category}</span>
            {article.club && <span className="badge badge-grey">{article.club}</span>}
            <h1 className="art-title">{article.title}</h1>
            <div className="art-meta-row">
              <span className="art-meta-item"><i className="bx bx-calendar" /> {article.date}</span>
              <span className="art-meta-item"><i className="bx bx-time-five" /> 3 min de leitura</span>
            </div>
          </header>

          <div className="art-body">
            {article.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <footer className="art-footer">
            <div className="art-tags">
              {article.tags.map(t => (
                <span key={t} className="art-tag"><i className="bx bx-hash" />{t}</span>
              ))}
            </div>
            <button className="back-btn" onClick={onBack}>
              <i className="bx bx-arrow-back" /> Voltar para as notícias
            </button>
          </footer>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section className="related-section">
            <div className="sec-head">
              <span className="sec-label"><i className="bx bx-news" /> Relacionadas</span>
            </div>
            <div className={`news-grid cols-${related.length}`}>
              {related.map(n => (
                <ArticleCard key={n.id} article={n} onClick={() => { }} />
              ))}
            </div>
          </section>
        )}
      </main>

      <aside className="sidebar">
        <StandingsWidget />
        <NationsWidget />
      </aside>
    </div>
  );
}

// ─── Article Card ─────────────────────────────────────────────────────────────
function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  return (
    <article className="news-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      <div className="news-thumb">
        <img src={article.image} alt={article.title} className="thumb-img" />
      </div>
      <div className="news-info">
        <p className="news-cat">
          <span className="cat-text">{article.category}</span>
          {article.club && <><span className="dot">·</span><span className="club-text">{article.club}</span></>}
        </p>
        <h3 className="news-title">{article.title}</h3>
        <p className="news-date"><i className="bx bx-calendar" /> {article.date}</p>
      </div>
    </article>
  );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
function HeroCard({ article, size, onClick }: { article: Article; size: "large"|"small"; onClick: () => void }) {
  return (
    <article className={`hero-${size}`} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onClick()}>
      <img src={article.image} alt={article.title} className="hero-img" />
      <div className="hero-overlay" />
      <div className="hero-body">
        <span className={`badge ${article.catClass}`}>{article.category}</span>
        {size === "large"
          ? <h2 className="hero-title">{article.title}</h2>
          : <h3 className="hero-sub-title">{article.title}</h3>
        }
        <p className="hero-meta"><i className="bx bx-time-five" /> {article.meta}</p>
      </div>
    </article>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({ onOpen }: { onOpen: (a: Article) => void }) {
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bxs-star" /> Destaques</span>
          </div>
          <div className="hero-grid">
            <HeroCard article={HIGHLIGHTS[0]} size="large" onClick={() => onOpen(HIGHLIGHTS[0])} />
            <div className="hero-sub">
              {HIGHLIGHTS.slice(1).map(h => (
                <HeroCard key={h.id} article={h} size="small" onClick={() => onOpen(h)} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bx-news" /> Mais Notícias</span>
          </div>
          <div className="news-grid">
            {MORE_NEWS.map(n => (
              <ArticleCard key={n.id} article={n} onClick={() => onOpen(n)} />
            ))}
          </div>
        </section>
      </main>

      <aside className="sidebar">
        <StandingsWidget />
        <NationsWidget />
      </aside>
    </div>
  );
}

function EredivisieePage({ onOpen }: { onOpen: (a: Article) => void }) {
  const eredivisieNews = ARTICLES.filter(a => a.category === "Eredivisie");
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bxs-trophy" /> Eredivisie 2025-26</span>
          </div>
          <p className="page-intro">
            A temporada 2025-26 foi encerrada com o <strong>PSV Eindhoven</strong> conquistando seu 27º título nacional com 71 pontos, liderando a competição de ponta a ponta com 22 vitórias em 34 partidas.
          </p>
        </section>

        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bx-news" /> Notícias</span>
          </div>
          <div className="news-grid">
            {eredivisieNews.map(n => (
              <ArticleCard key={n.id} article={n} onClick={() => onOpen(n)} />
            ))}
          </div>
        </section>

        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bx-bar-chart-alt-2" /> Classificação Final</span>
          </div>
          <div className="table-wrap">
            <table className="full-table">
              <thead>
                <tr><th>#</th><th className="tl">Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>Pts</th></tr>
              </thead>
              <tbody>
                {STANDINGS.map(r => (
                  <tr key={r.pos} className={r.champion ? "row-champ" : r.relegation ? "row-rel" : ""}>
                    <td className={`pos ${r.pos<=2?"cl":r.pos<=5?"el":r.relegation?"rd":""}`}>{r.pos}</td>
                    <td className="tname tl">{r.team}{r.champion && " 🏆"}</td>
                    <td>{r.j}</td><td>{r.v}</td><td>{r.e}</td><td>{r.d}</td>
                    <td className={r.sg.startsWith("+") ? "pos-sg" : "neg-sg"}>{r.sg}</td>
                    <td className="pts">{r.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="table-legend">
              <span><span className="leg cl" /> Champions League</span>
              <span><span className="leg el" /> Europa League</span>
              <span><span className="leg rd" /> Rebaixamento</span>
            </div>
          </div>
        </section>
      </main>
      <aside className="sidebar"><StandingsWidget /></aside>
    </div>
  );
}

function SelecaoPage({ onOpen }: { onOpen: (a: Article) => void }) {
  const selecaoNews = ARTICLES.filter(a => a.category === "Seleção Holandesa");
  return (
    <div className="layout-grid">
      <main className="main">
        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bx-flag" /> Seleção Holandesa</span>
          </div>
          {selecaoNews.map(n => (
            <HeroCard key={n.id} article={n} size="large" onClick={() => onOpen(n)} />
          ))}
        </section>

        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bxs-group" /> Última Convocação</span>
          </div>
          <div className="conv-grid">
            {CONVOCADOS.map(g => (
              <div key={g.pos} className="conv-group">
                <h4 className="conv-pos"><i className="bx bx-chevron-right" /> {g.pos}</h4>
                <ul>
                  {g.jogadores.map(j => (
                    <li key={j}><i className="bx bx-user" /> {j}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section">
          <div className="sec-head">
            <span className="sec-label"><i className="bx bx-calendar-event" /> Próximos Jogos</span>
          </div>
          <div className="fixtures">
            {FIXTURES.map((f, i) => (
              <div key={i} className="fixture">
                <div className="fx-date">
                  <span className="fx-day">{f.date}</span>
                  <span className="fx-month">{f.month}</span>
                </div>
                <div className="fx-mid">
                  <span className="fx-comp"><i className="bx bx-trophy" /> {f.comp}</span>
                  <div className="fx-teams">
                    <span className={f.home === "Holanda" ? "fx-team hl" : "fx-team"}>{f.home}</span>
                    <span className="fx-vs">vs</span>
                    <span className={f.away === "Holanda" ? "fx-team hl" : "fx-team"}>{f.away}</span>
                  </div>
                </div>
                <div className="fx-time"><i className="bx bx-time" /> {f.time}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <aside className="sidebar">
        <NationsWidget />
        <div className="widget">
          <div className="widget-head">
            <i className="bx bxs-star widget-head-icon" />
            <span>Artilheiros Históricos</span>
          </div>
          <div className="scorers">
            {[
              { rank:1, name:"Robin van Persie",  goals:50 },
              { rank:2, name:"Memphis Depay",      goals:44 },
              { rank:3, name:"Patrick Kluivert",   goals:40 },
              { rank:4, name:"Cody Gakpo",         goals:22 },
              { rank:5, name:"Wout Weghorst",      goals:9  },
            ].map(s => (
              <div key={s.rank} className="scorer-row">
                <span className={`sc-rank${s.rank===1?" sc-gold":s.rank===2?" sc-silver":s.rank===3?" sc-bronze":""}`}>{s.rank}</span>
                <span className="sc-name">{s.name}</span>
                <span className="sc-goals">{s.goals} <i className="bx bx-football" /></span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
type Page = "home" | "eredivisie" | "selecao";

export default function App() {
  const [page, setPage]           = useState<Page>("home");
  const [article, setArticle]     = useState<Article | null>(null);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [ereOpen, setEreOpen]     = useState(false);
  const navRef                    = useRef<HTMLDivElement>(null);

  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday:"long", day:"numeric", month:"long", year:"numeric",
  }).format(new Date(2026, 5, 27));

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setEreOpen(false); setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function nav(p: Page) {
    setPage(p); setArticle(null);
    setMenuOpen(false); setEreOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openArticle(a: Article) {
    setArticle(a);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeArticle() {
    setArticle(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-inner">
          <button className="logo-btn" onClick={() => nav("home")}>
            <span className="logo-nl">NL</span>
            <span className="logo-oranje">Oranje</span>
            <span className="logo-news">News</span>
          </button>
          <span className="topbar-date"><i className="bx bx-calendar" /> {today}</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar" ref={navRef}>
        <div className="nav-inner">
          <div className="nav-links">
            <button className={`nav-btn${page==="home" && !article ? " nav-active" : ""}`} onClick={() => nav("home")}>
              <i className="bx bx-home-alt" /> Todas
            </button>
            <div className="nav-dropdown">
              <button className={`nav-btn${page==="eredivisie" && !article ? " nav-active" : ""}`} onClick={() => setEreOpen(o=>!o)}>
                <i className="bx bxs-trophy" /> Eredivisie
                <i className={`bx ${ereOpen ? "bx-chevron-up" : "bx-chevron-down"} chevron-icon`} />
              </button>
              {ereOpen && (
                <div className="dropdown">
                  <button onClick={() => nav("eredivisie")}><i className="bx bx-bar-chart-alt-2" /> Classificação</button>
                  <button onClick={() => nav("eredivisie")}><i className="bx bx-football" /> Resultados</button>
                  <button onClick={() => nav("eredivisie")}><i className="bx bx-news" /> Notícias</button>
                </div>
              )}
            </div>
            <button className={`nav-btn${page==="selecao" && !article ? " nav-active" : ""}`} onClick={() => nav("selecao")}>
              <i className="bx bx-flag" /> Seleção Holandesa
            </button>
          </div>
          <button className="hamburger" onClick={() => { setMenuOpen(o=>!o); setEreOpen(false); }} aria-label="Menu">
            <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"}`} />
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-drawer">
            <button className={`mob-link${page==="home"?" mob-active":""}`} onClick={() => nav("home")}><i className="bx bx-home-alt" /> Todas</button>
            <button className={`mob-link${page==="eredivisie"?" mob-active":""}`} onClick={() => nav("eredivisie")}><i className="bx bxs-trophy" /> Eredivisie</button>
            <button className={`mob-link${page==="selecao"?" mob-active":""}`} onClick={() => nav("selecao")}><i className="bx bx-flag" /> Seleção Holandesa</button>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="container">
        {article
          ? <ArticlePage article={article} onBack={closeArticle} />
          : page === "home"       ? <HomePage onOpen={openArticle} />
          : page === "eredivisie" ? <EredivisieePage onOpen={openArticle} />
          : <SelecaoPage onOpen={openArticle} />
        }
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span className="logo-oranje">Oranje</span><span className="logo-news">News</span>
          </div>
          <p className="footer-tagline">Tudo sobre o futebol da Holanda em português</p>
          <p className="footer-copy">© 2026 OranjeNews · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}