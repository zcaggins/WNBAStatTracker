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
  { name: "Olivia Miles", team: "MIN", ast: 117, apg: 5.6, astPct: 28.8 },
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
