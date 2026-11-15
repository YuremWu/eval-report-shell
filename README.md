# eval-report-shell

A fixed renderer for Tiger Bot Eval batch reports. Report generation writes the
data as JSON and loads this script at a pinned commit. The report data stays in
the HTML file; this repository contains no report data.

```html
<script type="application/json" id="eval-report">{ ...report data... }</script>
<script src="https://cdn.jsdelivr.net/gh/YuremWu/eval-report-shell@<commit>/eval-report.js" integrity="sha384-<digest>" crossorigin="anonymous"></script>
```

Pin both the full commit and the SHA-384 digest. The report cannot render without
network access to the CDN. Keep the HTML and its JSON private when they contain
company data.

The page itself is numbers and bars only: one overall donut with its legend,
one bar per group when there is more than one group, and one row per card with
its id, title, one bar segment per scenario and its pass rate. Reasons and
dialogue live in the sheet a click opens. A card's sheet shows the turns that
carry a problem, with the quoted words marked and underlined; "完整對話" opens the
full dialogue below them, inside the sheet. The donut, the legend and the group
bars open a list of the cards in that status. Escape, the close button or a click
outside closes the sheet. Missing evidence is labelled, never generated.

`runs` contains failed runs, `passed_runs` contains passed preview evidence, and
`unknown_runs` contains unknown evidence. Totals come from `batch` (`runs`,
`passed`, `failed`, `unknown`, `criterion`) and `group_stats` (the three status
counts per group), not from the number of supplied previews. Legacy reports with
only `runs` still render; missing group counts are labelled. Optional history
fields are unchanged. Quotes absent from the corresponding Tiger turn remain
unmarked and are listed as mismatches. The skill holds the complete data shape.

This public repository holds no report data. See `docs/planning/eval-report-hover.md`
in TheKeeper-ai/tiger-bot-test-eval for the approved change and acceptance scenarios.

## Verification

Serve the repository over HTTP, open `tests/fixture.html` and run
`await checkEvalReport()` in the console. It uses synthetic cases to check the
rows, the sheet, quote marking and mismatches, the folded dialogue, keyboard and
outside-click dismissal, status lists and viewport bounds. Run
`node --check eval-report.js` for syntax.
