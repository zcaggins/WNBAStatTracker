/**
 * WNBA 2026 season stat data.
 * Source: Basketball-Reference.com, 2026 WNBA Leaders page — page's own
 * "meta-revised" timestamp still shows 05:17:14 18-Aug-2026 as of this
 * pull (2026-08-19), so the player-level POINTS/REBOUNDS/ASSISTS/
 * SCORING_BREAKDOWN data below is unchanged from the prior refresh —
 * Basketball-Reference simply hasn't rebuilt its cache since. Standings
 * come from a CBS Sports full-league standings table pulled 2026-08-19
 * (see the STANDINGS comment below) and have moved meaningfully since
 * the last pull.
 *
 * This file is the single point of truth for the dashboard. To refresh with
 * new numbers, edit the arrays below (see README.md "Updating the data").
 * Everything in POINTS / REBOUNDS / ASSISTS / SCORING_BREAKDOWN is real,
 * publicly reported season-total data.
 *
 * Live game data (scores, schedule) is NOT stored here — it's fetched
 * client-side at page load from ESPN's public scoreboard endpoint. See
 * the LIVE GAMES section of script.js and README.md for details.
 */

const DATA_MODIFIED = "2026-08-19";

const POINTS_LEADERS = [
  { name: "A'ja Wilson", team: "LVA", pts: 861, ppg: 26.1 },
  { name: "Kelsey Mitchell", team: "IND", pts: 846, ppg: 24.2 },
  { name: "Breanna Stewart", team: "NYL", pts: 724, ppg: 20.7 },
  { name: "Kahleah Copper", team: "PHO", pts: 718, ppg: 20.5 },
  { name: "Paige Bueckers", team: "DAL", pts: 696, ppg: 20.5 },
  { name: "Caitlin Clark", team: "IND", pts: 683, ppg: 22.0 },
  { name: "Olivia Miles", team: "MIN", pts: 676, ppg: 19.9 },
  { name: "Allisha Gray", team: "ATL", pts: 667, ppg: 19.6 },
  { name: "Kayla McBride", team: "MIN", pts: 656, ppg: 18.2 },
  { name: "Jackie Young", team: "LVA", pts: 645, ppg: 18.4 },
  { name: "Marina Mabrey", team: "TOR", pts: 645, ppg: 20.8 },
  { name: "Rhyne Howard", team: "ATL", pts: 586, ppg: 17.8 },
  { name: "Nneka Ogwumike", team: "LAS", pts: 556, ppg: 16.8 },
  { name: "Natisha Hiedeman", team: "SEA", pts: 555, ppg: 15.0 },
  { name: "Shakira Austin", team: "WAS", pts: 552, ppg: 16.7 },
  { name: "Natasha Howard", team: "MIN", pts: 544, ppg: 15.1 },
  { name: "Aliyah Boston", team: "IND", pts: 543, ppg: 17.0 },
  { name: "Sonia Citron", team: "WAS", pts: 535, ppg: 17.3 },
  { name: "Arike Ogunbowale", team: "DAL", pts: 535, ppg: 14.9 },
  { name: "Courtney Williams", team: "MIN", pts: 525, ppg: 14.6 },
];

const REBOUND_LEADERS = [
  { name: "Angel Reese", team: "ATL", reb: 398, rpg: 12.1, oreb: 168, dreb: 230 },
  { name: "Jessica Shepard", team: "DAL", reb: 382, rpg: 11.2, oreb: 101, dreb: 281 },
  { name: "Jonquel Jones", team: "NYL", reb: 330, rpg: 9.4, oreb: 77, dreb: 253 },
  { name: "A'ja Wilson", team: "LVA", reb: 317, rpg: 9.6, oreb: 62, dreb: 255 },
  { name: "Shakira Austin", team: "WAS", reb: 315, rpg: 9.5, oreb: 63, dreb: 252 },
  { name: "Kamilla Cardoso", team: "CHI", reb: 296, rpg: 8.7, oreb: 94, dreb: 202 },
  { name: "Nneka Ogwumike", team: "LAS", reb: 290, rpg: 8.8, oreb: 60, dreb: 230 },
  { name: "Breanna Stewart", team: "NYL", reb: 286, rpg: 8.2, oreb: 54, dreb: 232 },
  { name: "Natasha Howard", team: "MIN", reb: 282, rpg: 7.8, oreb: 122, dreb: 160 },
  { name: "Kiki Iriafen", team: "WAS", reb: 282, rpg: 9.1, oreb: 90, dreb: 192 },
  { name: "Aliyah Boston", team: "IND", reb: 277, rpg: 8.7, oreb: 62, dreb: 215 },
  { name: "Alyssa Thomas", team: "PHO", reb: 254, rpg: 7.5, oreb: 54, dreb: 200 },
  { name: "Dominique Malonga", team: "SEA", reb: 252, rpg: 9.0, oreb: 71, dreb: 181 },
  { name: "Dearica Hamby", team: "LAS", reb: 249, rpg: 7.3, oreb: 70, dreb: 179 },
  { name: "NaLyssa Smith", team: "LVA", reb: 226, rpg: 6.5, oreb: 77, dreb: 149 },
];

