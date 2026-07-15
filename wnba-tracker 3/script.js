// ============================================================
// WNBA Live Leaders — render logic. No build step, no deps.
// Reads the arrays defined in data.js.
// ============================================================

const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function teamLabel(abbr) {
  return TEAM_NAMES[abbr] || abbr;
}

// ---------- Tabs ----------
function initTabs() {
  const buttons = document.querySelectorAll('nav.tabs button');
  const panels = document.querySelectorAll('section.panel');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.target).classList.add('active');
    });
  });
}

// ---------- Ticker ----------
function renderTicker() {
  const track = document.getElementById('tickerTrack');
  const items = [
    ...POINTS_LEADERS.slice(0, 6).map(p => `<b>${p.name}</b> <span class="stat-num">${fmt(p.ppg,1)} PPG</span>`),
    ...REBOUND_LEADERS.slice(0, 4).map(p => `<b>${p.name}</b> <span class="stat-num">${fmt(p.rpg,1)} RPG</span>`),
    ...ASSIST_LEADERS.slice(0, 4).map(p => `<b>${p.name}</b> <span class="stat-num">${fmt(p.apg,1)} APG</span>`),
  ];
  const html = items.map(i => `<span class="ticker-item">${i}</span>`).join('');
  track.innerHTML = html + html; // duplicate for seamless loop
}

// ---------- Generic leaderboard renderer ----------
function renderBoard(containerId, data, valueKey, valueSuffix, valueFormatter) {
  const el = document.getElementById(containerId);
  const max = Math.max(...data.map(d => d[valueKey]));
  el.innerHTML = data.map((d, i) => {
    const val = valueFormatter ? valueFormatter(d[valueKey]) : fmt(d[valueKey]);
    const pct = (d[valueKey] / max) * 100;
    return `
      <div class="leader-row" data-name="${d.name}">
        <span class="rank">${i + 1}</span>
        <span class="leader-name">${d.name}<span class="leader-team">${d.team}</span></span>
        <span class="leader-val">${val}${valueSuffix || ''}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${pct}%"></span></span>
      </div>`;
  }).join('');
}

// ---------- Donut chart (pure SVG) ----------
function donutSVG(segments, size = 150) {
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const arcs = segments.map(seg => {
    const frac = seg.value / total;
    const dash = frac * circumference;
    const gap = circumference - dash;
    const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}"
      stroke-width="20" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}"
      transform="rotate(-90 ${cx} ${cy})" />`;
    offset += dash;
    return circle;
  }).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${arcs}</svg>`;
}

// ---------- Scoring breakdown detail panel ----------
function renderScoringDetail(name) {
  const p = SCORING_BREAKDOWN.find(x => x.name === name);
  const wrap = document.getElementById('scoringDetail');
  if (!p) { wrap.classList.remove('active'); return; }

  const twoPts = p.twoPM * 2;
  const threePts = p.threePM * 3;
  const ftPts = p.ftm;

  const segments = [
    { label: '2PT makes', value: twoPts, color: 'var(--maple)'.trim(), raw: p.twoPM },
    { label: '3PT makes', value: threePts, color: 'var(--amber)', raw: p.threePM },
    { label: 'Free throws', value: ftPts, color: 'var(--make)', raw: p.ftm },
  ];
  // inline CSS vars don't resolve inside raw SVG strings reliably across browsers,
  // so resolve to hex directly:
  const colors = ['#C88A4A', '#FFB63D', '#4FA37B'];
  const svgSegments = segments.map((s, i) => ({ value: s.value, color: colors[i] }));

  wrap.innerHTML = `
    <div>
      <p class="detail-head">${p.name}</p>
      <p class="detail-sub">${teamLabel(p.team)} — ${fmt(p.pts)} points this season</p>
      <div class="legend">
        <div class="legend-item"><span class="swatch" style="background:${colors[0]}"></span>2PT — ${p.twoPM} makes (${fmt(twoPts)} pts)</div>
        <div class="legend-item"><span class="swatch" style="background:${colors[1]}"></span>3PT — ${p.threePM} makes (${fmt(threePts)} pts)</div>
        <div class="legend-item"><span class="swatch" style="background:${colors[2]}"></span>FT — ${p.ftm} makes (${fmt(ftPts)} pts)</div>
      </div>
    </div>
    <div class="donut-wrap">
      ${donutSVG(svgSegments, 170)}
      <div>
        <div class="stat-chip">Share from 2PT: <b>${fmt(twoPts/p.pts*100,0)}%</b></div>
        <div class="stat-chip">Share from 3PT: <b>${fmt(threePts/p.pts*100,0)}%</b></div>
        <div class="stat-chip">Share from FT: <b>${fmt(ftPts/p.pts*100,0)}%</b></div>
      </div>
    </div>
  `;
  wrap.classList.add('active');
}

