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

// ---------- Generic popup modal (shared by team scouting + stat breakdowns) ----------
function openModal(bodyHTML, accentColor) {
  const modal = document.getElementById('appModal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="team-modal-backdrop">
      <div class="team-modal-box" style="border-top-color:${accentColor || 'var(--sky-deep)'}">
        <button type="button" class="team-modal-close" id="appModalClose">Close ✕</button>
        ${bodyHTML}
      </div>
    </div>`;
  modal.classList.add('active');
  document.getElementById('appModalClose')?.addEventListener('click', closeModal);
  modal.querySelector('.team-modal-backdrop')?.addEventListener('click', e => {
    if (e.target.classList.contains('team-modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', escCloseModal);
}

function escCloseModal(e) {
  if (e.key === 'Escape') closeModal();
}

function closeModal() {
  const modal = document.getElementById('appModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.innerHTML = '';
  document.removeEventListener('keydown', escCloseModal);
}

// ---------- Scoring breakdown popup ----------
function openScoringModal(name) {
  const p = SCORING_BREAKDOWN.find(x => x.name === name);
  if (!p) {
    // Every points leader is clickable, but a shot-type breakdown isn't
    // available for every one of them from the source data — show her
    // total honestly instead of guessing at a split.
    const fallback = POINTS_LEADERS.find(x => x.name === name);
    if (!fallback) return;
    openModal(`
      <p class="team-modal-name">${fallback.name}</p>
      <p class="team-modal-record">${teamLabel(fallback.team)} — ${fmt(fallback.pts)} points this season (${fmt(fallback.ppg,1)} PPG)</p>
      <p class="team-modal-text" style="margin-top:14px">A shot-type (2PT / 3PT / FT) breakdown isn't available for every player in the source data — just for this season's leading scorers.</p>
    `, TEAM_COLORS[fallback.team] || '#F57B20');
    return;
  }

  const twoPts = p.twoPM * 2;
  const threePts = p.threePM * 3;
  const ftPts = p.ftm;
  // inline CSS vars don't resolve inside raw SVG strings reliably across browsers,
  // so resolve to hex directly:
  const colors = ['#FF9F1C', '#35C7E8', '#C084FC'];
  const svgSegments = [
    { value: twoPts, color: colors[0] },
    { value: threePts, color: colors[1] },
    { value: ftPts, color: colors[2] },
  ];

  openModal(`
    <p class="team-modal-name">${p.name}</p>
    <p class="team-modal-record">${teamLabel(p.team)} — ${fmt(p.pts)} points this season</p>
    <div class="donut-wrap" style="margin-top:16px">
      ${donutSVG(svgSegments, 150)}
      <div class="legend">
        <div class="legend-item"><span class="swatch" style="background:${colors[0]}"></span>2PT — ${p.twoPM} makes (${fmt(twoPts)} pts)</div>
        <div class="legend-item"><span class="swatch" style="background:${colors[1]}"></span>3PT — ${p.threePM} makes (${fmt(threePts)} pts)</div>
        <div class="legend-item"><span class="swatch" style="background:${colors[2]}"></span>FT — ${p.ftm} makes (${fmt(ftPts)} pts)</div>
      </div>
    </div>
    <div style="margin-top:14px">
      <div class="stat-chip">Share from 2PT: <b>${fmt(twoPts/p.pts*100,0)}%</b></div>
      <div class="stat-chip">Share from 3PT: <b>${fmt(threePts/p.pts*100,0)}%</b></div>
      <div class="stat-chip">Share from FT: <b>${fmt(ftPts/p.pts*100,0)}%</b></div>
    </div>
  `, TEAM_COLORS[p.team] || colors[0]);
}

// ---------- Rebound off/def popup ----------
function openReboundModal(name) {
  const p = REBOUND_LEADERS.find(x => x.name === name);
  if (!p) return;

  const orebPct = (p.oreb / p.reb) * 100;
  const drebPct = (p.dreb / p.reb) * 100;

  openModal(`
    <p class="team-modal-name">${p.name}</p>
    <p class="team-modal-record">${teamLabel(p.team)} — ${fmt(p.reb)} total rebounds (${fmt(p.rpg,1)}/gm)</p>
    <div class="legend" style="margin-top:16px">
      <div class="legend-item"><span class="swatch" style="background:var(--amber)"></span>Offensive — ${p.oreb} (${fmt(orebPct,0)}%)</div>
      <div class="legend-item"><span class="swatch" style="background:var(--maple-deep)"></span>Defensive — ${p.dreb} (${fmt(drebPct,0)}%)</div>
    </div>
    <p class="team-modal-text" style="margin:14px 0 6px">Offensive vs. defensive split</p>
    <div class="stack-bar">
      <div class="stack-oreb" style="width:${orebPct}%"></div>
      <div class="stack-dreb" style="width:${drebPct}%"></div>
    </div>
    <div style="margin-top:14px">
      <div class="stat-chip">OREB / gm: <b>${fmt(p.oreb / (p.reb/p.rpg), 1)}</b></div>
      <div class="stat-chip">DREB / gm: <b>${fmt(p.dreb / (p.reb/p.rpg), 1)}</b></div>
    </div>
  `, TEAM_COLORS[p.team] || '#F57B20');
}

// ---------- Assist detail popup (real assist %) ----------
function openAssistModal(name) {
  const p = ASSIST_LEADERS.find(x => x.name === name);
  if (!p) return;

  openModal(`
    <p class="team-modal-name">${p.name}</p>
    <p class="team-modal-record">${teamLabel(p.team)} — ${fmt(p.ast)} assists (${fmt(p.apg,1)}/gm)</p>
    <div class="stat-chip" style="margin-top:16px">Assist %: <b>${fmt(p.astPct,1)}%</b></div>
    <p class="team-modal-text" style="margin-top:10px">Assist % estimates the share of teammate field goals a player assisted while on the floor.</p>
  `, TEAM_COLORS[p.team] || '#F57B20');
}

// ---------- Wire up click-to-detail ----------
function wireRowClicks(containerId, onClickName) {
  document.getElementById(containerId).addEventListener('click', e => {
    const row = e.target.closest('.leader-row');
    if (!row) return;
    onClickName(row.dataset.name);
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

// Builds the classic 8-team seeded bracket: seed boxes on the left, in the
// standard template order (1,8,4,5 / 3,6,2,7), connected by elbow lines
// that converge in three stages down to a single line feeding a
// "CHAMPION" label — matching the standard printable bracket layout
// (1v8 and 4v5 in the top group, 3v6 and 2v7 in the bottom group, no
// reseeding between rounds). Coordinates are computed once and used for
// both the SVG lines and the percentage-positioned seed boxes so they
// always stay aligned, including when the SVG scales responsively.
function renderBracket() {
  const el = document.getElementById('playoffBracket');
  if (!el) return;
  const seeds = STANDINGS.slice(0, 8); // ranks 1-8, already sorted
  const byRank = r => seeds.find(s => s.rank === r)?.team;

  // Standard template row order, top to bottom.
  const rowOrder = [1, 8, 4, 5, 3, 6, 2, 7];
  const ROW_H = 54;
  const TOP = 37;
  const rows = rowOrder.map((rank, i) => ({ rank, team: byRank(rank), y: TOP + ROW_H * i }));

  const BOX_X0 = 4, BOX_W = 172, BOX_H = 36;
  const X1 = BOX_X0 + BOX_W;
  const COL_A = 236;  // stage 1 vertical bar (merges each seed pair)
  const COL_B = 304;  // stage 1 output / stage 2 vertical bar (merges pairs of pairs)
  const COL_C = 372;  // stage 2 output / stage 3 vertical bar (merges the two halves)
  const COL_D = 442;  // stage 3 output -> champion line
  const TOTAL_W = COL_D + 150;
  const TOTAL_H = TOP + ROW_H * 7 + 27 + 16;

  const lines = [];
  const ln = (x1, y1, x2, y2) => lines.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="bracket-line"/>`);

  // Stage 1: pair up rows (0,1) (2,3) (4,5) (6,7) — the four first-round matchups.
  const stage1Mids = [];
  for (let p = 0; p < 4; p++) {
    const yA = rows[p * 2].y, yB = rows[p * 2 + 1].y;
    ln(X1, yA, COL_A, yA);
    ln(X1, yB, COL_A, yB);
    ln(COL_A, yA, COL_A, yB);
    const mid = (yA + yB) / 2;
    ln(COL_A, mid, COL_B, mid);
    stage1Mids.push(mid);
  }

  // Stage 2: pair up stage1 midpoints (0,1) top half and (2,3) bottom half.
  const stage2Mids = [];
  for (let p = 0; p < 2; p++) {
    const yA = stage1Mids[p * 2], yB = stage1Mids[p * 2 + 1];
    ln(COL_B, yA, COL_B, yB);
    const mid = (yA + yB) / 2;
    ln(COL_B, mid, COL_C, mid);
    stage2Mids.push(mid);
  }

  // Stage 3: merge the two halves into the single line leading to Champion.
  const finalMid = (stage2Mids[0] + stage2Mids[1]) / 2;
  ln(COL_C, stage2Mids[0], COL_C, stage2Mids[1]);
  ln(COL_C, finalMid, COL_D, finalMid);

  const svg = `
    <svg class="bracket-svg" viewBox="0 0 ${TOTAL_W} ${TOTAL_H}" preserveAspectRatio="none" aria-hidden="true">
      ${lines.join('')}
      <text x="${COL_D + 14}" y="${finalMid - 10}" class="bracket-champion-label">CHAMPION</text>
      <line x1="${COL_D + 6}" y1="${finalMid + 4}" x2="${TOTAL_W - 6}" y2="${finalMid + 4}" class="bracket-line"/>
    </svg>`;

  const pct = (v, total) => `${(v / total * 100).toFixed(3)}%`;

  const seedBoxes = rows.map(r => {
    if (!r.team) return '';
    const s = STANDINGS.find(x => x.team === r.team);
    const color = TEAM_COLORS[r.team] || '#F57B20';
    return `
      <div class="bracket-seed" data-team="${r.team}" role="button" tabindex="0" style="
        top:${pct(r.y - BOX_H / 2, TOTAL_H)}; left:${pct(BOX_X0, TOTAL_W)};
        width:${pct(BOX_W, TOTAL_W)}; height:${pct(BOX_H, TOTAL_H)};
        border-left-color:${color}">
        <span class="bracket-seed-num">${r.rank}</span>
        <span class="bracket-seed-name">${teamLabel(r.team)}</span>
        <span class="bracket-seed-record">${s ? `${s.w}-${s.l}` : ''}</span>
      </div>`;
  }).join('');

  el.innerHTML = `<div class="bracket-diagram" style="aspect-ratio:${TOTAL_W}/${TOTAL_H}">${svg}${seedBoxes}</div>`;

  el.querySelectorAll('.bracket-seed[data-team]').forEach(card => {
    card.addEventListener('click', () => openTeamModal(card.dataset.team));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openTeamModal(card.dataset.team); }
    });
  });
}