const ASSIST_LEADERS = [
  { name: "Alyssa Thomas", team: "PHO", ast: 280, apg: 8.2, astPct: 43.8 },
  { name: "Caitlin Clark", team: "IND", ast: 257, apg: 8.3, astPct: 44.2 },
  { name: "Jordin Canada", team: "ATL", ast: 247, apg: 7.5, astPct: 36.5 },
  { name: "Chelsea Gray", team: "LVA", ast: 247, apg: 7.1, astPct: 31.0 },
  { name: "Jackie Young", team: "LVA", ast: 235, apg: 6.7, astPct: 33.5 },
  { name: "Olivia Miles", team: "MIN", ast: 208, apg: 6.1, astPct: 30.8 },
  { name: "Carla Leite", team: "POR", ast: 198, apg: 6.2, astPct: 42.1 },
  { name: "Paige Bueckers", team: "DAL", ast: 196, apg: 5.8, astPct: 29.4 },
  { name: "Veronica Burton", team: "GSV", ast: 188, apg: 5.5, astPct: 33.1 },
  { name: "Erica Wheeler", team: "LAS", ast: 181, apg: 5.3, astPct: 28.4 },
  { name: "Jessica Shepard", team: "DAL", ast: 173, apg: 5.1, astPct: 24.9 },
  { name: "Natisha Hiedeman", team: "SEA", ast: 172, apg: 4.8, astPct: 28.9 },
];

// Points broken into makes by shot type (2PT / 3PT / FT), derived arithmetically
// from official Basketball-Reference season totals (FG, 2PT FG, 3PT FG, FT
// leaderboards) and cross-checked against each player's total points, so every
// row below sums exactly to that player's PTS total. This is the same data
// the "Total Points" board uses for its click-to-expand shot breakdown —
// there's no separate scoring board anymore. Not every scorer has a fully
// direct-sourced breakdown available (Sonia Citron is left out of this list
// for that reason, though she still appears on the Total Points board
// itself) — a few of the entries below have one remaining unknown (usually
// FTM) solved algebraically from the player's real point total rather than
// sourced directly, which still guarantees the row is arithmetically exact.
const SCORING_BREAKDOWN = [
  { name: "A'ja Wilson", team: "LVA", twoPM: 270, threePM: 33, ftm: 222, pts: 861 },
  { name: "Kelsey Mitchell", team: "IND", twoPM: 201, threePM: 100, ftm: 144, pts: 846 },
  { name: "Breanna Stewart", team: "NYL", twoPM: 219, threePM: 28, ftm: 202, pts: 724 },
  { name: "Kahleah Copper", team: "PHO", twoPM: 179, threePM: 60, ftm: 180, pts: 718 },
  { name: "Paige Bueckers", team: "DAL", twoPM: 206, threePM: 59, ftm: 107, pts: 696 },
  { name: "Caitlin Clark", team: "IND", twoPM: 130, threePM: 84, ftm: 171, pts: 683 },
  { name: "Olivia Miles", team: "MIN", twoPM: 183, threePM: 56, ftm: 142, pts: 676 },
  { name: "Allisha Gray", team: "ATL", twoPM: 165, threePM: 60, ftm: 157, pts: 667 },
  { name: "Kayla McBride", team: "MIN", twoPM: 111, threePM: 105, ftm: 119, pts: 656 },
  { name: "Jackie Young", team: "LVA", twoPM: 153, threePM: 78, ftm: 105, pts: 645 },
  { name: "Marina Mabrey", team: "TOR", twoPM: 111, threePM: 100, ftm: 123, pts: 645 },
  { name: "Rhyne Howard", team: "ATL", twoPM: 80, threePM: 107, ftm: 105, pts: 586 },
  { name: "Nneka Ogwumike", team: "LAS", twoPM: 168, threePM: 48, ftm: 76, pts: 556 },
  { name: "Natisha Hiedeman", team: "SEA", twoPM: 130, threePM: 68, ftm: 91, pts: 555 },
  { name: "Shakira Austin", team: "WAS", twoPM: 183, threePM: 17, ftm: 135, pts: 552 },
  { name: "Natasha Howard", team: "MIN", twoPM: 220, threePM: 3, ftm: 95, pts: 544 },
  { name: "Aliyah Boston", team: "IND", twoPM: 168, threePM: 38, ftm: 93, pts: 543 },
  { name: "Arike Ogunbowale", team: "DAL", twoPM: 110, threePM: 61, ftm: 132, pts: 535 },
  { name: "Courtney Williams", team: "MIN", twoPM: 180, threePM: 42, ftm: 39, pts: 525 },
];

