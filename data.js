/**
 * WNBA 2026 season stat data.
 * Source: Basketball-Reference.com, 2026 WNBA Leaders page, pulled 2026-07-14.
 * https://www.basketball-reference.com/wnba/years/2026_leaders.html
 *
 * This file is the single point of truth for the dashboard. To refresh with
 * new numbers, edit the arrays below (see README.md "Updating the data").
 * Everything in POINTS / REBOUNDS / ASSISTS / SCORING_BREAKDOWN is real,
 * publicly reported season-total data. PLAYMAKING_STYLE is explicitly
 * marked as illustrative — see the note in that section and in the UI.
 */

const DATA_MODIFIED = "2026-07-14";

const POINTS_LEADERS = [
  { name: "A'ja Wilson", team: "LVA", pts: 562, ppg: 25.5 },
  { name: "Kelsey Mitchell", team: "IND", pts: 523, ppg: 22.7 },
  { name: "Paige Bueckers", team: "DAL", pts: 476, ppg: 20.7 },
  { name: "Marina Mabrey", team: "TOR", pts: 476, ppg: 21.6 },
  { name: "Breanna Stewart", team: "NYL", pts: 469, ppg: 20.4 },
  { name: "Kahleah Copper", team: "PHO", pts: 467, ppg: 20.3 },
  { name: "Allisha Gray", team: "ATL", pts: 430, ppg: 18.7 },
  { name: "Rhyne Howard", team: "ATL", pts: 407, ppg: 18.5 },
  { name: "Natisha Hiedeman", team: "SEA", pts: 406, ppg: 16.2 },
  { name: "Olivia Miles", team: "MIN", pts: 393, ppg: 18.7 },
  { name: "Natasha Howard", team: "MIN", pts: 389, ppg: 16.9 },
  { name: "Jackie Young", team: "LVA", pts: 387, ppg: 16.1 },
  { name: "Caitlin Clark", team: "IND", pts: 381, ppg: 20.1 },
  { name: "Kayla McBride", team: "MIN", pts: 372, ppg: 16.2 },
  { name: "Aliyah Boston", team: "IND", pts: 364, ppg: 17.3 },
  { name: "Courtney Williams", team: "MIN", pts: 364, ppg: 15.8 },
  { name: "Jessica Shepard", team: "DAL", pts: 360, ppg: 15.7 },
  { name: "Jonquel Jones", team: "NYL", pts: 344, ppg: 15.0 },
  { name: "Gabby Williams", team: "GSV", pts: 344, ppg: 14.5 },
  { name: "Nneka Ogwumike", team: "LAS", pts: 338, ppg: 16.9 },
];

const REBOUND_LEADERS = [
  // reb = total rebounds, rpg, oreb, dreb (oreb+dreb may run slightly under total due to team/team-rebound rounding upstream)
  { name: "Jessica Shepard", team: "DAL", reb: 279, rpg: 11.6, oreb: 78, dreb: 201 },
  { name: "Angel Reese", team: "ATL", reb: 258, rpg: 11.7, oreb: 116, dreb: 142 },
  { name: "A'ja Wilson", team: "LVA", reb: 215, rpg: 9.8, oreb: 44, dreb: 171 },
  { name: "Jonquel Jones", team: "NYL", reb: 214, rpg: 9.3, oreb: 44, dreb: 170 },
  { name: "Kamilla Cardoso", team: "CHI", reb: 198, rpg: 8.6, oreb: 58, dreb: 140 },
  { name: "Breanna Stewart", team: "NYL", reb: 193, rpg: 8.4, oreb: 35, dreb: 158 },
  { name: "Natasha Howard", team: "MIN", reb: 186, rpg: 8.1, oreb: 78, dreb: 108 },
  { name: "Aliyah Boston", team: "IND", reb: 184, rpg: 8.8, oreb: 39, dreb: 145 },
  { name: "Shakira Austin", team: "WAS", reb: 181, rpg: 9.1, oreb: 35, dreb: 146 },
  { name: "Nneka Ogwumike", team: "LAS", reb: 176, rpg: 8.8, oreb: 35, dreb: 141 },
  { name: "Kiki Iriafen", team: "WAS", reb: 170, rpg: 9.4, oreb: 48, dreb: 122 },
  { name: "Dearica Hamby", team: "LAS", reb: 162, rpg: 7.7, oreb: 45, dreb: 117 },
  { name: "Aneesah Morrow", team: "CON", reb: 159, rpg: 9.4, oreb: 47, dreb: 112 },
  { name: "Alyssa Thomas", team: "PHO", reb: 150, rpg: 6.8, oreb: 35, dreb: 115 },
  { name: "Natasha Mack", team: "PHO", reb: 149, rpg: 8.3, oreb: 53, dreb: 96 },
];