// ---------- Rebound off/def detail ----------
function renderReboundDetail(name) {
  const p = REBOUND_LEADERS.find(x => x.name === name);
  const wrap = document.getElementById('reboundDetail');
  if (!p) { wrap.classList.remove('active'); return; }

  const orebPct = (p.oreb / p.reb) * 100;
  const drebPct = (p.dreb / p.reb) * 100;

  wrap.innerHTML = `
    <div>
      <p class="detail-head">${p.name}</p>
      <p class="detail-sub">${teamLabel(p.team)} — ${fmt(p.reb)} total rebounds (${fmt(p.rpg,1)}/gm)</p>
      <div class="legend">
        <div class="legend-item"><span class="swatch" style="background:var(--amber)"></span>Offensive — ${p.oreb} (${fmt(orebPct,0)}%)</div>
        <div class="legend-item"><span class="swatch" style="background:var(--maple-deep)"></span>Defensive — ${p.dreb} (${fmt(drebPct,0)}%)</div>
      </div>
    </div>
    <div>
      <p class="detail-sub" style="margin-bottom:6px">Offensive vs. defensive split</p>
      <div class="stack-bar">
        <div class="stack-oreb" style="width:${orebPct}%"></div>
        <div class="stack-dreb" style="width:${drebPct}%"></div>
      </div>
      <div style="margin-top:14px">
        <div class="stat-chip">OREB / gm: <b>${fmt(p.oreb / (p.reb/p.rpg), 1)}</b></div>
        <div class="stat-chip">DREB / gm: <b>${fmt(p.dreb / (p.reb/p.rpg), 1)}</b></div>
      </div>
    </div>
  `;
  wrap.classList.add('active');
}

// ---------- Assist detail (real assist%, + link to playmaking tab) ----------
function renderAssistDetail(name) {
  const p = ASSIST_LEADERS.find(x => x.name === name);
  const wrap = document.getElementById('assistDetail');
  if (!p) { wrap.classList.remove('active'); return; }

  wrap.innerHTML = `
    <div>
      <p class="detail-head">${p.name}</p>
      <p class="detail-sub">${teamLabel(p.team)} — ${fmt(p.ast)} assists (${fmt(p.apg,1)}/gm)</p>
      <div class="stat-chip">Assist %: <b>${fmt(p.astPct,1)}%</b></div>
      <p class="detail-sub" style="margin-top:10px">Assist % estimates the share of teammate field goals a player assisted while on the floor. See the <strong>Playmaking Style</strong> tab for how she tends to generate those assists.</p>
    </div>
    <div></div>
  `;
  wrap.classList.add('active');
}