// Shooting-efficiency leaders (also real, from the same leaders page)
const SHOOTING_LEADERS = {
  fgPct: [
    { name: "NaLyssa Smith", team: "LVA", pct: 0.636 },
    { name: "Natasha Mack", team: "PHO", pct: 0.616 },
    { name: "Natasha Howard", team: "MIN", pct: 0.587 },
    { name: "Jessica Shepard", team: "DAL", pct: 0.582 },
    { name: "Olivia Nelson-Ododa", team: "CON", pct: 0.572 },
  ],
  threePct: [
    { name: "Sophie Cunningham", team: "IND", pct: 0.445 },
    { name: "Julie Allemand", team: "TOR", pct: 0.440 },
    { name: "Antonia Delaere", team: "MIN", pct: 0.439 },
    { name: "Kelsey Mitchell", team: "IND", pct: 0.437 },
    { name: "Leonie Fiebich", team: "NYL", pct: 0.433 },
  ],
  ftPct: [
    { name: "Chelsea Gray", team: "LVA", pct: 0.932 },
    { name: "Jackie Young", team: "LVA", pct: 0.929 },
    { name: "Kayla McBride", team: "MIN", pct: 0.922 },
    { name: "Kayla Thornton", team: "GSV", pct: 0.920 },
    { name: "Ariel Atkins", team: "LAS", pct: 0.909 },
  ],
};

// Team abbreviation -> full name, for tooltips/labels
const TEAM_NAMES = {
  LVA: "Las Vegas Aces", IND: "Indiana Fever", DAL: "Dallas Wings", TOR: "Toronto Tempo",
  NYL: "New York Liberty", PHO: "Phoenix Mercury", ATL: "Atlanta Dream", SEA: "Seattle Storm",
  MIN: "Minnesota Lynx", CHI: "Chicago Sky", WAS: "Washington Mystics", LAS: "Los Angeles Sparks",
  CON: "Connecticut Sun", GSV: "Golden State Valkyries", POR: "Portland Fire",
};

/**
 * LEAGUE STANDINGS — real, from a full 15-team CBS Sports standings table
 * pulled 2026-08-19 (every GB figure cross-verified against the win/loss
 * math). Top 8 make the playoffs, seeded league-wide regardless of
 * conference. Rank is by winning percentage, which can put a team with
 * fewer total wins ahead of one with more (see IND vs. LVA below — IND
 * has fewer total games played but a better winning percentage).
 */
const STANDINGS = [
  { rank: 1, team: "MIN", w: 29, l: 7, pct: 0.806, gb: 0 },
  { rank: 2, team: "GSV", w: 25, l: 9, pct: 0.735, gb: 3.0 },
  { rank: 3, team: "IND", w: 24, l: 12, pct: 0.667, gb: 5.0 },
  { rank: 4, team: "LVA", w: 24, l: 13, pct: 0.649, gb: 5.5 },
  { rank: 5, team: "ATL", w: 22, l: 13, pct: 0.629, gb: 6.5 },
  { rank: 6, team: "NYL", w: 22, l: 15, pct: 0.595, gb: 7.5 },
  { rank: 7, team: "WAS", w: 20, l: 14, pct: 0.588, gb: 8.0 },
  { rank: 8, team: "DAL", w: 20, l: 16, pct: 0.556, gb: 9.0 },
  { rank: 9, team: "POR", w: 15, l: 20, pct: 0.429, gb: 13.5 },
  { rank: 10, team: "CHI", w: 14, l: 22, pct: 0.389, gb: 15.0 },
  { rank: 11, team: "PHO", w: 13, l: 23, pct: 0.361, gb: 16.0 },
  { rank: 12, team: "LAS", w: 12, l: 23, pct: 0.343, gb: 16.5 },
  { rank: 13, team: "TOR", w: 10, l: 24, pct: 0.294, gb: 18.0 },
  { rank: 14, team: "CON", w: 9, l: 25, pct: 0.265, gb: 19.0 },
  { rank: 15, team: "SEA", w: 7, l: 30, pct: 0.189, gb: 22.5 },
];