const ASSIST_LEADERS = [
  { name: "Chelsea Gray", team: "LVA", ast: 178, apg: 7.4, astPct: 32.8 },
  { name: "Alyssa Thomas", team: "PHO", ast: 173, apg: 7.9, astPct: 43.7 },
  { name: "Jordin Canada", team: "ATL", ast: 168, apg: 7.3, astPct: 36.8 },
  { name: "Jackie Young", team: "LVA", ast: 158, apg: 6.6, astPct: 32.3 },
  { name: "Caitlin Clark", team: "IND", ast: 148, apg: 7.8, astPct: 44.8 },
  { name: "Paige Bueckers", team: "DAL", ast: 144, apg: 6.3, astPct: 31.2 },
  { name: "Veronica Burton", team: "GSV", ast: 127, apg: 5.3, astPct: 33.1 },
  { name: "Jessica Shepard", team: "DAL", ast: 125, apg: 5.2, astPct: 24.5 },
  { name: "Carla Leite", team: "POR", ast: 122, apg: 5.8, astPct: 41.0 },
  { name: "Olivia Miles", team: "MIN", ast: 117, apg: 5.7, astPct: 28.8 },
  { name: "Natisha Hiedeman", team: "SEA", ast: 109, apg: 4.4, astPct: 30.0 },
  { name: "Erica Wheeler", team: "LAS", ast: 105, apg: 5.0, astPct: 27.1 },
];

// Points broken into makes by shot type (2PT / 3PT / FT), derived arithmetically
// from official Basketball-Reference season totals (FG, 2PT FG, 3PT FG, FT
// leaderboards) and cross-checked against each player's total points, so every
// row below sums exactly to that player's PTS total.
const SCORING_BREAKDOWN = [
  { name: "A'ja Wilson", team: "LVA", twoPM: 181, threePM: 20, ftm: 140, pts: 562 },
  { name: "Kelsey Mitchell", team: "IND", twoPM: 119, threePM: 61, ftm: 102, pts: 523 },
  { name: "Paige Bueckers", team: "DAL", twoPM: 142, threePM: 40, ftm: 72, pts: 476 },
  { name: "Marina Mabrey", team: "TOR", twoPM: 81, threePM: 76, ftm: 86, pts: 476 },
  { name: "Breanna Stewart", team: "NYL", twoPM: 141, threePM: 16, ftm: 139, pts: 469 },
  { name: "Natisha Hiedeman", team: "SEA", twoPM: 92, threePM: 55, ftm: 57, pts: 406 },
  { name: "Olivia Miles", team: "MIN", twoPM: 111, threePM: 25, ftm: 96, pts: 393 },
  { name: "Natasha Howard", team: "MIN", twoPM: 156, threePM: 2, ftm: 71, pts: 389 },
  { name: "Jackie Young", team: "LVA", twoPM: 98, threePM: 46, ftm: 53, pts: 387 },
  { name: "Caitlin Clark", team: "IND", twoPM: 77, threePM: 46, ftm: 89, pts: 381 },
  { name: "Kayla McBride", team: "MIN", twoPM: 71, threePM: 53, ftm: 71, pts: 372 },
  { name: "Aliyah Boston", team: "IND", twoPM: 106, threePM: 27, ftm: 71, pts: 364 },
  { name: "Courtney Williams", team: "MIN", twoPM: 125, threePM: 32, ftm: 18, pts: 364 },
  { name: "Jessica Shepard", team: "DAL", twoPM: 148, threePM: 0, ftm: 64, pts: 360 },
];