function openTeamModal(team) {
  const scouting = TEAM_SCOUTING[team];
  const standing = STANDINGS.find(s => s.team === team);
  if (!scouting || !standing) return;

  const stars = getStarPlayers(team);
  const color = TEAM_COLORS[team] || '#F57B20';

  openModal(`
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
  `, color);
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

  safely('points boards', () => {
    renderBoard('pointsBoard', POINTS_LEADERS, 'pts');
    renderBoard('ppgBoard', [...POINTS_LEADERS].sort((a,b)=>b.ppg-a.ppg), 'ppg', '', v => fmt(v,1));
    wireRowClicks('pointsBoard', openScoringModal);
    wireRowClicks('ppgBoard', openScoringModal);
  });

  safely('rebound boards', () => {
    renderBoard('reboundBoard', REBOUND_LEADERS, 'reb');
    renderBoard('rpgBoard', [...REBOUND_LEADERS].sort((a,b)=>b.rpg-a.rpg), 'rpg', '', v => fmt(v,1));
    wireRowClicks('reboundBoard', openReboundModal);
    wireRowClicks('rpgBoard', openReboundModal);
  });

  safely('assist boards', () => {
    renderBoard('assistBoard', ASSIST_LEADERS, 'ast');
    renderBoard('apgBoard', [...ASSIST_LEADERS].sort((a,b)=>b.apg-a.apg), 'apg', '', v => fmt(v,1));
    wireRowClicks('assistBoard', openAssistModal);
    wireRowClicks('apgBoard', openAssistModal);
  });

  safely('standings', renderStandings);
  safely('playoff bracket', renderBracket);
  safely('awards', renderAwards);
}

document.addEventListener('DOMContentLoaded', boot);