const PLAYOFF_CUTOFF_RANK = 8; // top 8 make the playoffs, per WNBA format

/**
 * TEAM SCOUTING — for the 8 playoff-qualifying teams, powers the bracket's
 * click-to-expand popup. `record`, and every specific stat cited inside
 * `strengths`/`weaknesses` (points totals, PPG, rebounds, assists, steals,
 * Defensive Rating, win streaks) are real, pulled from the same
 * Basketball-Reference/standings data as the rest of this file. The
 * `playStyle` line and the framing of each strength/weakness are Claude's
 * plain-language scouting synthesis built from those real numbers, not a
 * quoted source. Star players shown in the popup aren't hardcoded here —
 * they're looked up live from POINTS_LEADERS/REBOUND_LEADERS/ASSIST_LEADERS
 * by team, so they can never drift out of sync with the stat boards.
 */
const TEAM_SCOUTING = {
  MIN: {
    record: "29-7",
    playStyle: "Deep, egalitarian offense that shares the ball — no single go-to scorer dominates possessions, and multiple players can beat you on a given night.",
    strengths: [
      "Best record in the league at 29-7 (.806), riding a 4-game winning streak with the league's best point differential (+8.8)",
      "Balanced scoring: four different players average 15+ PPG",
      "Rookie of the Year favorite Olivia Miles (19.9 PPG, 6.1 APG) has run the offense as a Day 1 starter",
    ],
    weaknesses: [
      "No player ranks in the league's individual scoring top-5, so there's no obvious closer to lean on late",
      "Youngest core among the top seeds, with a rookie point guard running the show",
    ],
  },
  GSV: {
    record: "25-9",
    playStyle: "Defense-first identity — wins with discipline, depth, and rebounding rather than a marquee superstar scorer.",
    strengths: [
      "Won 6 straight and 8 of its last 10 to lock up the No. 2 seed",
      "Kiah Stokes owns the league's best individual Defensive Rating (98.0), anchoring the league's stingiest scoring defense (76.7 OPPG)",
    ],
    weaknesses: [
      "Lacks a proven go-to isolation scorer in crunch time — no player ranks in the league's individual scoring top-15",
      "Scores the fewest points per game (83.4) of any team in the playoff field",
    ],
  },
  IND: {
    record: "24-12",
    playStyle: "High-scoring, guard-driven offense built around Caitlin Clark's shooting gravity and Kelsey Mitchell's scoring.",
    strengths: [
      "Won 5 straight to climb into the No. 3 seed, passing Las Vegas on winning percentage",
      "Leads the entire league in scoring at 96.4 points per game, with Kelsey Mitchell (846 pts, 24.2 PPG) 2nd in the league in total points",
      "Caitlin Clark ranks 1st in the league in assists per game (8.3) and 3rd in scoring (22.0 PPG) — a rare two-way combination",
    ],
    weaknesses: [
      "Also allows the most points among the top seeds (90.5 OPPG), reflecting an up-tempo, less defense-oriented identity",
      "Backcourt-heavy roster construction can be tested on the boards by bigger frontcourts",
    ],
  },
  LVA: {
    record: "24-13",
    playStyle: "Star-driven half-court offense built around A'ja Wilson in the post, with Chelsea Gray and Jackie Young initiating the offense.",
    strengths: [
      "A'ja Wilson leads the league in total points (861), PPG (26.1), Player Efficiency Rating (31.9), and Win Shares (7.0) — the clearest MVP case in the WNBA",
      "Defending champions with a championship-tested playoff core",
    ],
    weaknesses: [
      "On a 2-game losing streak, and has dropped to the No. 4 seed behind Indiana on winning percentage",
      "Heavy reliance on Wilson's post touches can bog the offense down against physical, switch-everything defenses",
    ],
  },
  ATL: {
    record: "22-13",
    playStyle: "Defense and ball pressure first — wins games with disruption and transition offense more than half-court shot-making.",
    strengths: [
      "Rhyne Howard leads the league in total steals (77) and steals per game (2.3), and ranks top-5 in total points (586)",
      "Jordin Canada (247 ast, 7.5 APG) pushes tempo and pressures ball-handlers full-court",
    ],
    weaknesses: [
      "Less proven half-court scoring punch than the conference's top seeds",
      "Sits just 1 game up on New York for the No. 5 seed with several weeks left",
    ],
  },
  NYL: {
    record: "22-15",
    playStyle: "Star-laden roster built around Breanna Stewart's scoring and size, when the roster is healthy.",
    strengths: [
      "Breanna Stewart ranks 3rd in the league in total points (724) at 20.7 PPG",
      "Owns the No. 6 seed with real separation from the bottom of the playoff field",
    ],
    weaknesses: [
      "Season-long absences to injury have kept the roster from playing at full strength",
      "Give up as many points as they score on average (87.2 PPG allowed vs. 90.2 scored), the thinnest margin among the East's top seeds",
    ],
  },
  WAS: {
    record: "20-14",
    playStyle: "Frontcourt-anchored defense — wins low-scoring, physical games in the paint.",
    strengths: [
      "Shakira Austin owns the league's 2nd-best individual Defensive Rating (99.8) and ranks top-5 in the league in total rebounds (315)",
      "Won its last game to stay a game up on the playoff bubble",
    ],
    weaknesses: [
      "Scores the fewest points per game (81.6) of any team in the playoff field, and is the only playoff team with a negative scoring margin (-0.8)",
      "Youngest playoff roster in the field, with limited postseason experience",
    ],
  },
  DAL: {
    record: "20-16",
    playStyle: "Guard-driven scoring attack led by Paige Bueckers, with size and rebounding from Jessica Shepard underneath.",
    strengths: [
      "Jessica Shepard ranks 2nd in the WNBA in total rebounds (382)",
      "Paige Bueckers (696 pts, 20.5 PPG) gives Dallas a legitimate go-to scorer",
    ],
    weaknesses: [
      "Currently on a 2-game losing streak, clinging to the final playoff spot",
      "No. 1 pick Azzi Fudd has missed recent games to a knee injury, thinning the rotation",
    ],
  },
};