// Shooting-efficiency leaders (also real, from the same leaders page)
const SHOOTING_LEADERS = {
  fgPct: [
    { name: "NaLyssa Smith", team: "LVA", pct: 0.657 },
    { name: "Natasha Mack", team: "PHO", pct: 0.609 },
    { name: "Jessica Shepard", team: "DAL", pct: 0.602 },
    { name: "Chennedy Carter", team: "LVA", pct: 0.600 },
    { name: "Natasha Howard", team: "MIN", pct: 0.590 },
  ],
  threePct: [
    { name: "Monique Akoa Makani", team: "PHO", pct: 0.514 },
    { name: "Teja Oblak", team: "POR", pct: 0.500 },
    { name: "Aliyah Boston", team: "IND", pct: 0.458 },
    { name: "Isabelle Harrison", team: "TOR", pct: 0.452 },
    { name: "Sophie Cunningham", team: "IND", pct: 0.435 },
  ],
  ftPct: [
    { name: "Ariel Atkins", team: "LAS", pct: 0.962 },
    { name: "Chelsea Gray", team: "LVA", pct: 0.952 },
    { name: "Jackie Young", team: "LVA", pct: 0.946 },
    { name: "Sabrina Ionescu", team: "NYL", pct: 0.906 },
    { name: "Kayla McBride", team: "MIN", pct: 0.899 },
  ],
};

/**
 * PLAYMAKING STYLE — SAMPLE / ILLUSTRATIVE DATA, NOT MEASURED.
 *
 * True play-type assist splits (frequency and points-per-possession generated
 * off pick-and-roll, post-up, spot-up, and transition) come from Synergy
 * Sports or Second Spectrum tracking, which has no free public API. The
 * numbers below are placeholder proportions (they sum to 100) so the chart
 * renders — swap them for a real feed by replacing this array with the same
 * shape: { name, team, pnr, postUp, spotUp, transition } as percentages of
 * that player's assists. The `note` field for each player IS real, drawn
 * from publicly reported scouting/broadcast description of their game.
 */
const PLAYMAKING_STYLE_SAMPLE = [
  { name: "Alyssa Thomas", team: "PHO", pnr: 20, postUp: 15, spotUp: 10, transition: 55,
    note: "Point-forward known for pushing pace and delivering drive-and-dish or drop-off feeds in the open floor." },
  { name: "Chelsea Gray", team: "LVA", pnr: 45, postUp: 10, spotUp: 15, transition: 30,
    note: "Half-court pick-and-roll operator; known for pocket passes and mid-range pull-up gravity that opens driving lanes." },
  { name: "Jordin Canada", team: "ATL", pnr: 25, postUp: 5, spotUp: 15, transition: 55,
    note: "Speed-first guard who generates a large share of assists pushing off makes/misses into early offense." },
  { name: "Caitlin Clark", team: "IND", pnr: 50, postUp: 5, spotUp: 15, transition: 30,
    note: "Heavy pick-and-roll usage; her deep shooting gravity collapses defenses and creates kick-out three-point assists." },
  { name: "Paige Bueckers", team: "DAL", pnr: 40, postUp: 15, spotUp: 15, transition: 30,
    note: "Runs a mix of ball-screens and post-entry reads; comfortable throwing to bigs on the short roll." },
  { name: "Jessica Shepard", team: "DAL", pnr: 15, postUp: 35, spotUp: 30, transition: 20,
    note: "Facilitates from the elbow/short-roll as a passing-big rather than a traditional ball-handler." },
];

// Team abbreviation -> full name, for tooltips/labels
const TEAM_NAMES = {
  LVA: "Las Vegas Aces", IND: "Indiana Fever", DAL: "Dallas Wings", TOR: "Toronto Tempo",
  NYL: "New York Liberty", PHO: "Phoenix Mercury", ATL: "Atlanta Dream", SEA: "Seattle Storm",
  MIN: "Minnesota Lynx", CHI: "Chicago Sky", WAS: "Washington Mystics", LAS: "Los Angeles Sparks",
  CON: "Connecticut Sun", GSV: "Golden State Valkyries", POR: "Portland Fire",
};

/**
 * LEAGUE STANDINGS — real, from Basketball-Reference's 2026 WNBA Standings
 * page (https://www.basketball-reference.com/wnba/years/2026_standings.html),
 * as of July 13, 2026. Top 8 make the playoffs, seeded league-wide regardless
 * of conference.
 */