// ---------- Playmaking style (sample data, clearly labeled) ----------
function renderPlaymaking() {
  const el = document.getElementById('playmakingCards');
  const types = [
    { key: 'pnr', label: 'Pick & Roll', color: '#C88A4A' },
    { key: 'postUp', label: 'Post-Up', color: '#8B5A2B' },
    { key: 'spotUp', label: 'Spot-Up', color: '#4FA37B' },
    { key: 'transition', label: 'Transition', color: '#FFB63D' },
  ];
  el.innerHTML = PLAYMAKING_STYLE_SAMPLE.map(p => `
    <div class="play-card">
      <div class="play-card-head">
        <div><span class="name">${p.name}</span><span class="team">${teamLabel(p.team)}</span></div>
      </div>
      ${types.map(t => `
        <div class="play-bar-row">
          <span>${t.label}</span>
          <span class="play-bar-track"><span class="play-bar-fill" style="width:${p[t.key]}%; background:${t.color}"></span></span>
          <span>${p[t.key]}%</span>
        </div>
      `).join('')}
      <div class="play-note">${p.note}</div>
    </div>
  `).join('');
}

// ---------- Wire up click-to-detail ----------
function wireRowClicks(containerId, renderFn) {
  document.getElementById(containerId).addEventListener('click', e => {
    const row = e.target.closest('.leader-row');
    if (!row) return;
    document.querySelectorAll(`#${containerId} .leader-row`).forEach(r => r.style.background = '');
    row.style.background = 'rgba(255,182,61,0.12)';
    renderFn(row.dataset.name);
  });
}

// ---------- Standings & Playoff Race ----------
function renderStandings() {
  const el = document.getElementById('standingsBoard');
  el.innerHTML = STANDINGS.map(s => {
    const inPlayoffs = s.rank <= PLAYOFF_CUTOFF_RANK;
    const cutoffLine = s.rank === PLAYOFF_CUTOFF_RANK ? 'style="border-bottom:2px dashed var(--amber)"' : '';
    return `
      <div class="leader-row" style="grid-template-columns:22px 1fr 60px 60px 70px" ${cutoffLine}>
        <span class="rank">${s.rank}</span>
        <span class="leader-name">${teamLabel(s.team)}<span class="leader-team">${s.team}</span></span>
        <span class="leader-val" style="color:${inPlayoffs ? 'var(--make)' : 'var(--chalk-dim)'}">${s.w}-${s.l}</span>
        <span class="leader-val">${fmt(s.pct,3).replace('0.','.')}</span>
        <span class="leader-val">${s.gb === 0 ? '—' : fmt(s.gb,1)}</span>
      </div>`;
  }).join('');
}

// ---------- Title contenders ----------
function renderTitleContenders() {
  const el = document.getElementById('titleContenders');
  const tiers = [...new Set(TITLE_CONTENDERS.map(t => t.tier))];
  el.innerHTML = tiers.map(tierNum => {
    const rows = TITLE_CONTENDERS.filter(t => t.tier === tierNum);
    return `
      <div style="margin-bottom:22px">
        <h3 style="font-family:'Oswald',sans-serif;text-transform:uppercase;font-size:13px;letter-spacing:0.1em;color:var(--amber);margin:0 0 10px">
          Tier ${tierNum} — ${rows[0].tierLabel}
        </h3>
        ${rows.map(t => `
          <div class="play-card" style="margin-bottom:10px">
            <div class="play-card-head">
              <div><span class="name">${teamLabel(t.team)}</span><span class="team">${t.team}</span></div>
              <span class="stat-chip" style="margin:0"><b>${t.odds}</b> to win it all</span>
            </div>
            <div class="play-note" style="border-top:none;padding-top:0;margin-top:4px">${t.blurb}</div>
          </div>
        `).join('')}
      </div>`;
  }).join('');
}

// ---------- Awards predictions ----------
function awardRow(p) {
  return `
    <div class="play-card" style="margin-bottom:10px">
      <div class="play-card-head">
        <div><span class="name">${p.name}</span><span class="team">${teamLabel(p.team)}</span></div>
        <span class="stat-chip" style="margin:0"><b>${p.odds}</b></span>
      </div>
      <div class="play-note" style="border-top:none;padding-top:0;margin-top:4px">${p.note}</div>
    </div>`;
}

function renderAwards() {
  document.getElementById('mvpRace').innerHTML = AWARDS_PREDICTIONS.mvp.map(awardRow).join('');
  document.getElementById('royRace').innerHTML = AWARDS_PREDICTIONS.roy.map(awardRow).join('');
  document.getElementById('dpoyRace').innerHTML = AWARDS_PREDICTIONS.dpoy.map(awardRow).join('');
}

