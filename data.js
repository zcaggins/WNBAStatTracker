/**
 * WNBA 2026 season stat data.
 * Source: Basketball-Reference.com, 2026 WNBA Leaders page — page's own
 * "meta-revised" timestamp shows 05:18:09 20-Aug-2026, the most current
 * the site had published as of this pull (2026-08-21). Standings come
 * from a CBS Sports full-league standings table pulled the same day
 * (see the STANDINGS comment below).
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

const DATA_MODIFIED = "2026-08-21";

const POINTS_LEADERS = [
  { name: "A'ja Wilson", team: "LVA", pts: 888, ppg: 26.1 },
  { name: "Kelsey Mitchell", team: "IND", pts: 875, ppg: 24.3 },
  { name: "Breanna Stewart", team: "NYL", pts: 746, ppg: 20.7 },
  { name: "Kahleah Copper", team: "PHO", pts: 718, ppg: 20.5 },
  { name: "Caitlin Clark", team: "IND", pts: 707, ppg: 22.1 },
  { name: "Paige Bueckers", team: "DAL", pts: 696, ppg: 20.5 },
  { name: "Olivia Miles", team: "MIN", pts: 696, ppg: 19.9 },
  { name: "Allisha Gray", team: "ATL", pts: 688, ppg: 19.7 },
  { name: "Kayla McBride", team: "MIN", pts: 676, ppg: 18.3 },
  { name: "Jackie Young", team: "LVA", pts: 669, ppg: 18.6 },
  { name: "Marina Mabrey", team: "TOR", pts: 667, ppg: 20.8 },
  { name: "Rhyne Howard", team: "ATL", pts: 609, ppg: 17.9 },
  { name: "Nneka Ogwumike", team: "LAS", pts: 574, ppg: 16.9 },
  { name: "Shakira Austin", team: "WAS", pts: 563, ppg: 16.6 },
  { name: "Aliyah Boston", team: "IND", pts: 559, ppg: 16.9 },
  { name: "Natisha Hiedeman", team: "SEA", pts: 555, ppg: 15.0 },
  { name: "Natasha Howard", team: "MIN", pts: 552, ppg: 14.9 },
  { name: "Sonia Citron", team: "WAS", pts: 548, ppg: 17.1 },
  { name: "Arike Ogunbowale", team: "DAL", pts: 535, ppg: 14.5 },
  { name: "Angel Reese", team: "ATL", pts: 535, ppg: 15.7 },
];

const REBOUND_LEADERS = [
  { name: "Angel Reese", team: "ATL", reb: 408, rpg: 12.0, oreb: 171, dreb: 237 },
  { name: "Jessica Shepard", team: "DAL", reb: 382, rpg: 11.2, oreb: 101, dreb: 281 },
  { name: "A'ja Wilson", team: "LVA", reb: 331, rpg: 9.7, oreb: 64, dreb: 267 },
  { name: "Jonquel Jones", team: "NYL", reb: 330, rpg: 9.2, oreb: 77, dreb: 253 },
  { name: "Shakira Austin", team: "WAS", reb: 326, rpg: 9.6, oreb: 67, dreb: 259 },
  { name: "Kamilla Cardoso", team: "CHI", reb: 308, rpg: 8.8, oreb: 100, dreb: 208 },
  { name: "Nneka Ogwumike", team: "LAS", reb: 297, rpg: 8.7, oreb: 60, dreb: 237 },
  { name: "Kiki Iriafen", team: "WAS", reb: 294, rpg: 9.2, oreb: 93, dreb: 201 },
  { name: "Breanna Stewart", team: "NYL", reb: 293, rpg: 8.1, oreb: 56, dreb: 237 },
  { name: "Natasha Howard", team: "MIN", reb: 288, rpg: 7.8, oreb: 125, dreb: 163 },
  { name: "Aliyah Boston", team: "IND", reb: 283, rpg: 8.6, oreb: 63, dreb: 220 },
  { name: "Dearica Hamby", team: "LAS", reb: 254, rpg: 7.3, oreb: 72, dreb: 182 },
  { name: "Alyssa Thomas", team: "PHO", reb: 254, rpg: 7.5, oreb: 54, dreb: 200 },
  { name: "Dominique Malonga", team: "SEA", reb: 252, rpg: 9.0, oreb: 71, dreb: 181 },
  { name: "NaLyssa Smith", team: "LVA", reb: 232, rpg: 6.4, oreb: 79, dreb: 153 },
];

const ASSIST_LEADERS = [
  { name: "Alyssa Thomas", team: "PHO", ast: 280, apg: 8.2, astPct: 43.8 },
  { name: "Caitlin Clark", team: "IND", ast: 264, apg: 8.2, astPct: 43.7 },
  { name: "Jordin Canada", team: "ATL", ast: 252, apg: 7.4, astPct: 36.3 },
  { name: "Chelsea Gray", team: "LVA", ast: 249, apg: 6.9, astPct: 30.6 },
  { name: "Jackie Young", team: "LVA", ast: 240, apg: 6.7, astPct: 33.5 },
  { name: "Olivia Miles", team: "MIN", ast: 215, apg: 6.1, astPct: 31.3 },
  { name: "Carla Leite", team: "POR", ast: 198, apg: 6.2, astPct: 42.1 },
  { name: "Paige Bueckers", team: "DAL", ast: 196, apg: 5.8, astPct: 29.4 },
  { name: "Veronica Burton", team: "GSV", ast: 195, apg: 5.6, astPct: 33.2 },
  { name: "Erica Wheeler", team: "LAS", ast: 181, apg: 5.3, astPct: 28.5 },
  { name: "Natasha Cloud", team: "CHI", ast: 175, apg: 5.0, astPct: 27.0 },
  { name: "Jessica Shepard", team: "DAL", ast: 173, apg: 5.1, astPct: 24.9 },
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
  { name: "A'ja Wilson", team: "LVA", twoPM: 276, threePM: 34, ftm: 234, pts: 888 },
  { name: "Kelsey Mitchell", team: "IND", twoPM: 208, threePM: 104, ftm: 147, pts: 875 },
  { name: "Breanna Stewart", team: "NYL", twoPM: 226, threePM: 29, ftm: 207, pts: 746 },
  { name: "Kahleah Copper", team: "PHO", twoPM: 179, threePM: 60, ftm: 180, pts: 718 },
  { name: "Caitlin Clark", team: "IND", twoPM: 133, threePM: 88, ftm: 177, pts: 707 },
  { name: "Paige Bueckers", team: "DAL", twoPM: 206, threePM: 59, ftm: 107, pts: 696 },
  { name: "Olivia Miles", team: "MIN", twoPM: 188, threePM: 59, ftm: 143, pts: 696 },
  { name: "Allisha Gray", team: "ATL", twoPM: 169, threePM: 62, ftm: 164, pts: 688 },
  { name: "Kayla McBride", team: "MIN", twoPM: 114, threePM: 108, ftm: 124, pts: 676 },
  { name: "Jackie Young", team: "LVA", twoPM: 156, threePM: 82, ftm: 111, pts: 669 },
  { name: "Marina Mabrey", team: "TOR", twoPM: 113, threePM: 105, ftm: 126, pts: 667 },
  { name: "Rhyne Howard", team: "ATL", twoPM: 85, threePM: 109, ftm: 112, pts: 609 },
  { name: "Nneka Ogwumike", team: "LAS", twoPM: 176, threePM: 48, ftm: 78, pts: 574 },
  { name: "Shakira Austin", team: "WAS", twoPM: 186, threePM: 17, ftm: 140, pts: 563 },
  { name: "Aliyah Boston", team: "IND", twoPM: 175, threePM: 38, ftm: 95, pts: 559 },
  { name: "Natisha Hiedeman", team: "SEA", twoPM: 130, threePM: 68, ftm: 91, pts: 555 },
  { name: "Natasha Howard", team: "MIN", twoPM: 224, threePM: 3, ftm: 95, pts: 552 },
  { name: "Arike Ogunbowale", team: "DAL", twoPM: 110, threePM: 61, ftm: 132, pts: 535 },
  { name: "Angel Reese", team: "ATL", twoPM: 177, threePM: 7, ftm: 160, pts: 535 },
];

// Shooting-efficiency leaders (also real, from the same leaders page)
const SHOOTING_LEADERS = {
  fgPct: [
    { name: "NaLyssa Smith", team: "LVA", pct: 0.635 },
    { name: "Natasha Mack", team: "PHO", pct: 0.616 },
    { name: "Natasha Howard", team: "MIN", pct: 0.587 },
    { name: "Jessica Shepard", team: "DAL", pct: 0.582 },
    { name: "Olivia Nelson-Ododa", team: "CON", pct: 0.576 },
  ],
  threePct: [
    { name: "Sophie Cunningham", team: "IND", pct: 0.458 },
    { name: "Kelsey Mitchell", team: "IND", pct: 0.443 },
    { name: "Antonia Delaere", team: "MIN", pct: 0.439 },
    { name: "Julie Allemand", team: "TOR", pct: 0.436 },
    { name: "Leonie Fiebich", team: "NYL", pct: 0.433 },
  ],
  ftPct: [
    { name: "Jackie Young", team: "LVA", pct: 0.933 },
    { name: "Chelsea Gray", team: "LVA", pct: 0.932 },
    { name: "Kayla Thornton", team: "GSV", pct: 0.920 },
    { name: "Kayla McBride", team: "MIN", pct: 0.919 },
    { name: "Ariel Atkins", team: "LAS", pct: 0.917 },
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
 * pulled 2026-08-21 (every GB figure cross-verified against the win/loss
 * math). Top 8 make the playoffs, seeded league-wide regardless of
 * conference. Rank is by winning percentage, which can put a team with
 * fewer total wins ahead of one with more (see WAS vs. NYL below — WAS
 * has fewer total wins but a better winning percentage).
 */
