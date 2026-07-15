# WNBA Live Leaders

A static, no-build-step dashboard tracking WNBA statistical leaders:

- **Points & Shooting** — total points, PPG, and a per-player shot-type breakdown (2PT / 3PT / FT makes)
- **Rebounds** — total, per-game, and offensive vs. defensive split
- **Assists** — total, per-game, and assist percentage
- **Playmaking Style** — qualitative context on *how* top playmakers generate assists (pick-and-roll, post-up, spot-up, transition)
- **Playoff Race** — real, current league standings plus title-contender tiers built from sportsbook odds and expert picks
- **Awards Predictions** — midseason MVP / Rookie of the Year / Defensive Player of the Year consensus picks and odds
- **Rookie Class** — the 2026 draft class in draft order, with real in-season stats where publicly reported
- **2027 Mock Draft** — a "way-too-early" college big board for next year's draft class
- **Player Profiles** — illustrated profile cards for marquee players (hometown, height, fun fact, playstyle, position) plus a beginner's half-court positioning diagram

It's plain HTML/CSS/JS — no npm, no build tool, no framework. Open `index.html` in a browser and it works; push it to a repo and GitHub Pages serves it as-is.

## Where the data comes from — and where it doesn't

**Real data** (points, PPG, rebounds, RPG, offensive/defensive rebound splits, assists, APG, assist %, shooting percentages, and the 2PT/3PT/FT scoring breakdown) is pulled from [Basketball-Reference's 2026 WNBA Leaders page](https://www.basketball-reference.com/wnba/years/2026_leaders.html), current as of **July 14, 2026**. The scoring breakdown (makes by shot type) is arithmetically derived from Basketball-Reference's official season totals — each player's row is cross-checked to sum exactly to her real point total.

**Not real / clearly labeled:** the "Playmaking Style" tab (pick-and-roll / post-up / spot-up / transition assist percentages) uses **sample placeholder numbers**. That kind of play-type breakdown is tracked by Synergy Sports or Second Spectrum, both paid, non-public data feeds — there's no free API for it, so nothing here can honestly claim to be "live" in that tab. The short scouting note under each player *is* real and drawn from public reporting on their game, but the percentages are illustrative only. This is flagged in-app with an on-page banner, not just here.

**The four newer sections mix real data with explicit predictions:**

- **Playoff Race** — the standings table is real (Basketball-Reference, July 13, 2026). The "Title Contender Tiers" underneath are a **prediction**: a snapshot of published sportsbook championship odds and beat-writer expert picks from around the 2026 All-Star break (Sports Illustrated Betting, ESPN, VegasInsider, CBS Sports). Odds move daily and differ by sportsbook — this is a point-in-time read, not a live line, and it's labeled as such in-app.
- **Awards Predictions** — entirely a **prediction**: midseason MVP / ROY / DPOY consensus picks and betting odds (ESPN's awards tracker, CBS Sports staff picks, BetMGM/FanDuel), all as of mid-July 2026 with roughly half the season left. Most Improved, Sixth Woman, and Coach of the Year are left out rather than guessed at, since public reporting on those races was too thin to source honestly at the time this was built.
- **Rookie Class** — real. The 2026 WNBA Draft results (pick order, college, team) are all real, sourced from Yahoo Sports/NBC Sports/NESN draft trackers. In-season stats are included only for the two rookies with widely reported per-game lines (Azzi Fudd, Olivia Miles); everyone else is marked "season underway" rather than assigned an invented number.
- **2027 Mock Draft** — the most speculative section on the site, flagged as such in-app. The actual 2027 draft order won't exist until the 2026 season and lottery are final, so this isn't a team-by-team mock — it's a **college big board** (a ranked list of draft-eligible prospects with no team attached), aggregated from Tankathon's Big Board and CBS Sports/Bleacher Report's published "way-too-early" 2027 mock drafts (April 2026).
- **Player Profiles** — the biographical facts (hometown, height, fun fact) and position are real, sourced from team/college bio pages, Wikipedia, and Basketball-Reference. The playstyle summaries are Claude's plain-language synthesis of those players' public scouting reports, not a quoted source. **There are no real photos.** Athlete photos are copyrighted (Getty/AP/WNBA-licensed) and can't legally be redistributed in a static site's source code, so each card uses a generated illustrated avatar (initials on a team-colored background) instead. If you have rights to real photos, drop the image URL into that player's `photoUrl` field in `data.js` — the card will use it automatically instead of the avatar. The half-court position diagram is general beginner basketball instruction (where the five traditional positions typically line up), not a tracked heat map of any real player's actual on-court locations.

## "Real time" — what that means for a static site

This is a static site with no backend, so it can't poll a live stats API by itself (WNBA/NBA's stats endpoints aren't meant for public, unauthenticated, cross-origin use from a browser, and Basketball-Reference doesn't offer a public JSON API). Two ways to make it genuinely live:

1. **Manual refresh (simplest):** update the arrays in `data.js` whenever you want new numbers — copy the current totals from Basketball-Reference, ESPN, or the WNBA's own stats site, bump `DATA_MODIFIED`, and push. Takes a couple of minutes per refresh.
2. **Wire up a real feed:** if you have access to a stats API (paid Synergy/Second Spectrum feed, a sports-data provider, or your own scraper running server-side), replace the contents of `data.js` with a small `fetch()` call in `script.js` that pulls JSON from your endpoint on page load, in the same shape as the arrays already there. The rendering code (`renderBoard`, `renderScoringDetail`, `renderReboundDetail`, `renderAssistDetail`, `renderPlaymaking`) doesn't care where the arrays came from, so this is a drop-in swap — no HTML/CSS changes needed.

## Updating the data

Everything lives in `data.js`, grouped by section:

- `POINTS_LEADERS` — `{ name, team, pts, ppg }`
- `REBOUND_LEADERS` — `{ name, team, reb, rpg, oreb, dreb }`
- `ASSIST_LEADERS` — `{ name, team, ast, apg, astPct }`
- `SCORING_BREAKDOWN` — `{ name, team, twoPM, threePM, ftm, pts }` (must sum to `pts`)
- `SHOOTING_LEADERS` — FG% / 3P% / FT% leaders
- `PLAYMAKING_STYLE_SAMPLE` — sample-only, see above
- `STANDINGS` — `{ rank, team, w, l, pct, gb }`, real league standings
- `PLAYOFF_CUTOFF_RANK` — which rank the playoff line falls after (8)
- `TITLE_CONTENDERS` — `{ tier, tierLabel, team, odds, blurb }`, prediction — see above
- `AWARDS_PREDICTIONS` — `{ mvp: [...], roy: [...], dpoy: [...], note }`, prediction — see above
- `ROOKIE_CLASS` — `{ pick, name, college, team, stats, note }`, real
- `MOCK_DRAFT_2027` — `{ rank, name, college, pos, note }`, prediction — see above
- `TEAM_NAMES` — abbreviation → full team name lookup
- `TEAM_COLORS` — approximate per-team accent colors for avatar styling (illustrative, not official brand colors)
- `PLAYER_PROFILES` — `{ name, team, position, posDetail, hometown, height, college, funFact, playstyle, photoUrl }`, real bio facts + a photo-URL hook (empty by default, see above)
- `COURT_POSITIONS` — `{ num, label, x, y, desc }`, the five half-court teaching positions

Edit the arrays, save, refresh the page (or push to redeploy). No other file needs to change for a routine stat update.

## Tech notes

- Zero dependencies. One Google Fonts import (Oswald + Inter) for the scoreboard/chalk type pairing.
- Charts and the half-court diagram are hand-rolled SVG — no charting library.
- Bright baby-blue color scheme (`style.css` `:root` variables) — swap the hex values there to retheme.
- Fully responsive down to mobile; the two-column leaderboards and profile grid both stack on narrow screens.
