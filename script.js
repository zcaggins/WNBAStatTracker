// ============================================================
// WNBA Live Leaders — render logic. No build step, no deps.
// Reads the arrays defined in data.js.
// ============================================================

const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function teamLabel(abbr) {
  return TEAM_NAMES[abbr] || abbr;
}

// ============================================================
// LIVE GAMES — fetched client-side, not stored in data.js.
//
// Source: ESPN's public scoreboard endpoint —
//   https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard?dates=YYYYMMDD
// This is the same underlying ESPN data source the `wehoop` R package
// (espn_wnba_scoreboard()) wraps. wehoop itself is an R package and can't
// run in a browser, so this fetches the JSON endpoint it's built on
// directly. It's unauthenticated and publicly reachable, but it's an
// unofficial/undocumented ESPN endpoint — not a stable, versioned API —
// so treat outages or shape changes as possible, not a bug in this code.
// See README.md for more on this tradeoff.
// ============================================================

const ESPN_SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/scoreboard';
const ESPN_SUMMARY_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/summary';
const LIVE_REFRESH_MS = 60000; // re-poll the scoreboard every 60s while the Live Games tab is open
const PBP_REFRESH_MS = 15000;  // re-poll an open play-by-play feed every 15s — this is the "watch it happen" view

let liveGamesToday = null;    // cached parsed events, filled by renderLiveGames()
let liveGamesTomorrow = null;
let liveGamesTimer = null;
let selectedGameId = null;    // event id currently expanded in the play-by-play panel
let pbpTimer = null;