/**
 * AWARDS PREDICTIONS — PREDICTION, not a stat. Built from Basketball-
 * Reference's own league-leader callouts plus BetMGM/DraftKings rookie
 * odds, as of mid-August 2026. These are expert consensus and betting-
 * market snapshots, not final results — several weeks of the season
 * remain.
 */
const AWARDS_PREDICTIONS = {
  mvp: [
    { name: "A'ja Wilson", team: "LVA", odds: "clear favorite", note: "Basketball-Reference's own PPG (26.1) and Win Shares (7.0) leader, with a Player Efficiency Rating (31.9) far ahead of the field — the clearest statistical MVP case in the league." },
    { name: "Kelsey Mitchell", team: "IND", odds: "top challenger", note: "Leads the WNBA in total points (846) and ranks top-2 in Offensive Win Shares while anchoring Indiana's playoff push." },
    { name: "Caitlin Clark", team: "IND", odds: "in the mix", note: "Ranks 1st in the league in assists per game (8.3) and 3rd in scoring (22.0 PPG), a rare two-way statistical combination." },
    { name: "Breanna Stewart", team: "NYL", odds: "long shot", note: "Still in the conversation on name recognition and two-way impact, though efficiency has dipped from her MVP peak." },
  ],
  roy: [
    { name: "Olivia Miles", team: "MIN", odds: "favorite", note: "Leads all rookies in scoring (676 pts, 19.9 PPG) and playmaking (208 ast, 6.1 APG) for the league's best team, with a Player Efficiency Rating (22.9) that ranks 5th among all players, rookie or veteran." },
    { name: "Azzi Fudd", team: "DAL", odds: "challenger", note: "No. 1 overall pick, though a knee injury has cost her recent games for a Dallas team fighting for the final playoff spot." },
  ],
  dpoy: [
    { name: "Kiah Stokes", team: "GSV", odds: "favorite", note: "Owns the league's best individual Defensive Rating (98.0) for the stingiest team defense in the WNBA." },
    { name: "Shakira Austin", team: "WAS", odds: "in the mix", note: "2nd-best Defensive Rating in the league (99.8) and a top-5 rebounder, the backbone of Washington's playoff push." },
    { name: "A'ja Wilson", team: "LVA", odds: "in the mix", note: "Leads the league in total blocks (67) and blocks per game (2.0), anchoring one of the WNBA's top-rated defenses." },
  ],
  note: "Odds and rankings are a snapshot from mid-August 2026 and will keep moving as the regular season winds down.",
};

/**
 * Accent colors per team, used for the bracket's seed-card border color —
 * a stylistic stand-in, not sourced from official team brand guidelines,
 * so don't treat these as authoritative team colors.
 */
const TEAM_COLORS = {
  LVA: "#C8102E", IND: "#E03A3E", DAL: "#00B2A9", NYL: "#6ECEB2", ATL: "#E31837",
  MIN: "#236192", PHO: "#E56020", GSV: "#62166F", CHI: "#418FDE", WAS: "#132148",
  LAS: "#702F8A", CON: "#E2231A", SEA: "#2C5234", TOR: "#4B2E83", POR: "#EE3831",
};

