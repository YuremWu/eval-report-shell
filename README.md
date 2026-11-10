# eval-report-shell

A fixed renderer for Tiger Bot Eval batch reports. A report page holds only data:

```html
<script type="application/json" id="eval-report">{ ...report data... }</script>
<script src="https://cdn.jsdelivr.net/gh/YuremWu/eval-report-shell@<commit>/eval-report.js"></script>
```

The shell draws the batch scorecard (donut), card groups, each card's pass history (sparkline),
and every failed run as a chat transcript with the problem words marked. A `quote` that is not
the bot's own words is not marked and is listed as a mismatch.

Data schema: see the `eval-batch-report` skill in TheKeeper-ai/tiger-bot-test-eval.
This repo holds no report data.