// ---------- Rookie class ----------
function renderRookies() {
  const el = document.getElementById('rookieGrid');
  el.innerHTML = ROOKIE_CLASS.map(r => `
    <div class="play-card" style="margin-bottom:10px">
      <div class="play-card-head">
        <div><span class="rank" style="margin-right:8px">#${r.pick}</span><span class="name">${r.name}</span><span class="team">${r.college} → ${teamLabel(r.team)}</span></div>
      </div>
      <div class="stat-chip"><b>${r.stats}</b></div>
      <div class="play-note" style="border-top:none;padding-top:6px">${r.note}</div>
    </div>
  `).join('');
}

// ---------- 2027 Mock draft ----------
function renderMockDraft() {
  const el = document.getElementById('mockDraftBoard');
  el.innerHTML = MOCK_DRAFT_2027.map(p => `
    <div class="play-card" style="margin-bottom:10px">
      <div class="play-card-head">
        <div><span class="rank" style="margin-right:8px">${p.rank}</span><span class="name">${p.name}</span><span class="team">${p.college} — ${p.pos}</span></div>
      </div>
      <div class="play-note" style="border-top:none;padding-top:0">${p.note}</div>
    </div>
  `).join('');
}

// ---------- Illustrated avatar (no real photos — see data.js note) ----------
function initials(name) {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

function avatarSVG(name, team, size = 96) {
  const color = TEAM_COLORS[team] || '#2F86C0';
  const ini = initials(name);
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r="46" fill="${color}" opacity="0.12"></circle>
      <circle cx="48" cy="48" r="40" fill="${color}"></circle>
      <text x="48" y="58" text-anchor="middle" font-family="Oswald, sans-serif"
        font-weight="700" font-size="30" fill="#ffffff">${ini}</text>
    </svg>`;
}

// ---------- Player profile cards ----------
function renderPlayerProfiles() {
  const el = document.getElementById('profileGrid');
  el.innerHTML = PLAYER_PROFILES.map(p => {
    const posClass = p.position === 'Guard' ? 'pos-guard' : 'pos-forward';
    const photo = p.photoUrl
      ? `<img src="${p.photoUrl}" alt="${p.name}" width="96" height="96" style="border-radius:50%;object-fit:cover">`
      : avatarSVG(p.name, p.team);
    return `
      <div class="profile-card">
        <div class="profile-photo-wrap">${photo}</div>
        <div class="profile-body">
          <p class="profile-name">${p.name}</p>
          <p class="profile-team">${teamLabel(p.team)}</p>
          <div class="pos-badge-wrap"><span class="pos-badge ${posClass}">${p.position} — ${p.posDetail}</span></div>
          <div class="bio-line"><b>Hometown</b><span>${p.hometown}</span></div>
          <div class="bio-line"><b>Height</b><span>${p.height}</span></div>
          <div class="bio-line"><b>College</b><span>${p.college}</span></div>
          <div class="bio-line"><b>Fun fact</b><span>${p.funFact}</span></div>
          <div class="playstyle-box"><b>Playstyle:</b> ${p.playstyle}</div>
        </div>
      </div>`;
  }).join('');
}

// ---------- Half-court teaching diagram ----------
function courtDiagramSVG() {
  // Half-court in feet-to-pixel scale: 50ft wide x 47ft deep, drawn at 10px/ft
  // Baseline at y=470 (bottom), half-court line at y=0 (top).
  const W = 500, H = 470;
  const hoopY = 452, hoopX = 250;
  const colors = ['#2F86C0', '#4FA8D8', '#4FA8D8', '#FF9E2C', '#E0483F'];
  const dots = COURT_POSITIONS.map((p, i) => `
    <g>
      <circle cx="${p.x}" cy="${H - p.y}" r="16" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>
      <text x="${p.x}" y="${H - p.y + 5}" text-anchor="middle" font-family="Oswald, sans-serif"
        font-weight="700" font-size="14" fill="#fff">${p.num}</text>
    </g>`).join('');

  return `
  <svg width="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${W}" height="${H}" fill="#EAF7FE" />
    <!-- court boundary -->
    <rect x="10" y="10" width="${W-20}" height="${H-20}" fill="none" stroke="#2F86C0" stroke-width="3"/>
    <!-- half-court line -->
    <line x1="10" y1="10" x2="${W-10}" y2="10" stroke="#2F86C0" stroke-width="3"/>
    <circle cx="${W/2}" cy="10" r="40" fill="none" stroke="#2F86C0" stroke-width="2"/>
    <!-- key / lane -->
    <rect x="${hoopX-80}" y="${hoopY-190}" width="160" height="190" fill="none" stroke="#2F86C0" stroke-width="2"/>
    <!-- free throw circle -->
    <circle cx="${hoopX}" cy="${hoopY-190}" r="45" fill="none" stroke="#2F86C0" stroke-width="2" stroke-dasharray="4 4"/>
    <!-- three point arc (approximate) -->
    <path d="M 35 ${hoopY-10} A 220 220 0 0 1 ${W-35} ${hoopY-10}" fill="none" stroke="#2F86C0" stroke-width="2"/>
    <line x1="35" y1="${hoopY-10}" x2="35" y2="${H-10}" stroke="#2F86C0" stroke-width="2"/>
    <line x1="${W-35}" y1="${hoopY-10}" x2="${W-35}" y2="${H-10}" stroke="#2F86C0" stroke-width="2"/>
    <!-- backboard & rim -->
    <rect x="${hoopX-25}" y="${hoopY+6}" width="50" height="4" fill="#16283A"/>
    <circle cx="${hoopX}" cy="${hoopY}" r="8" fill="none" stroke="#FF9E2C" stroke-width="3"/>
    ${dots}
  </svg>`;
}

function renderCourtDiagram() {
  document.getElementById('courtDiagram').innerHTML = courtDiagramSVG();
  const legend = document.getElementById('courtLegend');
  legend.innerHTML = COURT_POSITIONS.map(p => `
    <div class="court-legend-item">
      <span class="court-num">${p.num}</span>
      <div class="court-legend-text"><b>${p.label}</b><span>${p.desc}</span></div>
    </div>
  `).join('');
}

// ---------- Boot ----------
function boot() {
  document.getElementById('lastUpdated').textContent = DATA_MODIFIED;

  initTabs();
  renderTicker();

  renderBoard('pointsBoard', POINTS_LEADERS, 'pts');
  renderBoard('ppgBoard', [...POINTS_LEADERS].sort((a,b)=>b.ppg-a.ppg), 'ppg', '', v => fmt(v,1));

  renderBoard('reboundBoard', REBOUND_LEADERS, 'reb');
  renderBoard('rpgBoard', [...REBOUND_LEADERS].sort((a,b)=>b.rpg-a.rpg), 'rpg', '', v => fmt(v,1));

  renderBoard('assistBoard', ASSIST_LEADERS, 'ast');
  renderBoard('apgBoard', [...ASSIST_LEADERS].sort((a,b)=>b.apg-a.apg), 'apg', '', v => fmt(v,1));

  renderBoard('scoringBoard', SCORING_BREAKDOWN, 'pts');
  wireRowClicks('scoringBoard', renderScoringDetail);
  renderScoringDetail(SCORING_BREAKDOWN[0].name);

  wireRowClicks('reboundBoard', renderReboundDetail);
  renderReboundDetail(REBOUND_LEADERS[0].name);

  wireRowClicks('assistBoard', renderAssistDetail);
  renderAssistDetail(ASSIST_LEADERS[0].name);

  renderPlaymaking();

  renderStandings();
  renderTitleContenders();
  renderAwards();
  renderRookies();
  renderMockDraft();

  renderPlayerProfiles();
  renderCourtDiagram();
}

document.addEventListener('DOMContentLoaded', boot);
