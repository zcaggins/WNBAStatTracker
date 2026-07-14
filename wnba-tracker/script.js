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
}

document.addEventListener('DOMContentLoaded', boot);
