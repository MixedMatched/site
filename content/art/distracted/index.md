+++
title = "distracted"
date = 2026-04-17

[extra]
cover = "music-charts_music-genre-breakdown-by-day.svg"
+++
_medium_: HTML, SVG, CSS, JS

I collected data on things I used as distractions/entertainment for the week of
2026-03-26 - 2026-04-02. I added timespans for each event, along with its type
(music, youtube, etc.). I also gathered additional data on the qualities of the
music, books, shows, and videos.

I then produced an SVG schedule showing how my audio and visual senses were
occupied for that week using d3.js. This chart was sort of upsetting.

I then also produced charts analyzing data about the music and books I read.
For music, I used my last.fm data in combination with MusicBrainz tagging, and
I produced a chart on genre breakdown by day, and a chart on the release years
of thetracks. For books, I used some data from The Storygraph and from textual
analysisof the books themselves, and I produced charts on my reading speed, the
sentiment of the text, and the genres associated with the books.

Finally, I used matter.js to create an interactive website where the analysis charts
float to cover the schedule, and you have to drag them out of the way to see what
the schedule says.

<iframe src="/art/distracted/site/" style="width: 100%; aspect-ratio: 4 / 3; border: dashed 2px var(--accent); border-radius: 15px; padding: .125rem;" title="distracted — interactive view"></iframe>

<a href="/art/distracted/site/">view fullscreen →</a>