function espnDateParam(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

// Shared fetch helper: tries ESPN directly, falls back to a public CORS
// proxy if the browser blocks the direct request (see the comment above
// fetchScoreboard's original definition — same reasoning applies here).
async function fetchEspnJson(directUrl) {
  try {
    const res = await fetch(directUrl);
    if (!res.ok) throw new Error(`ESPN request failed (${res.status})`);
    return await res.json();
  } catch (directErr) {
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Proxy request failed (${res.status})`);
      return await res.json();
    } catch (proxyErr) {
      throw directErr;
    }
  }
}

async function fetchScoreboard(dateStr) {
  const json = await fetchEspnJson(`${ESPN_SCOREBOARD_URL}?dates=${dateStr}`);
  return json.events || [];
}

// Play-by-play + mini boxscore for one game, from ESPN's summary endpoint —
// the same one wehoop's espn_wnba_pbp()/espn_wnba_game_all() wrap.
async function fetchGameSummary(eventId) {
  return fetchEspnJson(`${ESPN_SUMMARY_URL}?event=${eventId}`);
}

function gameState(ev) {
  return ev.status?.type?.state || 'pre'; // 'pre' | 'in' | 'post'
}

function gameStatusText(ev) {
  const st = ev.status?.type;
  if (!st) return '';
  if (st.state === 'in') return st.shortDetail || 'In Progress';
  if (st.state === 'post') return 'Final';
  return st.shortDetail || 'Scheduled';
}

function gameTeamRow(competitor, showScore) {
  const t = competitor.team;
  const score = competitor.score;
  return `
    <div class="game-team-row">
      <img class="game-team-logo" src="${t.logo}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
      <span class="game-team-name">${t.displayName}</span>
      ${showScore ? `<span class="game-team-score">${score ?? '–'}</span>` : ''}
    </div>`;
}

function gameCardHTML(ev) {
  const comp = ev.competitions?.[0];
  const competitors = comp?.competitors || [];
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const state = gameState(ev);
  const isLive = state === 'in';
  const isFinal = state === 'post';
  const showScore = isLive || isFinal;
  const statusText = gameStatusText(ev);
  const broadcast = comp?.broadcasts?.[0]?.names?.join(', ');
  const isSelected = String(ev.id) === String(selectedGameId);

  return `
    <div class="game-card ${isLive ? 'game-live' : ''} ${isSelected ? 'game-selected' : ''}" data-event-id="${ev.id}" role="button" tabindex="0">
      <div class="game-status ${isLive ? 'live' : isFinal ? 'final' : 'scheduled'}">
        ${isLive ? '<span class="live-dot"></span>' : ''}${statusText}
      </div>
      ${away ? gameTeamRow(away, showScore) : ''}
      ${home ? gameTeamRow(home, showScore) : ''}
      ${broadcast ? `<div class="game-broadcast">📺 ${broadcast}</div>` : '<div class="game-broadcast">&nbsp;</div>'}
      <div class="game-pbp-hint">${isLive ? '▶ Tap for live play-by-play' : isFinal ? '▶ Tap for final play-by-play' : '▶ Tap for game info'}</div>
    </div>`;
}

function renderGamesInto(containerId, events, emptyLabel) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = events.length
    ? events.map(gameCardHTML).join('')
    : `<p class="empty-text">${emptyLabel}</p>`;
}

function wireGameCardClicks(containerId) {
  const el = document.getElementById(containerId);
  if (!el || el.dataset.pbpWired) return;
  el.dataset.pbpWired = '1';
  el.addEventListener('click', e => {
    const card = e.target.closest('.game-card');
    if (!card) return;
    selectGame(card.dataset.eventId);
  });
  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.game-card');
    if (!card) return;
    e.preventDefault();
    selectGame(card.dataset.eventId);
  });
}

// ---------- Play-by-play panel: the "watch the game happen" view ----------

function playPeriodLabel(play) {
  const num = play.period?.number ?? (typeof play.period === 'number' ? play.period : null);
  if (!num) return '';
  return num <= 4 ? `Q${num}` : `OT${num - 4}`;
}

function playClockLabel(play) {
  return play.clock?.displayValue ?? play.displayClock ?? '';
}

function renderPlayByPlayPanel(data) {
  const panel = document.getElementById('playByPlayPanel');
  if (!panel) return;

  const headerComp = data.header?.competitions?.[0];
  const competitors = headerComp?.competitors || [];
  const home = competitors.find(c => c.homeAway === 'home');
  const away = competitors.find(c => c.homeAway === 'away');
  const status = headerComp?.status;
  const statusText = status?.type?.shortDetail || status?.type?.description || '';
  const isLive = status?.type?.state === 'in';

  const plays = Array.isArray(data.plays) ? [...data.plays].reverse() : [];
  const shown = plays.slice(0, 40);

  const scoreboardHTML = (home && away) ? `
    <div class="pbp-scoreboard">
      <div class="pbp-team">
        <img src="${away.team?.logo || ''}" alt="" class="pbp-team-logo" loading="lazy" onerror="this.style.visibility='hidden'">
        <span class="pbp-team-name">${away.team?.shortDisplayName || away.team?.displayName || ''}</span>
        <span class="pbp-team-score">${away.score ?? '–'}</span>
      </div>
      <div class="pbp-status">${isLive ? '<span class="live-dot"></span>' : ''}${statusText}</div>
      <div class="pbp-team">
        <img src="${home.team?.logo || ''}" alt="" class="pbp-team-logo" loading="lazy" onerror="this.style.visibility='hidden'">
        <span class="pbp-team-name">${home.team?.shortDisplayName || home.team?.displayName || ''}</span>
        <span class="pbp-team-score">${home.score ?? '–'}</span>
      </div>
    </div>` : '';

  const feedHTML = shown.length ? shown.map(p => {
    const isScoring = !!p.scoringPlay;
    const period = playPeriodLabel(p);
    const clock = playClockLabel(p);
    const scoreTag = isScoring && p.scoreValue ? `<span class="pbp-score-tag">+${p.scoreValue}</span>` : '';
    return `
      <div class="pbp-play ${isScoring ? 'pbp-scoring' : ''}">
        <span class="pbp-play-time">${period}${period && clock ? ' · ' : ''}${clock}</span>
        <span class="pbp-play-text">${p.text || 'Play detail unavailable'}</span>
        ${scoreTag}
      </div>`;
  }).join('') : `<p class="empty-text">No play-by-play yet — check back once the game tips off.</p>`;

  panel.innerHTML = `
    ${scoreboardHTML}
    <div class="pbp-feed-head">
      <span>${isLive ? '\u25CF LIVE PLAY-BY-PLAY' : 'PLAY-BY-PLAY'}</span>
      <button id="closePbpBtn" type="button" class="pbp-close-btn">Close ✕</button>
    </div>
    <div class="pbp-feed">${feedHTML}</div>
  `;
  document.getElementById('closePbpBtn')?.addEventListener('click', closePlayByPlay);
  panel.classList.add('active');
}

async function loadPlayByPlay(eventId, { silent } = {}) {
  const panel = document.getElementById('playByPlayPanel');
  if (!panel) return;
  if (!silent) panel.innerHTML = `<p class="loading-text">Loading play-by-play…</p>`;
  panel.classList.add('active');
  try {
    const data = await fetchGameSummary(eventId);
    if (selectedGameId !== eventId) return; // user moved on before this resolved
    renderPlayByPlayPanel(data);
  } catch (err) {
    if (selectedGameId !== eventId) return;
    panel.innerHTML = `<p class="empty-text">Couldn't load play-by-play for this game right now — ESPN's public data feed may be temporarily unavailable. Tap the game again in a moment to retry.</p>`;
  }
}

function startPbpPolling(eventId) {
  stopPbpPolling();
  pbpTimer = setInterval(() => {
    if (selectedGameId === eventId) loadPlayByPlay(eventId, { silent: true });
  }, PBP_REFRESH_MS);
}

function stopPbpPolling() {
  if (pbpTimer) { clearInterval(pbpTimer); pbpTimer = null; }
}

function selectGame(eventId) {
  if (!eventId) return;
  selectedGameId = eventId;
  if (liveGamesToday) renderGamesInto('todayGamesContainer', liveGamesToday, 'No games scheduled today.');
  if (liveGamesTomorrow) renderGamesInto('tomorrowGamesContainer', liveGamesTomorrow, 'No games scheduled tomorrow.');
  loadPlayByPlay(eventId);
  startPbpPolling(eventId);
  document.getElementById('playByPlayPanel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePlayByPlay() {
  selectedGameId = null;
  stopPbpPolling();
  const panel = document.getElementById('playByPlayPanel');
  if (panel) { panel.innerHTML = ''; panel.classList.remove('active'); }
  if (liveGamesToday) renderGamesInto('todayGamesContainer', liveGamesToday, 'No games scheduled today.');
  if (liveGamesTomorrow) renderGamesInto('tomorrowGamesContainer', liveGamesTomorrow, 'No games scheduled tomorrow.');
}

function renderTickerFromGames(events) {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  if (!events.length) {
    track.innerHTML = `<span class="ticker-item"><b>No WNBA games scheduled today</b></span>`.repeat(2);
    return;
  }
  const items = events.map(ev => {
    const comp = ev.competitions?.[0];
    const competitors = comp?.competitors || [];
    const home = competitors.find(c => c.homeAway === 'home');
    const away = competitors.find(c => c.homeAway === 'away');
    const state = gameState(ev);
    const statusText = gameStatusText(ev);
    if (!home || !away) return '';
    if (state === 'pre') {
      return `<span class="ticker-item"><b>${away.team.abbreviation} @ ${home.team.abbreviation}</b> <span class="stat-num">${statusText}</span></span>`;
    }
    return `<span class="ticker-item"><b>${away.team.abbreviation} ${away.score}</b> — <b>${home.team.abbreviation} ${home.score}</b> <span class="stat-num">${statusText}</span></span>`;
  }).join('');
  track.innerHTML = items + items; // duplicate for seamless scroll
}

async function loadLiveGames({ silent } = {}) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (!silent) {
    renderGamesInto('todayGamesContainer', [], 'Loading today’s games…');
    renderGamesInto('tomorrowGamesContainer', [], 'Loading tomorrow’s games…');
  }

  try {
    liveGamesToday = await fetchScoreboard(espnDateParam(today));
    renderGamesInto('todayGamesContainer', liveGamesToday, 'No games scheduled today.');
    renderTickerFromGames(liveGamesToday);
  } catch (err) {
    liveGamesToday = [];
    renderGamesInto('todayGamesContainer', [], "Couldn't load today's games right now — ESPN's public scoreboard may be temporarily unavailable. Try refreshing in a moment.");
  }

  try {
    liveGamesTomorrow = await fetchScoreboard(espnDateParam(tomorrow));
    renderGamesInto('tomorrowGamesContainer', liveGamesTomorrow, 'No games scheduled tomorrow.');
  } catch (err) {
    liveGamesTomorrow = [];
    renderGamesInto('tomorrowGamesContainer', [], "Couldn't load tomorrow's games right now.");
  }

  const stamp = document.getElementById('liveGamesUpdated');
  if (stamp) stamp.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function startLiveGamesPolling() {
  if (liveGamesTimer) return;
  liveGamesTimer = setInterval(() => loadLiveGames({ silent: true }), LIVE_REFRESH_MS);
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
  if (!p) {
    // Every points leader is clickable, but a shot-type breakdown isn't
    // available for every one of them from the source data — show her
    // total honestly instead of guessing at a split.
    const fallback = POINTS_LEADERS.find(x => x.name === name);
    if (!fallback) { wrap.classList.remove('active'); return; }
    wrap.innerHTML = `
      <div>
        <p class="detail-head">${fallback.name}</p>
        <p class="detail-sub">${teamLabel(fallback.team)} — ${fmt(fallback.pts)} points this season (${fmt(fallback.ppg,1)} PPG)</p>
      </div>
      <div class="detail-sub">A shot-type (2PT / 3PT / FT) breakdown isn't available for every player in the source data — just for this season's leading scorers.</div>
    `;
    wrap.classList.add('active');
    return;
  }

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
  const colors = ['#F57B20', '#FFA655', '#2FAE72'];
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

// ---------- Assist detail (real assist %) ----------
function renderAssistDetail(name) {
  const p = ASSIST_LEADERS.find(x => x.name === name);
  const wrap = document.getElementById('assistDetail');
  if (!p) { wrap.classList.remove('active'); return; }

  wrap.innerHTML = `
    <div>
      <p class="detail-head">${p.name}</p>
      <p class="detail-sub">${teamLabel(p.team)} — ${fmt(p.ast)} assists (${fmt(p.apg,1)}/gm)</p>
      <div class="stat-chip">Assist %: <b>${fmt(p.astPct,1)}%</b></div>
      <p class="detail-sub" style="margin-top:10px">Assist % estimates the share of teammate field goals a player assisted while on the floor.</p>
    </div>
    <div></div>
  `;
  wrap.classList.add('active');
}

// ---------- Wire up click-to-detail ----------
function wireRowClicks(containerId, renderFn) {
  document.getElementById(containerId).addEventListener('click', e => {
    const row = e.target.closest('.leader-row');
    if (!row) return;
    document.querySelectorAll(`#${containerId} .leader-row`).forEach(r => r.style.background = '');
    row.style.background = 'rgba(245,123,32,0.14)';
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

// ---------- Playoff bracket ----------

// Pulls a team's top performer from each of the three real stat boards
// (points/rebounds/assists), deduping by name — this is how the popup's
// "Star Players" list stays in sync with the stat boards automatically
// instead of being hand-maintained twice.
function getStarPlayers(team) {
  const candidates = [
    POINTS_LEADERS.filter(p => p.team === team).sort((a,b)=>b.pts-a.pts)[0] &&
      { ...POINTS_LEADERS.filter(p => p.team === team).sort((a,b)=>b.pts-a.pts)[0], stat: `${fmt(POINTS_LEADERS.find(p=>p.team===team).ppg,1)} PPG` },
    REBOUND_LEADERS.filter(r => r.team === team).sort((a,b)=>b.reb-a.reb)[0] &&
      { ...REBOUND_LEADERS.filter(r => r.team === team).sort((a,b)=>b.reb-a.reb)[0], stat: `${fmt(REBOUND_LEADERS.find(r=>r.team===team).rpg,1)} RPG` },
    ASSIST_LEADERS.filter(a => a.team === team).sort((a,b)=>b.ast-a.ast)[0] &&
      { ...ASSIST_LEADERS.filter(a => a.team === team).sort((a,b)=>b.ast-a.ast)[0], stat: `${fmt(ASSIST_LEADERS.find(a=>a.team===team).apg,1)} APG` },
  ].filter(Boolean);

  const seen = new Set();
  return candidates.filter(p => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

function seedCardHTML(seedNum, team, opts = {}) {
  if (!team) {
    return `
      <div class="seed-card seed-tbd">
        <span class="seed-num">${seedNum ?? '?'}</span>
        <span class="seed-name">TBD</span>
        <span class="seed-record">${opts.pendingLabel || 'Awaiting winner'}</span>
      </div>`;
  }
  const s = STANDINGS.find(x => x.team === team);
  const color = TEAM_COLORS[team] || '#F57B20';
  return `
    <div class="seed-card" data-team="${team}" role="button" tabindex="0" style="border-left-color:${color}">
      <span class="seed-num">${seedNum}</span>
      <span class="seed-name">${teamLabel(team)}</span>
      <span class="seed-record">${s ? `${s.w}-${s.l}` : ''}</span>
    </div>`;
}

function matchupHTML(seedA, teamA, seedB, teamB, pendingLabel) {
  return `
    <div class="matchup">
      ${seedCardHTML(seedA, teamA)}
      <div class="matchup-vs">vs</div>
      ${seedCardHTML(seedB, teamB, { pendingLabel })}
    </div>`;
}

function renderBracket() {
  const el = document.getElementById('playoffBracket');
  if (!el) return;
  const seeds = STANDINGS.slice(0, 8); // ranks 1-8, already sorted
  const byRank = r => seeds.find(s => s.rank === r)?.team;

  el.innerHTML = `
    <div class="bracket">
      <div class="bracket-round">
        <div class="bracket-round-title">First Round <span>Best of 3</span></div>
        ${matchupHTML(1, byRank(1), 8, byRank(8))}
        ${matchupHTML(4, byRank(4), 5, byRank(5))}
        ${matchupHTML(2, byRank(2), 7, byRank(7))}
        ${matchupHTML(3, byRank(3), 6, byRank(6))}
      </div>
      <div class="bracket-round bracket-round-semis">
        <div class="bracket-round-title">Semifinals <span>Best of 5</span></div>
        ${matchupHTML(null, null, null, null, 'Winner: 1 vs 8')}
        ${matchupHTML(null, null, null, null, 'Winner: 2 vs 7')}
      </div>
      <div class="bracket-round bracket-round-finals">
        <div class="bracket-round-title">Finals <span>Best of 7</span></div>
        ${matchupHTML(null, null, null, null, 'Semifinal winner')}
      </div>
    </div>
  `;

  el.querySelectorAll('.seed-card[data-team]').forEach(card => {
    card.addEventListener('click', () => openTeamModal(card.dataset.team));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTeamModal(card.dataset.team); }
    });
  });
}

function openTeamModal(team) {
  const modal = document.getElementById('teamModal');
  const scouting = TEAM_SCOUTING[team];
  const standing = STANDINGS.find(s => s.team === team);
  if (!modal || !scouting || !standing) return;

  const stars = getStarPlayers(team);
  const color = TEAM_COLORS[team] || '#F57B20';

  modal.innerHTML = `
    <div class="team-modal-backdrop">
      <div class="team-modal-box" style="border-top-color:${color}">
        <button type="button" class="team-modal-close" id="teamModalClose">Close ✕</button>
        <p class="team-modal-name">${teamLabel(team)}</p>
        <p class="team-modal-record">Seed ${standing.rank} &middot; ${scouting.record} &middot; ${fmt(standing.pct,3).replace('0.','.')} win pct</p>

        <h4 class="team-modal-h4">Play Style</h4>
        <p class="team-modal-text">${scouting.playStyle}</p>

        <h4 class="team-modal-h4">Star Players</h4>
        <div class="team-modal-stars">
          ${stars.map(p => `<span class="stat-chip" style="margin:0 6px 6px 0">${p.name} <b>${p.stat}</b></span>`).join('')}
        </div>

        <h4 class="team-modal-h4">Strengths</h4>
        <ul class="team-modal-list team-modal-strengths">
          ${scouting.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>

        <h4 class="team-modal-h4">Weaknesses</h4>
        <ul class="team-modal-list team-modal-weaknesses">
          ${scouting.weaknesses.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>
    </div>`;
  modal.classList.add('active');
  document.getElementById('teamModalClose')?.addEventListener('click', closeTeamModal);
  modal.querySelector('.team-modal-backdrop')?.addEventListener('click', e => {
    if (e.target.classList.contains('team-modal-backdrop')) closeTeamModal();
  });
  document.addEventListener('keydown', escCloseModal);
}

function escCloseModal(e) {
  if (e.key === 'Escape') closeTeamModal();
}

function closeTeamModal() {
  const modal = document.getElementById('teamModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.innerHTML = '';
  document.removeEventListener('keydown', escCloseModal);
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

// ---------- Boot ----------
// Each section is wrapped so a failure in one (bad data, a missing element,
// a network hiccup) can never take down the others. If something's still
// not populating after this, check the browser console — the section name
// will be in the logged error.
function safely(label, fn) {
  try { fn(); } catch (err) { console.error(`[boot] "${label}" failed to render:`, err); }
}

function boot() {
  safely('header timestamp', () => {
    document.getElementById('lastUpdated').textContent = DATA_MODIFIED;
  });

  safely('tabs', initTabs);

  safely('live games', () => {
    loadLiveGames();
    startLiveGamesPolling();
    wireGameCardClicks('todayGamesContainer');
    wireGameCardClicks('tomorrowGamesContainer');
    const btn = document.getElementById('refreshGamesBtn');
    if (btn) btn.addEventListener('click', () => loadLiveGames());
  });

  safely('points board', () => {
    renderBoard('pointsBoard', POINTS_LEADERS, 'pts');
    renderBoard('ppgBoard', [...POINTS_LEADERS].sort((a,b)=>b.ppg-a.ppg), 'ppg', '', v => fmt(v,1));
    wireRowClicks('pointsBoard', renderScoringDetail);
    renderScoringDetail(POINTS_LEADERS[0].name);
  });

  safely('rebound boards', () => {
    renderBoard('reboundBoard', REBOUND_LEADERS, 'reb');
    renderBoard('rpgBoard', [...REBOUND_LEADERS].sort((a,b)=>b.rpg-a.rpg), 'rpg', '', v => fmt(v,1));
  });

  safely('assist boards', () => {
    renderBoard('assistBoard', ASSIST_LEADERS, 'ast');
    renderBoard('apgBoard', [...ASSIST_LEADERS].sort((a,b)=>b.apg-a.apg), 'apg', '', v => fmt(v,1));
  });

  safely('rebound detail', () => {
    wireRowClicks('reboundBoard', renderReboundDetail);
    renderReboundDetail(REBOUND_LEADERS[0].name);
  });

  safely('assist detail', () => {
    wireRowClicks('assistBoard', renderAssistDetail);
    renderAssistDetail(ASSIST_LEADERS[0].name);
  });

  safely('standings', renderStandings);
  safely('playoff bracket', renderBracket);
  safely('awards', renderAwards);
}

document.addEventListener('DOMContentLoaded', boot);