const STANDINGS = [
  { rank: 1, team: "MIN", w: 17, l: 6, pct: 0.739, gb: 0 },
  { rank: 2, team: "LVA", w: 17, l: 7, pct: 0.708, gb: 0.5 },
  { rank: 3, team: "GSV", w: 17, l: 7, pct: 0.708, gb: 0.5 },
  { rank: 4, team: "DAL", w: 16, l: 8, pct: 0.667, gb: 1.5 },
  { rank: 5, team: "IND", w: 14, l: 9, pct: 0.609, gb: 3.0 },
  { rank: 6, team: "ATL", w: 13, l: 10, pct: 0.565, gb: 4.0 },
  { rank: 7, team: "NYL", w: 13, l: 11, pct: 0.542, gb: 4.5 },
  { rank: 8, team: "WAS", w: 11, l: 10, pct: 0.524, gb: 5.0 },
  { rank: 9, team: "LAS", w: 10, l: 11, pct: 0.476, gb: 6.0 },
  { rank: 10, team: "POR", w: 10, l: 13, pct: 0.435, gb: 7.0 },
  { rank: 11, team: "TOR", w: 10, l: 13, pct: 0.435, gb: 7.0 },
  { rank: 12, team: "PHO", w: 8, l: 16, pct: 0.333, gb: 9.5 },
  { rank: 13, team: "CHI", w: 7, l: 16, pct: 0.304, gb: 10.0 },
  { rank: 14, team: "SEA", w: 6, l: 19, pct: 0.240, gb: 12.0 },
  { rank: 15, team: "CON", w: 5, l: 18, pct: 0.217, gb: 12.0 },
];

const PLAYOFF_CUTOFF_RANK = 8; // top 8 make the playoffs, per WNBA format

/**
 * TITLE CONTENDER TIERS — PREDICTION, not a stat. Reflects published
 * sportsbook championship odds and beat-writer expert picks as of
 * mid-July 2026 (around the All-Star break), aggregated from Sports
 * Illustrated Betting, ESPN, VegasInsider and CBS Sports. Odds move
 * constantly and differ slightly by sportsbook — treat these as a
 * snapshot, not a live feed.
 */
const TITLE_CONTENDERS = [
  { tier: 1, tierLabel: "Favorites", team: "MIN", odds: "+145",
    blurb: "Best record and net rating in the league even without Napheesa Collier, who's close to a return from ankle surgery. Rookie Olivia Miles has run the league's top-scoring offense as a Day 1 starter." },
  { tier: 1, tierLabel: "Favorites", team: "LVA", odds: "+370",
    blurb: "Defending champions with a championship-tested core in A'ja Wilson, Jackie Young and Chelsea Gray. Elite defense and shot-blocking; Wilson's health is the swing factor." },
  { tier: 2, tierLabel: "In the mix", team: "NYL", odds: "+450",
    blurb: "Loaded on paper with Stewart, Ionescu, Jones and Sabally, but injuries (Sabally's concussion) have kept the Liberty from finding a settled rotation." },
  { tier: 2, tierLabel: "In the mix", team: "GSV", odds: "+900",
    blurb: "Shortened all the way from 45-1 preseason. Elite defense and a deep bench, though the offense lags the other contenders." },
  { tier: 3, tierLabel: "Dark horses", team: "ATL", odds: "~13-1",
    blurb: "Strong defensive identity but thin bench scoring; would need its stars to carry a heavier postseason load." },
  { tier: 3, tierLabel: "Dark horses", team: "DAL", odds: "~20-1 to 25-1",
    blurb: "Worst record in the league in 2025, now a clear playoff team behind Paige Bueckers, Azzi Fudd and Jessica Shepard." },
  { tier: 4, tierLabel: "Long shots", team: "IND", odds: "~18-1",
    blurb: "Caitlin Clark's third-year leap keeps Indiana dangerous, but the roster's ceiling looks like a second-round upset, not a title." },
  { tier: 4, tierLabel: "Long shots", team: "WAS", odds: "—",
    blurb: "On the playoff bubble; a deep run would require its young core (Citron, Iriafen, Betts) to outperform experience." },
];

