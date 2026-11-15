(function () {
  // Layer 1 is numbers and bars only. Reasons and dialogue live in the sheet a click opens.
  // Status hues pass the palette validator on light and dark surfaces; every status also has a label.
  const css = `
  :root{--er-pass:#2a9d78;--er-fail:#c8434f;--er-warn:#b98a10}
  .er{--ink:var(--foreground,#1d2026);--mute:color-mix(in srgb,var(--ink) 58%,transparent);
    --line:color-mix(in srgb,var(--ink) 12%,transparent);--wash:color-mix(in srgb,var(--ink) 5%,transparent);
    position:relative;max-width:720px;margin:0 auto;padding:24px 16px 40px;box-sizing:border-box;color:var(--ink);
    font:14px/1.6 var(--font-sans,system-ui,-apple-system,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif)}
  .er *{box-sizing:border-box}
  .er .passed{--tone:var(--er-pass)}.er .failed{--tone:var(--er-fail)}.er .unknown{--tone:var(--er-warn)}
  .er h1{font-size:20px;line-height:1.35;font-weight:650;margin:0}
  .er .sub{color:var(--mute);font-size:12px}
  .er h2{font-size:12px;font-weight:500;color:var(--mute);margin:28px 0 4px;display:flex;gap:6px;align-items:center}
  .er .dot{width:8px;height:8px;border-radius:50%;background:var(--tone);flex:none;display:inline-block}
  .er button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}
  .er button:focus-visible{outline:2px solid var(--ink);outline-offset:2px;border-radius:4px}

  .er .top{display:flex;align-items:center;gap:24px;margin-top:20px}
  .er .donut{position:relative;width:104px;height:104px;flex:none}
  .er .donut svg{width:100%;height:100%;transform:rotate(-90deg);display:block}
  .er .donut circle[data-s]{cursor:pointer}
  .er .donut .hole{pointer-events:none;position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .er .donut .pct{font-size:24px;font-weight:650;line-height:1.1}
  .er .legend{display:flex;flex-direction:column;gap:2px}
  .er .legend button{display:flex;align-items:center;gap:8px;padding:2px 6px;margin-left:-6px;border-radius:4px}
  .er .legend button:hover,.er .row:hover{background:var(--wash)}
  .er .legend b{font-weight:600;font-variant-numeric:tabular-nums}

  .er .row{display:grid;grid-template-columns:1fr 96px 3.4em;gap:16px;align-items:center;width:100%;
    padding:9px 6px;border-bottom:1px solid var(--line);border-radius:4px}
  .er .row .name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .er .id{font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--mute);margin-right:8px}
  .er .num{text-align:right;font-variant-numeric:tabular-nums}
  .er .bar{display:flex;gap:2px;height:8px}
  .er .bar>*{flex:1;background:var(--tone);border-radius:4px;height:100%}
  .er .group .bar>*{border-radius:0}
  .er .group .bar>:first-child{border-radius:4px 0 0 4px}.er .group .bar>:last-child{border-radius:0 4px 4px 0}
  .er .group .bar>:only-child{border-radius:4px}
  .er .group{grid-template-columns:minmax(0,200px) 1fr 3.4em}

  .er .veil{position:fixed;inset:0;background:#0006;z-index:10}
  .er .sheet{position:absolute;z-index:11;left:50%;transform:translateX(-50%);width:min(560px,calc(100% - 24px));
    background:var(--popover,var(--background,#fff));color:var(--ink);border-radius:12px;padding:20px 22px;box-shadow:0 16px 48px #0004;
    overflow:auto;overscroll-behavior:contain}
  .er .sheet .x{float:right;font-size:20px;line-height:1;padding:2px 6px;margin:-4px -6px 0 8px;color:var(--mute)}
  .er .sheet h3{font-size:16px;font-weight:650;margin:2px 0 8px;line-height:1.4}
  .er .sheet .meter{display:grid;grid-template-columns:96px auto 1fr;gap:12px;align-items:center}
  .er .scene{margin-top:18px}
  .er .scene h4{margin:0 0 6px;font-size:13px;font-weight:600;display:flex;gap:8px;align-items:center}
  .er .line{display:grid;grid-template-columns:2.4em 1fr;gap:0 10px;padding:1px 0}
  .er .line span:first-child{color:var(--mute);font-size:12px;padding-top:2px}
  .er .line span:last-child{white-space:pre-wrap;overflow-wrap:anywhere}
  .er mark{background:color-mix(in srgb,var(--tone) 20%,transparent);color:inherit;border-radius:2px;padding:1px 2px;
    text-decoration:underline;text-decoration-color:var(--tone);text-decoration-thickness:2px;text-underline-offset:3px}
  .er .why{margin:4px 0 0 calc(2.4em + 10px);color:var(--mute);font-size:13px}
  .er .miss{margin-top:10px}
  .er .foot{margin-top:16px;display:flex;gap:16px;font-size:13px}
  .er .more::before{content:"▸ "}.er .more[aria-expanded=true]::before{content:"▾ "}
  .er .all{margin-top:6px}
  .er .all .pair{padding:10px 0}
  .er .all .pair+.pair{border-top:1px solid var(--line)}
  .er .foot a,.er .foot button{color:var(--mute);text-decoration:underline;text-underline-offset:3px}
  @media(max-width:480px){.er .row{grid-template-columns:1fr 72px 3.2em;gap:10px}.er .top{gap:16px}}`;

  const el = (tag, attrs = {}, kids = []) => {
    const svg = tag === "svg" || tag === "circle";
    const n = svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    }
    for (const kid of [].concat(kids)) if (kid != null) n.append(kid);
    return n;
  };
  const pct = (n, total) => (total ? String(Math.round((1000 * n) / total) / 10) : "0") + "%";
  const groupOf = (ticket) => (String(ticket).match(/^[A-Z]+\d+/) || [""])[0];
  const cleanTitle = (run) => String(run.title || run.ticket).replace(/^\s*\[[^\]]+\]\s*/, "").replace(/\s*[｜|]\s*\d+\s*情境\s*$/, "");
  const verdictStatus = (text) => (String(text).includes("不通過") ? "failed" : String(text).includes("無法") ? "unknown" : "passed");
  const sceneName = (scene) => String(scene).replace(/^\d+\s*/, "") || String(scene);
  const labels = { passed: "通過", failed: "不通過", unknown: "無法判定" };

  /** Scoring rows that share a leading number are one scenario; the worst verdict wins. */
  function scenarios(run) {
    const rank = { passed: 0, unknown: 1, failed: 2 };
    const byKey = new Map();
    for (const v of run.verdicts || []) {
      const scene = String(v.scene || "");
      if (scene.startsWith("全段")) continue;
      const key = (scene.match(/^\d+/) || [scene])[0];
      const status = verdictStatus(v.verdict);
      const entry = byKey.get(key) || { key, name: sceneName(scene), status: "passed", scenes: [] };
      if (rank[status] > rank[entry.status]) entry.status = status;
      entry.scenes.push(scene);
      byKey.set(key, entry);
    }
    return [...byKey.values()];
  }

  function markText(text, quotes) {
    const out = [];
    let rest = text;
    while (rest) {
      let best = null;
      for (const q of quotes) { const at = rest.indexOf(q); if (q && at >= 0 && (!best || at < best.at)) best = { at, q }; }
      if (!best) { out.push(rest); break; }
      out.push(rest.slice(0, best.at), el("mark", { text: best.q }));
      rest = rest.slice(best.at + best.q.length);
    }
    return out;
  }

  /** One segment per scenario, or pass/rest when the scenarios cannot be listed. */
  function sceneBar(run) {
    const list = scenarios(run);
    const rate = run.rate || { passed: 0, total: 0 };
    const exact = list.length === rate.total && list.filter((s) => s.status === "passed").length === rate.passed;
    const parts = exact ? list.map((s) => ({ status: s.status, title: `${s.name}：${labels[s.status]}` }))
      : Array.from({ length: rate.total }, (_, i) => ({ status: i < rate.passed ? "passed" : "failed", title: "" }));
    return el("span", { class: "bar" }, parts.map((p) => el("i", { class: p.status, title: p.title })));
  }

  function render(data) {
    for (const [k, v] of Object.entries(data.status_labels || {})) if (labels[k]) labels[k] = v;
    const b = data.batch;
    const root = el("div", { class: "er" });
    const all = [["runs", "failed"], ["unknown_runs", "unknown"], ["passed_runs", "passed"]]
      .flatMap(([key, status]) => (data[key] || []).map((run) => ({ run, status })));
    const counts = { passed: b.passed, failed: b.failed ?? b.runs - b.passed - (b.unknown || 0), unknown: b.unknown || 0 };
    const present = Object.keys(labels).filter((s) => counts[s] > 0);

    // ---- layer 2 -------------------------------------------------------
    let sheet = null, veil = null, opener = null, place = () => {};
    const close = () => { sheet?.remove(); veil?.remove(); sheet = veil = null; opener?.focus(); };
    function open(kids, from) {
      close(); opener = from;
      veil = el("div", { class: "veil", onclick: close });
      sheet = el("div", { class: "sheet", role: "dialog", "aria-modal": "true" }, [el("button", { class: "x", type: "button", "aria-label": "關閉", text: "×", onclick: close }), ...kids]);
      root.append(veil, sheet);
      // The page height before the sheet existed: the sheet must fit inside it and scroll within itself.
      const doc = root.getBoundingClientRect().height + root.getBoundingClientRect().top + scrollY;
      const framed = innerHeight >= document.documentElement.scrollHeight - 4;
      sheet.style.maxHeight = Math.max(240, Math.min(framed ? 640 : innerHeight - 32, doc - 24)) + "px";
      place = () => {
        const h = sheet.offsetHeight;
        // A frame sized to its content does not scroll: open beside the row that was clicked.
        if (!framed) { sheet.style.position = "fixed"; sheet.style.top = Math.max(16, (innerHeight - h) / 2) + "px"; return; }
        const anchor = from.getBoundingClientRect().top + scrollY;
        const top = Math.min(Math.max(anchor - 40, 12), Math.max(12, doc - h - 12));
        sheet.style.top = top - root.getBoundingClientRect().top - scrollY + "px";
      };
      place();
      sheet.querySelector(".x").focus();
    }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet) close(); });

    /** Inside the sheet: the turns that carry a problem, then the full dialogue, which opens below them. */
    function evidence(x) {
      const run = x.run;
      const byTurn = {};
      const misses = [];
      for (const h of run.highlights || []) {
        const t = (run.turns || []).find((t) => t.i === h.turn);
        // No quote means the whole reply is the problem; a quote must be the reply's own words.
        if (t && (!h.quote || t.tiger.includes(h.quote))) (byTurn[h.turn] ||= []).push(h); else misses.push(h);
      }
      const missed = misses.map((h) => el("div", { class: "miss sub", text: `引用對不上原文，沒有標示：「${h.quote}」` }));
      const exchange = (t) => [
        el("div", { class: "line" }, [el("span", { text: "孩子" }), el("span", { text: t.child })]),
        el("div", { class: "line" }, [el("span", { text: "巧虎" }), el("span", {}, markText(t.tiger, (byTurn[t.i] || []).map((h) => h.quote)))]),
      ];
      const scenes = scenarios(run).filter((s) => s.status !== "passed").map((s) => {
        const hits = (run.highlights || []).filter((h) => s.scenes.includes(h.rule) && byTurn[h.turn]?.includes(h));
        const turns = [...new Set(hits.map((h) => h.turn))].map((i) => run.turns.find((t) => t.i === i));
        const fallback = (run.verdicts || []).find((v) => s.scenes.includes(v.scene) && verdictStatus(v.verdict) !== "passed");
        return el("div", { class: "scene " + s.status }, [
          el("h4", {}, [el("span", { class: "dot" }), s.name]),
          ...turns.flatMap(exchange),
          el("div", { class: "why", text: hits.length ? hits.map((h) => h.why).join("；") : fallback?.rule || "" }),
        ]);
      });
      const turns = run.turns || [];
      const full = el("div", { class: "all " + x.status }, turns.map((t) => el("div", { class: "pair" }, exchange(t))));
      const source = run.report_url && /^https?:/.test(run.report_url) ? el("a", { href: run.report_url, target: "_blank", rel: "noopener", text: "原始報告" }) : null;
      // Nothing to point at: the dialogue itself is the content.
      if (!scenes.length) return [full, ...missed, el("div", { class: "foot" }, source)];
      full.hidden = true;
      const toggle = el("button", { class: "more", type: "button", "aria-expanded": "false", text: `完整對話（${turns.length} 輪）`, onclick: () => {
        full.hidden = !full.hidden;
        toggle.setAttribute("aria-expanded", String(!full.hidden));
        place();
        if (!full.hidden) sheet.scrollTo({ top: toggle.offsetTop - 16, behavior: "smooth" });
      } });
      return [...scenes, ...missed, el("div", { class: "foot" }, [toggle, source]), full];
    }

    function openCard(x, from) {
      const run = x.run;
      open([
        el("div", { class: "sub", text: run.ticket }),
        el("h3", { text: cleanTitle(run) }),
        el("div", { class: "meter " + x.status }, [sceneBar(run), el("b", { class: "num", text: run.rate ? pct(run.rate.passed, run.rate.total) : "" }),
          el("span", { class: "sub", text: run.rate ? `門檻 ${pct(run.rate.threshold, 1)}` : "" })]),
        ...evidence(x),
      ], from);
    }

    const cardRow = (x) => {
      const row = el("button", { class: "row " + x.status, type: "button", onclick: () => openCard(x, row) }, [
        el("span", { class: "name" }, [el("span", { class: "id", text: x.run.ticket }), cleanTitle(x.run)]),
        sceneBar(x.run),
        el("span", { class: "num", text: x.run.rate ? pct(x.run.rate.passed, x.run.rate.total) : "" }),
      ]);
      return row;
    };
    function openList(status, group, from) {
      const rows = all.filter((x) => x.status === status && (!group || groupOf(x.run.ticket) === group));
      open([el("h3", { class: status }, [`${group ? group + " " : ""}${labels[status]} ${rows.length}`]), ...rows.map(cardRow)], from);
    }

    // ---- layer 1 -------------------------------------------------------
    root.append(el("h1", { text: b.label }), el("div", { class: "sub", text: [String(b.label).includes(data.generated_at) ? null : data.generated_at, `${b.runs} 張卡`].filter(Boolean).join(" · ") }));

    const r = 46, c = 2 * Math.PI * r;
    const svg = el("svg", { viewBox: "0 0 104 104" }, el("circle", { cx: 52, cy: 52, r, fill: "none", stroke: "var(--line)", "stroke-width": 10 }));
    let offset = 0;
    for (const s of present) {
      const len = (counts[s] / b.runs) * c;
      const arc = el("circle", { cx: 52, cy: 52, r, fill: "none", stroke: `var(--er-${s === "passed" ? "pass" : s === "failed" ? "fail" : "warn"})`, "stroke-width": 10,
        "stroke-dasharray": `${Math.max(len - 2, 0)} ${c}`, "stroke-dashoffset": -offset, "data-s": s, onclick: () => openList(s, "", arc) });
      svg.append(arc); offset += len;
    }
    root.append(el("div", { class: "top" }, [
      el("div", { class: "donut" }, [svg, el("div", { class: "hole" }, [el("div", { class: "pct", text: pct(b.passed, b.runs) }), el("div", { class: "sub", text: labels.passed })])]),
      el("div", { class: "legend" }, present.map((s) => { const btn = el("button", { class: s, type: "button", onclick: () => openList(s, "", btn) }, [el("span", { class: "dot" }), labels[s], el("b", { text: String(counts[s]) })]); return btn; })),
    ]));

    const groups = Object.entries(data.groups || {});
    if (groups.length > 1) {
      root.append(el("h2", { text: "分類" }));
      for (const [g, name] of groups) {
        const stats = (data.group_stats || {})[g] || {};
        const total = (stats.passed || 0) + (stats.failed || 0) + (stats.unknown || 0);
        root.append(el("div", { class: "row group" }, [
          el("span", { class: "name" }, [el("span", { class: "id", text: g }), name]),
          el("span", { class: "bar" }, Object.keys(labels).filter((s) => stats[s] > 0).map((s) => {
            const seg = el("button", { class: s, type: "button", style: `flex:${stats[s]}`, title: `${labels[s]} ${stats[s]}`, "aria-label": `${g} ${labels[s]} ${stats[s]}`, onclick: () => openList(s, g, seg) });
            return seg; })),
          el("span", { class: "num", text: pct(stats.passed || 0, total) }),
        ]));
      }
    }

    for (const s of ["failed", "unknown", "passed"]) {
      const rows = all.filter((x) => x.status === s);
      if (!rows.length) continue;
      root.append(el("h2", { class: s }, [el("span", { class: "dot" }), `${labels[s]} ${counts[s]}`]), ...rows.map(cardRow));
    }

    if (b.errors || b.cancelled) root.append(el("p", { class: "sub", text: `執行錯誤 ${b.errors || 0} · 已取消 ${b.cancelled || 0}` }));
    return root;
  }

  function start() {
    const style = el("style"); style.textContent = css; document.head.append(style);
    try { document.body.append(render(JSON.parse(document.getElementById("eval-report").textContent))); }
    catch (err) { document.body.append(el("pre", { text: "報表資料讀不了：" + err.message })); console.error(err); }
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
