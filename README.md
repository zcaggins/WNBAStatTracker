WNBA Live Leaders
A static, no-build-step dashboard tracking WNBA statistical leaders:

Points & Shooting — total points, PPG, and a per-player shot-type breakdown (2PT / 3PT / FT makes)
Rebounds — total, per-game, and offensive vs. defensive split
Assists — total, per-game, and assist percentage
Playmaking Style — qualitative context on how top playmakers generate assists (pick-and-roll, post-up, spot-up, transition)
Where the data comes from — and where it doesn't
Real data (points, PPG, rebounds, RPG, offensive/defensive rebound splits, assists, APG, assist %, shooting percentages, and the 2PT/3PT/FT scoring breakdown) is pulled from Basketball-Reference's 2026 WNBA Leaders page, current as of July 14, 2026. The scoring breakdown (makes by shot type) is arithmetically derived from Basketball-Reference's official season totals — each player's row is cross-checked to sum exactly to her real point total.

Not real / clearly labeled: the "Playmaking Style" tab (pick-and-roll / post-up / spot-up / transition assist percentages) uses sample placeholder numbers. That kind of play-type breakdown is tracked by Synergy Sports or Second Spectrum, both paid, non-public data feeds — there's no free API for it, so nothing here can honestly claim to be "live" in that tab. The short scouting note under each player is real and drawn from public reporting on their game, but the percentages are illustrative only. 

"Real time" — what that means for a static site
This is a static site with no backend, so it can't poll a live stats API by itself (WNBA/NBA's stats endpoints aren't meant for public, unauthenticated, cross-origin use from a browser).

Updating the data
Everything lives in data.js, grouped by section:

POINTS_LEADERS — { name, team, pts, ppg }
REBOUND_LEADERS — { name, team, reb, rpg, oreb, dreb }
ASSIST_LEADERS — { name, team, ast, apg, astPct }
SCORING_BREAKDOWN — { name, team, twoPM, threePM, ftm, pts } (must sum to pts)
SHOOTING_LEADERS — FG% / 3P% / FT% leaders
PLAYMAKING_STYLE_SAMPLE — sample-only, see above
TEAM_NAMES — abbreviation → full team name lookup

Tech notes
Zero dependencies. One Google Fonts import (Oswald + Inter) for the scoreboard/chalk type pairing.
Charts are hand-rolled SVG (donut) and CSS (bar/stacked-bar) — no charting library.
Fully responsive down to mobile; the two-column leaderboards stack on narrow screens.