/**
 * AWARDS PREDICTIONS — PREDICTION, not a stat. Aggregated from ESPN's
 * awards tracker, CBS Sports' midseason staff picks, and BetMGM/FanDuel
 * award odds, all as of mid-July 2026. These are expert consensus and
 * betting-market snapshots, not final results — the season still has
 * roughly half its games left.
 */
const AWARDS_PREDICTIONS = {
  mvp: [
    { name: "A'ja Wilson", team: "LVA", odds: "-190 to -325", note: "Leads the league in scoring and blocks per game; GM survey favorite and the CBS Sports staff's unanimous midseason pick." },
    { name: "Paige Bueckers", team: "DAL", odds: "+550 to +700", note: "Primary challenger; shooting a scorching 52/39/85 split while leading Dallas's turnaround from worst record in the league." },
    { name: "Caitlin Clark", team: "IND", odds: "+750 to +1000", note: "Career-best scoring on a return-to-health season, but has slid in the odds as Indiana sits mid-pack in the standings." },
    { name: "Breanna Stewart", team: "NYL", odds: "long shot", note: "Still in the conversation on name recognition and two-way impact, though efficiency has dipped from her MVP peak." },
  ],
  roy: [
    { name: "Olivia Miles", team: "MIN", odds: "heavy favorite", note: "Unanimous pick among CBS Sports' midseason experts; leads all rookies in scoring and assists while anchoring the league's top defense as a Day 1 starter." },
    { name: "Azzi Fudd", team: "DAL", odds: "distant second", note: "No. 1 overall pick; second among rookies in scoring, shooting a highly efficient 48.5% from the field and 38.4% from three." },
  ],
  dpoy: [
    { name: "A'ja Wilson", team: "LVA", odds: "-145", note: "Chasing a fourth DPOY award; elite rim protection and defensive versatility for the league's best shot-blocking team." },
    { name: "Rhyne Howard", team: "ATL", odds: "+650", note: "Anchors a top-four defensive rating for Atlanta with disruptive point-of-attack pressure." },
    { name: "Gabby Williams", team: "GSV", odds: "+900", note: "Do-everything defender for the league's No. 2 defensive rating; guards multiple positions at an elite level." },
  ],
  note: "Odds and rankings are a snapshot from mid-July 2026 (around the All-Star break) and will keep moving over the second half of the season.",
};

/**
 * ROOKIE CLASS — real. 2026 WNBA Draft results (Basketball-Reference /
 * Yahoo Sports / NBC Sports draft trackers, April 13, 2026) plus
 * in-season performance notes from ESPN's rookie/awards coverage,
 * current as of mid-July 2026. Not every rookie has a widely reported
 * per-game line yet at this point in the season — where that's true,
 * the note below describes draft pedigree/college profile instead of
 * inventing a stat.
 */
/**
 * ROOKIE CLASS — real. 2026 WNBA Draft results (Basketball-Reference /
 * Yahoo Sports / NBC Sports draft trackers, April 13, 2026). Per-game
 * stats pulled directly from each player's ESPN player page
 * (espn.com/wnba/player/_/id/.../<name>), current as of July 15, 2026.
 */