const STANDINGS = [
  { rank: 1, team: "MIN", w: 30, l: 7, pct: 0.811, gb: 0 },
  { rank: 2, team: "GSV", w: 25, l: 10, pct: 0.714, gb: 4.0 },
  { rank: 3, team: "LVA", w: 25, l: 13, pct: 0.658, gb: 5.5 },
  { rank: 4, team: "IND", w: 24, l: 13, pct: 0.649, gb: 6.0 },
  { rank: 5, team: "ATL", w: 23, l: 13, pct: 0.639, gb: 6.5 },
  { rank: 6, team: "WAS", w: 21, l: 14, pct: 0.600, gb: 8.0 },
  { rank: 7, team: "NYL", w: 22, l: 15, pct: 0.595, gb: 8.0 },
  { rank: 8, team: "DAL", w: 21, l: 16, pct: 0.568, gb: 9.0 },
  { rank: 9, team: "POR", w: 15, l: 20, pct: 0.429, gb: 14.0 },
  { rank: 10, team: "CHI", w: 14, l: 22, pct: 0.389, gb: 15.5 },
  { rank: 11, team: "PHO", w: 13, l: 23, pct: 0.361, gb: 16.5 },
  { rank: 12, team: "LAS", w: 12, l: 24, pct: 0.333, gb: 17.5 },
  { rank: 13, team: "TOR", w: 10, l: 25, pct: 0.286, gb: 19.0 },
  { rank: 14, team: "CON", w: 9, l: 26, pct: 0.257, gb: 20.0 },
  { rank: 15, team: "SEA", w: 7, l: 30, pct: 0.189, gb: 23.0 },
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
    record: "30-7",
    playStyle: "Deep, egalitarian offense that shares the ball — no single go-to scorer dominates possessions, and multiple players can beat you on a given night.",
    strengths: [
      "Best record in the league at 30-7 (.811), riding a 5-game winning streak with the league's best point differential (+8.8)",
      "Balanced scoring: four different players average 15+ PPG",
      "Rookie of the Year favorite Olivia Miles (19.9 PPG, 6.1 APG) has run the offense as a Day 1 starter",
    ],
    weaknesses: [
      "No player ranks in the league's individual scoring top-5, so there's no obvious closer to lean on late",
      "Youngest core among the top seeds, with a rookie point guard running the show",
    ],
  },
  GSV: {
    record: "25-10",
    playStyle: "Defense-first identity — wins with discipline, depth, and rebounding rather than a marquee superstar scorer.",
    strengths: [
      "Holds the No. 2 seed behind one of the league's stingiest scoring defenses (76.7 OPPG)",
      "Kiah Stokes owns the league's best individual Defensive Rating (98.3), anchoring a top-tier team defense",
    ],
    weaknesses: [
      "On a 1-game losing streak",
      "Lacks a proven go-to isolation scorer in crunch time — no player ranks in the league's individual scoring top-15",
    ],
  },
  LVA: {
    record: "25-13",
    playStyle: "Star-driven half-court offense built around A'ja Wilson in the post, with Chelsea Gray and Jackie Young initiating the offense.",
    strengths: [
      "A'ja Wilson leads the league in total points (888), PPG (26.1), Player Efficiency Rating (31.8), and Win Shares (7.2) — the clearest MVP case in the WNBA",
      "Won its last game to reclaim the No. 3 seed from Indiana on winning percentage; defending champions with a championship-tested playoff core",
    ],
    weaknesses: [
      "Heavy reliance on Wilson's post touches can bog the offense down against physical, switch-everything defenses",
      "Allows the most points among the West's top seeds (87.1 OPPG)",
    ],
  },
  IND: {
    record: "24-13",
    playStyle: "High-scoring, guard-driven offense built around Caitlin Clark's shooting gravity and Kelsey Mitchell's scoring.",
    strengths: [
      "Leads the entire league in scoring at 96.1 points per game, with Kelsey Mitchell (875 pts, 24.3 PPG) 2nd in the league in total points",
      "Caitlin Clark ranks 2nd in the league in assists per game (8.2) and scoring (22.1 PPG) — a rare two-way combination",
    ],
    weaknesses: [
      "On a 1-game losing streak, dropping to the No. 4 seed behind Las Vegas",
      "Also allows the most points among the top seeds (90.5 OPPG), reflecting an up-tempo, less defense-oriented identity",
    ],
  },
  ATL: {
    record: "23-13",
    playStyle: "Defense and ball pressure first — wins games with disruption and transition offense more than half-court shot-making.",
    strengths: [
      "Won its last two games; Rhyne Howard leads the league in total steals (81) and steals per game (2.4), and ranks top-15 in total points (609)",
      "Jordin Canada (252 ast, 7.4 APG) pushes tempo and pressures ball-handlers full-court",
    ],
    weaknesses: [
      "Less proven half-court scoring punch than the conference's top seeds",
      "Sits just a game and a half up on Washington for the No. 5 seed with several weeks left",
    ],
  },
  WAS: {
    record: "21-14",
    playStyle: "Frontcourt-anchored defense — wins low-scoring, physical games in the paint.",
    strengths: [
      "Won its last two games to climb into the No. 6 seed ahead of New York on winning percentage",
      "Shakira Austin owns the league's 2nd-best individual Defensive Rating (99.8) and ranks top-5 in the league in total rebounds (326)",
    ],
    weaknesses: [
      "Scores the fewest points per game (81.9) of any team in the playoff field, and is the only playoff team with a negative scoring margin (-0.4)",
      "Youngest playoff roster in the field, with limited postseason experience",
    ],
  },
  NYL: {
    record: "22-15",
    playStyle: "Star-laden roster built around Breanna Stewart's scoring and size, when the roster is healthy.",
    strengths: [
      "Breanna Stewart ranks 3rd in the league in total points (746) at 20.7 PPG",
      "Still holds a comfortable cushion over the bottom of the playoff field despite dropping to the No. 7 seed",
    ],
    weaknesses: [
      "On a 1-game losing streak; season-long absences to injury have kept the roster from playing at full strength",
      "Give up nearly as many points as they score on average (87.2 PPG allowed vs. 90.2 scored), the thinnest margin among the East's top seeds",
    ],
  },
  DAL: {
    record: "21-16",
    playStyle: "Guard-driven scoring attack led by Paige Bueckers, with size and rebounding from Jessica Shepard underneath.",
    strengths: [
      "Won its last game to hold the final playoff spot; Jessica Shepard ranks 2nd in the WNBA in total rebounds (382)",
      "Paige Bueckers (696 pts, 20.5 PPG) gives Dallas a legitimate go-to scorer",
    ],
    weaknesses: [
      "No. 1 pick Azzi Fudd is out for the remainder of the season with a knee injury, thinning the rotation",
      "Only a game up on Portland's pace for the No. 9 seed, with little margin for error",
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
    { name: "A'ja Wilson", team: "LVA", odds: "clear favorite", note: "Basketball-Reference's own PPG (26.1) and Win Shares (7.2) leader, with a Player Efficiency Rating (31.8) far ahead of the field — the clearest statistical MVP case in the league." },
    { name: "Kelsey Mitchell", team: "IND", odds: "top challenger", note: "Leads the WNBA in total points (875) and ranks 1st in Offensive Win Shares while anchoring Indiana's playoff push." },
    { name: "Caitlin Clark", team: "IND", odds: "in the mix", note: "Ranks 2nd in the league in assists per game (8.2) and scoring (22.1 PPG), a rare two-way statistical combination." },
    { name: "Breanna Stewart", team: "NYL", odds: "long shot", note: "Still in the conversation on name recognition and two-way impact, though efficiency has dipped from her MVP peak." },
  ],
  roy: [
    { name: "Olivia Miles", team: "MIN", odds: "heavy favorite", note: "Leads all rookies in scoring (696 pts, 19.9 PPG) and playmaking (215 ast, 6.1 APG) for the league's best team, with a Player Efficiency Rating (23.3) that ranks 3rd among all players, rookie or veteran." },
    { name: "Azzi Fudd", team: "DAL", odds: "long shot", note: "No. 1 overall pick, but is now out for the remainder of the season with a knee injury, likely ending her case for the award." },
  ],
  dpoy: [
    { name: "Kiah Stokes", team: "GSV", odds: "favorite", note: "Owns the league's best individual Defensive Rating (98.3) for one of the stingiest team defenses in the WNBA." },
    { name: "Shakira Austin", team: "WAS", odds: "in the mix", note: "2nd-best Defensive Rating in the league (99.8) and a top-5 rebounder, the backbone of Washington's playoff push." },
    { name: "A'ja Wilson", team: "LVA", odds: "in the mix", note: "Leads the league in total blocks (71) and blocks per game (2.1), anchoring one of the WNBA's top-rated defenses." },
  ],
  note: "Odds and rankings are a snapshot from mid-to-late August 2026 and will keep moving as the regular season winds down.",
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