const ROOKIE_CLASS = [
  { pick: 1, name: "Azzi Fudd", college: "UConn", team: "DAL",
    stats: "13.3 PPG, 1.7 RPG, 1.9 APG, 1.7 SPG, 46.1% FG, 37.3% 3PT",
    note: "Reunited with 2025 ROY Paige Bueckers; led the nation in made threes as a UConn senior." },
  { pick: 2, name: "Olivia Miles", college: "TCU", team: "MIN",
    stats: "18.7 PPG, 4.8 RPG, 5.7 APG",
    note: "Runaway Rookie of the Year favorite; Day 1 starter for the league's best record." },
  { pick: 3, name: "Awa Fam Thiam", college: "Spain (international)", team: "SEA",
    stats: "10.9 PPG, 5.4 RPG, 1.8 APG, 0.7 SPG, 49.1% FG, 37.8% 3PT",
    note: "International forward joining a Seattle team in a full rebuild; leads all rookies in rebounding." },
  { pick: 4, name: "Lauren Betts", college: "UCLA", team: "WAS",
    stats: "6.4 PPG, 3.6 RPG, 0.9 APG, 0.5 SPG",
    note: "Two-time All-American and Final Four Most Outstanding Player on UCLA's title team; coming off the bench behind Shakira Austin." },
  { pick: 5, name: "Gabriela Jaquez", college: "UCLA", team: "CHI",
    stats: "9.9 PPG, 4.6 RPG, 1.0 APG, 1.1 SPG",
    note: "Part of UCLA's record-setting six-player draft class." },
  { pick: 6, name: "Kiki Rice", college: "UCLA", team: "TOR",
    stats: "12.7 PPG, 4.7 RPG, 2.6 APG, 1.0 SPG",
    note: "Combo guard joining Toronto's first-ever roster as an expansion team; currently sidelined (Status: Out)." },
  { pick: 8, name: "Flau'jae Johnson", college: "LSU", team: "SEA",
    stats: "12.2 PPG, 5.5 RPG, 2.7 APG, 1.0 SPG",
    note: "Drafted by Golden State, immediately traded to Seattle on draft night; leads Seattle's rookie class in scoring." },
  { pick: 9, name: "Angela Dugalić", college: "UCLA", team: "WAS",
    stats: "3.9 PPG, 3.1 RPG, 0.8 APG, 0.5 SPG",
    note: "Joins UCLA teammate Lauren Betts in Washington; role has been limited behind Kiki Iriafen and Shakira Austin." },
  { pick: 10, name: "Raven Johnson", college: "South Carolina", team: "IND",
    stats: "4.3 PPG, 2.5 RPG, 1.7 APG, 0.4 SPG",
    note: "Defensive-minded lead guard added to Indiana's backcourt depth, reunited with former South Carolina teammate Aliyah Boston." },
  { pick: 11, name: "Cotie McMahon", college: "Ohio State", team: "WAS",
    stats: "6.1 PPG, 2.4 RPG, 1.6 APG, 0.5 SPG",
    note: "Washington's third first-round rookie, giving the Mystics the deepest rookie class in the league." },
];

/**
 * 2027 WNBA MOCK DRAFT — PREDICTION, and unusually far out: the actual
 * 2027 draft order won't be set until the 2026 season and lottery are
 * final, so this is a college big board, not team-by-team picks.
 * Aggregated from Tankathon's Big Board, CBS Sports and Bleacher
 * Report's "way-too-early" 2027 mock drafts, published April 2026.
 * Treat this as the furthest out and most speculative section on the site.
 */
const MOCK_DRAFT_2027 = [
  { rank: 1, name: "JuJu Watkins", college: "USC", pos: "SG",
    note: "Clear No. 1 in every published big board; two-way force with perennial-MVP upside, currently rehabbing a torn ACL." },
  { rank: 2, name: "Madison Booker", college: "Texas", pos: "SF",
    note: "One of the best mid-range scorers in the country; the swing skill for her draft stock is developing a higher-volume three-point shot." },
  { rank: 3, name: "Hannah Hidalgo", college: "Notre Dame", pos: "PG",
    note: "Regarded as the best on-ball defensive guard prospect in years, paired with elite scoring and playmaking." },
  { rank: 4, name: "MiLaysia Fulwiley", college: "South Carolina", pos: "G",
    note: "One-of-one athleticism and open-court creativity; streaky shooting and shot selection are the questions scouts flag." },
  { rank: 5, name: "S'Mya Nichols", college: "Kansas", pos: "G",
    note: "Rising guard prospect, though evaluators note she hasn't yet been tested against the toughest Big 12/Big Ten defenses." },
  { rank: 6, name: "Mikaylah Williams", college: "LSU", pos: "G",
    note: "Explosive scoring guard rounding into a full-fledged lottery prospect." },
  { rank: 7, name: "Audi Crooks", college: "Oklahoma State (transfer)", pos: "C",
    note: "Elite, high-volume post scorer; the translation question is her defense against WNBA-level athletes." },
  { rank: 8, name: "Chloe Kitts", college: "South Carolina", pos: "F",
    note: "Steady two-way role player projected as a long-tenured pro; has one year of eligibility left after an ACL injury." },
  { rank: 9, name: "Oluchi Okananwa", college: "Maryland", pos: "F",
    note: "Elite-motor transition player and versatile defender; jump shot is still a developing part of her game." },
  { rank: 10, name: "Tessa Johnson", college: "South Carolina", pos: "G",
    note: "Regarded as the best off-ball shooter in the country following Azzi Fudd and Gianna Kneepkens' departure from the college ranks." },
  { rank: 11, name: "Aïnhoa Risacher", college: "France (international)", pos: "F",
    note: "International forward on evaluators' radar alongside the top US college prospects." },
  { rank: 12, name: "Zhang Ziyu", college: "China (international)", pos: "C",
    note: "7-foot-3 center who would be the tallest player in WNBA history; eligible for 2027 but under no obligation to declare." },
];

/**
 * Approximate accent colors per team, used only for the visual identity of
 * avatar cards below — a stylistic stand-in, not sourced from official team
 * brand guidelines, so don't treat these as authoritative team colors.
 */
const TEAM_COLORS = {
  LVA: "#C8102E", IND: "#E03A3E", DAL: "#00B2A9", NYL: "#6ECEB2", ATL: "#E31837",
  MIN: "#236192", PHO: "#E56020", GSV: "#62166F", CHI: "#418FDE", WAS: "#132148",
  LAS: "#702F8A", CON: "#E2231A", SEA: "#2C5234", TOR: "#4B2E83", POR: "#EE3831",
};

/**
 * PLAYER PROFILES — real biographical facts (hometown, height, a verified
 * fun fact) plus a short playstyle summary, for a curated set of marquee
 * players spanning both positions. Sourced from team/college bio pages,
 * Wikipedia, and Basketball-Reference as of July 2026.
 *
 * NOTE ON PHOTOS: there are no real player photos here — those are
 * copyrighted (Getty/AP/WNBA-licensed) and can't legally be redistributed
 * in a static site's source code. Each card instead gets a generated
 * illustrated avatar (initials on a team-colored background). Swap in
 * licensed photos yourself if you have the rights to use them — the
 * `photoUrl` field is there to support that; it's just empty by default.
 */
const PLAYER_PROFILES = [
  { name: "A'ja Wilson", team: "LVA", position: "Forward", posDetail: "Power Forward / Center",
    hometown: "Hopkins, South Carolina", height: "6'4\"", college: "South Carolina",
    funFact: "Has her own Nike signature shoe, the A'One.",
    playstyle: "A dominant two-way force in the post — elite scoring on the block and mid-range, paired with elite shot-blocking and defensive versatility.",
    photoUrl: "" },
  { name: "Paige Bueckers", team: "DAL", position: "Guard", posDetail: "Point Guard / Shooting Guard",
    hometown: "Hopkins, Minnesota", height: "5'11\"", college: "UConn",
    funFact: "2025 Rookie of the Year and a two-time All Star in as many seasons!",
    playstyle: "Efficient, multi-level scorer who runs the offense with poise — comfortable pulling up from mid-range, driving, or setting up teammates.",
    photoUrl: "" },
  { name: "Kelsey Mitchell", team: "IND", position: "Guard", posDetail: "Shooting Guard",
    hometown: "Cincinnati, Ohio", height: "5'8\"", college: "Ohio State",
    funFact: "Ohio State's all-time leading scorer, men's or women's program.",
    playstyle: "Instant-offense shooting guard with a quick release; scores in bunches off screens and in transition.",
    photoUrl: "" },
  { name: "Breanna Stewart", team: "NYL", position: "Forward", posDetail: "Power Forward",
    hometown: "Syracuse, New York", height: "6'4\"", college: "UConn",
    funFact: "Won four straight NCAA titles at UConn (2013–2016) — the only player ever to do that!",
    playstyle: "Versatile stretch forward who scores at all three levels, rebounds at a high rate, and anchors the defense as a rim protector.",
    photoUrl: "" },
  { name: "Caitlin Clark", team: "IND", position: "Guard", posDetail: "Point Guard",
    hometown: "West Des Moines, Iowa", height: "6'0\"", college: "Iowa",
    funFact: "NCAA's all-time leading scorer across men's and women's basketball.",
    playstyle: "Full-court range shooter and creative passer; her deep three-point gravity opens driving and kick-out lanes for teammates.",
    photoUrl: "" },
  { name: "Olivia Miles", team: "MIN", position: "Guard", posDetail: "Point Guard",
    hometown: "Phillipsburg, New Jersey", height: "5'10\"", college: "Notre Dame, TCU",
    funFact: "Launched her own eyewear collection with GlassesUSA in 2026.",
    playstyle: "Pass-first floor general with elite court vision; pushes tempo and finds cutters and shooters in the flow of the offense.",
    photoUrl: "" },
  { name: "Angel Reese", team: "ATL", position: "Forward", posDetail: "Power Forward",
    hometown: "Randallstown, Maryland", height: "6'3\"", college: "Maryland, LSU",
    funFact: "Only player in WNBA history to average 12+ rebounds a game in a season — she's done it twice!",
    playstyle: "Relentless offensive rebounder who scores off putbacks and second chances; mobile enough to guard multiple positions.",
    photoUrl: "" },
  { name: "Chelsea Gray", team: "LVA", position: "Guard", posDetail: "Point Guard",
    hometown: "Manteca, California", height: "5'11\"", college: "Duke",
    funFact: "Nicknamed \"Point Gawd\" around the league for her playmaking.",
    playstyle: "Crafty half-court operator who runs the pick-and-roll with pinpoint pocket passes and a reliable mid-range floater.",
    photoUrl: "" },
  { name: "Alyssa Thomas", team: "PHO", position: "Forward", posDetail: "Power Forward",
    hometown: "Harrisburg, Pennsylvania", height: "6'2\"", college: "Maryland",
    funFact: "The only player in WNBA history with multiple regular-season triple-doubles.",
    playstyle: "Point-forward who pushes pace and facilitates from the frontcourt — a rare big who leads her team in assists.",
    photoUrl: "" },
  { name: "Jordin Canada", team: "ATL", position: "Guard", posDetail: "Point Guard",
    hometown: "Los Angeles, California", height: "5'6\"", college: "UCLA",
    funFact: "One of the shortest players in WNBA history, and one of its most tenacious on-ball defenders.",
    playstyle: "Speed-first guard who lives in transition, pressures the ball full-court, and creates easy offense pushing the pace.",
    photoUrl: "" },
  { name: "Jessica Shepard", team: "DAL", position: "Forward", posDetail: "Power Forward / Center",
    hometown: "Nebraska City, Nebraska", height: "6'4\"", college: "Notre Dame",
    playstyle: "High-post passing hub who facilitates from the elbow and short roll as much as she scores — a rare distributing big.",
    funFact: "Currently the league's Win Shares leader for the 2026 season.",
    photoUrl: "" },
  { name: "Azzi Fudd", team: "DAL", position: "Guard", posDetail: "Shooting Guard",
    hometown: "Arlington, Virginia", height: "5'11\"", college: "UConn",
    funFact: "Led the nation in made three-pointers as a UConn senior in 2025.",
    playstyle: "Elite off-ball shooter who scores in catch-and-shoot and movement situations; the No. 1 overall pick in the 2026 draft.",
    photoUrl: "" },
];

/**
 * HALF-COURT POSITIONS — a beginner-level teaching diagram of where the
 * five traditional basketball positions line up in a half-court offensive
 * set. This is general basketball instruction, not a real tracked heat map
 * of any specific player — labeled as such in the UI.
 */
/*
const COURT_POSITIONS = [
  { num: 1, label: "Point Guard (PG)", x: 250, y: 330,
    desc: "Brings the ball up and runs the offense from the top of the key; usually the best passer and ball-handler on the floor." },
  { num: 2, label: "Shooting Guard (SG)", x: 410, y: 220,
    desc: "Spaces the floor on the wing, ready to catch and shoot from three or attack a closeout." },
  { num: 3, label: "Small Forward (SF)", x: 90, y: 220,
    desc: "Works the opposite wing; a versatile scorer who can shoot, drive, or post up smaller defenders." },
  { num: 4, label: "Power Forward (PF)", x: 370, y: 120,
    desc: "Operates from the elbow or short corner — a mix of face-up jumpers, offensive rebounding, and screening." },
  { num: 5, label: "Center (C)", x: 250, y: 70,
    desc: "Anchors the low post near the basket for rebounding, rim-running, and interior scoring." },
];
*/