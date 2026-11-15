(function () {
  // Status hues pass the palette validator on light and dark surfaces. Red and green sit
  // close for deutan readers, so every status also carries a label or a shape.
  const css = `
  :root{--er-pass:#2a9d78;--er-fail:#c8434f;--er-warn:#b98a10}
  .er{--ink:var(--foreground,#1d2026);--mute:color-mix(in srgb,var(--ink) 60%,transparent);
    --line:color-mix(in srgb,var(--ink) 13%,transparent);--wash:color-mix(in srgb,var(--ink) 4%,transparent);
    --link:var(--primary,#2f5fb3);--tone:var(--er-fail);
    max-width:860px;margin:0 auto;padding:20px 16px 48px;box-sizing:border-box;color:var(--ink);
    font:14px/1.65 var(--font-sans,system-ui,-apple-system,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif)}
  .er *{box-sizing:border-box}
  .er .num{font-variant-numeric:tabular-nums}
  .er .sub{color:var(--mute);font-size:12px}
  .er a{color:var(--link);text-decoration:none}.er a:hover{text-decoration:underline}
  .er h1{font-size:21px;line-height:1.35;font-weight:650;margin:2px 0 4px}
  .er h2{font-size:15px;font-weight:650;margin:36px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--line);
    display:flex;gap:8px;align-items:baseline;justify-content:space-between}
  .er h2 small{font-size:12px;font-weight:400;color:var(--mute)}
  .er .eyebrow{font-size:12px;color:var(--mute);letter-spacing:.04em}
  .er .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--tone);margin-right:7px;flex:none}
  .er .passed{--tone:var(--er-pass)}.er .failed{--tone:var(--er-fail)}.er .unknown{--tone:var(--er-warn)}

  .er .summary{display:grid;grid-template-columns:auto 1fr;gap:8px 28px;align-items:center;margin-top:18px;
    padding:20px 22px;border:1px solid var(--line);border-radius:12px}
  .er .donut{position:relative;width:112px;height:112px}
  .er .donut svg{width:100%;height:100%;transform:rotate(-90deg);display:block}
  .er .donut .hole{pointer-events:none;position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .er .donut .pct{font-size:24px;font-weight:650;line-height:1.1}
  .er .donut .of{font-size:11px;color:var(--mute)}
  .er .tally{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px 28px;align-items:start}
  .er .tally h3{margin:0 0 4px;font-size:12px;font-weight:400;color:var(--mute)}
  .er .legend{display:grid;grid-template-columns:auto auto auto;justify-content:start;gap:1px 14px}
  .er .legend .row{display:contents}
  .er .legend .row>span{padding:1px 0;display:flex;align-items:center}
  .er .legend .n{justify-content:flex-end}.er .legend .p{justify-content:flex-end;color:var(--mute)}
  .er .hero{font-size:24px;font-weight:650;line-height:1.2}
  .er .hero small{font-size:13px;font-weight:400;color:var(--mute);margin-left:6px}
  .er .rule{grid-column:1/-1;margin-top:8px;padding-top:12px;border-top:1px solid var(--line)}

  .er .barrow{display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:4px 18px;align-items:start;padding:12px 0}
  .er .barrow+.barrow{border-top:1px solid var(--line)}
  .er .barrow .name b{font-weight:600}
  .er .bar{display:flex;gap:2px;height:12px;margin-top:6px}
  .er .segment{border:0;padding:0;min-width:6px;height:100%;background:var(--tone);cursor:pointer;font-size:0}
  .er .segment:first-child{border-radius:3px 0 0 3px}.er .segment:last-child{border-radius:0 3px 3px 0}
  .er .segment:only-child{border-radius:3px}
  .er .barnote{display:flex;flex-wrap:wrap;gap:2px 16px;margin-top:6px;font-size:12px}
  .er .barnote span{display:inline-flex;align-items:center}
  .er .barnote .sc{margin-left:auto;color:var(--mute)}
  .er [data-preview]{cursor:pointer}
  .er [data-preview]:focus-visible,.er .cardrow:focus-visible{outline:2px solid var(--link);outline-offset:2px}

  .er .grouphead{margin:18px 0 2px;font-size:12px;color:var(--mute)}
  .er .cardrow{display:grid;grid-template-columns:1fr auto 92px;gap:2px 20px;align-items:center;padding:10px 6px;
    border-bottom:1px solid var(--line);color:inherit;border-radius:4px}
  .er a.cardrow:hover{background:var(--wash);text-decoration:none}
  .er .cardrow .what{min-width:0}
  .er .cardrow .id,.er .run .id{font:12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--mute);margin-right:8px;white-space:nowrap}
  .er .cardrow .title{font-weight:550}
  .er .cardrow .miss-scenes{font-size:12px;color:var(--mute);margin-top:1px;display:flex;flex-wrap:wrap;gap:0 14px}
  .er .cardrow .miss-scenes b{font-weight:550;color:var(--ink)}
  .er .meter{display:flex;align-items:center;gap:10px;justify-content:flex-end;white-space:nowrap}
  .er .pips{display:inline-flex;gap:3px}
  .er .pip{width:10px;height:10px;border-radius:2px;background:var(--er-pass)}
  .er .pip.failed{background:none;box-shadow:inset 0 0 0 2px var(--er-fail)}
  .er .pip.unknown{background:none;box-shadow:inset 0 0 0 2px var(--er-warn);border-radius:50%}
  .er .gauge{width:72px;height:6px;border-radius:3px;background:var(--line);overflow:hidden}
  .er .gauge i{display:block;height:100%;background:var(--tone)}
  .er .fig{min-width:92px;text-align:right}.er .fig small{color:var(--mute);font-size:12px;margin-left:6px}
  .er .state{display:inline-flex;align-items:center;font-size:13px}
  .er .state.passed{color:var(--mute)}.er .state.failed,.er .state.unknown{font-weight:600}

  .er .run{border:1px solid var(--line);border-left:3px solid var(--tone);border-radius:8px;padding:14px 18px;margin:12px 0}
  .er .runhead{display:flex;flex-wrap:wrap;gap:4px 16px;align-items:baseline;justify-content:space-between}
  .er .runhead .name{font-weight:650;font-size:15px}
  .er .runhead .right{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;font-size:12px;color:var(--mute)}
  .er .runhead .right b{color:var(--ink);font-weight:600;font-size:13px}
  .er .spark svg{display:block;width:96px;height:22px;overflow:visible}
  .er .findings{margin:10px 0 0;padding:0;list-style:none}
  .er .findings li{display:grid;grid-template-columns:auto 1fr;gap:0 8px;padding:3px 0}
  .er .findings .dot{margin:8px 0 0}
  .er .findings b{font-weight:600}
  .er .findings .basis{grid-column:2;color:var(--mute);font-size:12px}
  .er .turn{margin-top:12px;padding:10px 12px;background:var(--wash);border-radius:6px}
  .er .turn .at{font-size:12px;color:var(--mute);margin-bottom:2px}
  .er .line{display:grid;grid-template-columns:2.6em 1fr;gap:0 10px;padding:2px 0}
  .er .line .who{color:var(--mute);font-size:12px;padding-top:2px}
  .er .line .say{white-space:pre-wrap;overflow-wrap:anywhere}
  .er .why{margin:4px 0 0 calc(2.6em + 10px);font-size:13px;display:flex;align-items:baseline}
  .er .why .dot{transform:translateY(-1px)}
  .er .why a{margin-left:10px;font-size:12px;white-space:nowrap}
  .er mark{background:color-mix(in srgb,var(--tone) 20%,transparent);color:inherit;border-radius:2px;padding:1px 2px;
    box-shadow:inset 0 -2px 0 color-mix(in srgb,var(--tone) 70%,transparent)}
  .er .miss{margin-top:10px;font-size:12px;border-left:3px solid var(--er-warn);padding:4px 10px;color:var(--mute)}
  .er details.more{margin-top:12px}
  .er details>summary{cursor:pointer;color:var(--mute);font-size:13px}
  .er details.more[open]>summary{margin-bottom:8px}
  .er table.verdicts{width:100%;border-collapse:collapse;font-size:13px;margin:4px 0 10px}
  .er table.verdicts td{padding:5px 10px 5px 0;border-top:1px solid var(--line);vertical-align:top}
  .er table.verdicts td:first-child{white-space:nowrap}
  .er table.verdicts .basis{color:var(--mute);font-size:12px}
  .er .pair{padding:6px 0;border-top:1px solid var(--line)}
  .er .extras{margin-top:28px;border-top:1px solid var(--line);padding-top:12px}
  .er .extras>summary{font-size:15px;font-weight:650;color:var(--ink)}
  .er .extras>summary small{font-size:12px;font-weight:400;color:var(--mute);margin-left:6px}

  .er .tip{position:fixed;pointer-events:none;background:var(--popover,#222);color:var(--popover-foreground,#fff);
    border-radius:6px;padding:4px 8px;font-size:12px;display:none;z-index:9;white-space:pre}
  .er .panel{position:fixed;z-index:1000;width:min(440px,calc(100vw - 24px));max-height:min(480px,calc(100dvh - 24px));
    overflow:auto;padding:16px 18px;border:1px solid var(--line);border-radius:10px;background:var(--popover,#fff);
    color:var(--popover-foreground,#1d2026);box-shadow:0 10px 30px #0002;overscroll-behavior:contain}
  .er .panel[hidden]{display:none}.er .panel h3{margin:0 32px 2px 0;font-size:14px;font-weight:650}
  .er .panel .close{float:right;position:sticky;top:0;border:0;background:var(--popover,#fff);color:inherit;cursor:pointer;font:inherit;padding:0 4px}
  .er .preview{border-top:1px solid var(--line);margin-top:10px;padding-top:10px;overflow-wrap:anywhere}
  .er .preview p{margin:4px 0;white-space:pre-wrap}
  .er .preview blockquote{margin:6px 0;padding:8px 10px;background:var(--wash);border-radius:6px;white-space:pre-wrap}

  @media(max-width:600px){
    .er{padding:16px 12px 40px}
    .er .summary{gap:8px 20px;padding:16px}
    .er .barrow{grid-template-columns:1fr}
    .er .cardrow{grid-template-columns:1fr auto}
    .er .cardrow .what{grid-column:1/-1}
    .er .meter{justify-content:flex-start}
    .er .fig{min-width:0;text-align:left}
    .er .why{margin-left:0}
  }
  @media(max-width:400px){.er .summary{grid-template-columns:1fr}}`;

  const el = (tag, attrs = {}, kids = []) => {
    const svg = ["svg", "circle", "polyline", "line"].includes(tag);
    const n = svg ? document.createElementNS("http://www.w3.org/2000/svg", tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") n.textContent = v; else if (k.startsWith("on")) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v);
    }
    for (const kid of [].concat(kids)) if (kid != null) n.append(kid);
    return n;
  };
  const tip = el("div", { class: "tip" });
  const showTip = (e, text) => { tip.textContent = text; tip.style.display = "block"; tip.style.left = e.clientX + 12 + "px"; tip.style.top = e.clientY + 12 + "px"; };
  const hideTip = () => { tip.style.display = "none"; };
  const groupOf = (ticket) => (String(ticket).match(/^[A-Z]+\d+/) || [""])[0];
  const slug = (id) => "run-" + id.replace(/[^A-Za-z0-9-]/g, "");
  // One decimal, trailing .0 dropped: 2/3 -> 66.7%, 1/2 -> 50%.
  const pct = (n, total) => (total ? String(Math.round((1000 * n) / total) / 10) : "0") + "%";
  // "[A5-1] 黑名單主題｜3 情境" -> "黑名單主題": the id and the scenario count have their own columns.
  const cleanTitle = (run) => String(run.title || run.ticket).replace(/^\s*\[[^\]]+\]\s*/, "").replace(/\s*[｜|]\s*\d+\s*情境\s*$/, "");
  const dot = () => el("span", { class: "dot" });
  const verdictStatus = (text) => (String(text).includes("不通過") ? "failed" : String(text).includes("無法") ? "unknown" : "passed");
  const sceneName = (scene) => String(scene).replace(/^\d+\s*/, "") || String(scene);

  const statuses = {
    passed: { label: "通過", color: "var(--er-pass)" },
    failed: { label: "不通過", color: "var(--er-fail)" },
    unknown: { label: "無法判定", color: "var(--er-warn)" },
  };

  function useLabels(data) {
    for (const [k, v] of Object.entries(data.status_labels || {})) if (statuses[k]) statuses[k].label = v;
  }

  /** Open every folded ancestor of an anchor, then scroll to it. */
  function jump(event) {
    const target = document.getElementById(event.currentTarget.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    for (let p = target.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    history.replaceState(null, "", event.currentTarget.hash);
  }

  /**
   * A card's scenarios, worst verdict first-wins. Scoring rows that share a leading
   * number are one scenario ("3 琪琪爸" and "3 小可爸"); "全段" rows are not scenarios.
   */
  function scenarios(run) {
    const rank = { passed: 0, unknown: 1, failed: 2 };
    const byKey = new Map();
    for (const v of run.verdicts || []) {
      const scene = String(v.scene || "");
      if (scene.startsWith("全段")) continue;
      const key = (scene.match(/^\d+/) || [scene])[0];
      const status = verdictStatus(v.verdict);
      const entry = byKey.get(key) || { names: [], status: "passed" };
      const name = sceneName(scene);
      if (!entry.names.includes(name)) entry.names.push(name);
      if (rank[status] > rank[entry.status]) entry.status = status;
      byKey.set(key, entry);
    }
    return [...byKey.values()].map((s) => ({ name: s.names.join("／"), status: s.status }));
  }

  /** One mark per scenario; a plain gauge when the scenarios cannot be listed one by one. */
  function meter(run, status) {
    const rate = run.rate;
    if (!rate) return el("div", { class: "meter" });
    const list = scenarios(run);
    const exact = list.length === rate.total && list.filter((s) => s.status === "passed").length === rate.passed;
    const marks = exact && rate.total <= 12
      ? el("span", { class: "pips" }, list.map((s) => el("span", { class: "pip " + s.status, title: `${s.name}：${statuses[s.status].label}` })))
      : el("span", { class: "gauge " + status }, el("i", { style: `width:${(100 * rate.passed) / (rate.total || 1)}%` }));
    return el("div", { class: "meter" }, [marks,
      el("span", { class: "fig num" }, [`${rate.passed}／${rate.total}`, el("small", { text: pct(rate.passed, rate.total) })])]);
  }

  function previewPanel(root, data) {
    let trigger, timer, pinned = false;
    const panel = el("div", { class: "panel", id: "eval-preview", role: "dialog", "aria-label": "結果預覽", hidden: "" });
    root.append(panel);
    const cancel = () => clearTimeout(timer);
    const hide = () => { cancel(); pinned = false; panel.hidden = true; trigger?.setAttribute("aria-expanded", "false"); };
    const later = () => { cancel(); if (!pinned) timer = setTimeout(hide, 250); };
    const evidenceLink = (run, turn) => el("a", {
      href: "#" + (turn ? `${slug(run.run_id)}-turn-${turn}` : slug(run.run_id)),
      text: turn ? `查看第 ${turn} 輪 →` : "查看對話 →",
      onclick: (event) => { jump(event); hide(); },
    });
    function show(node, status, group, count) {
      cancel(); trigger?.setAttribute("aria-expanded", "false"); trigger = node;
      node.setAttribute("aria-expanded", "true");
      const source = status === "passed" ? data.passed_runs || [] : status === "unknown" ? data.unknown_runs || [] : data.runs || [];
      const rows = source.filter(r => !group || groupOf(r.ticket) === group);
      const shown = status === "passed" ? rows.slice(0, 3) : rows;
      panel.className = "panel " + status;
      panel.replaceChildren(el("button", { class: "close", type: "button", "aria-label": "關閉預覽", text: "×", onclick: () => { hide(); node.focus(); hide(); } }),
        el("h3", { text: `${group || "整批"} · ${statuses[status].label} ${count} 張` }));
      panel.append(el("div", { class: "sub", text: status === "passed" ? `依資料順序預覽前 ${shown.length} 張` : `已載入 ${shown.length} 張的證據` }));
      if (!shown.length) panel.append(el("p", { text: "尚未提供對話資料，請查看原始報告。" }));
      for (const run of shown) {
        const item = el("article", { class: "preview" }, [el("span", { class: "sub", text: run.ticket + " " }), el("b", { text: cleanTitle(run) })]);
        const valid = (run.highlights || []).filter(h => (run.turns || []).some(t => t.i === h.turn && (!h.quote || t.tiger.includes(h.quote))));
        if (status !== "passed" && valid.length) {
          for (const h of valid) {
            const t = run.turns.find(t => t.i === h.turn);
            item.append(el("p", { class: "sub", text: `第 ${t.i} 輪 · ${h.rule}` }),
              el("blockquote", {}, markText(t.tiger, h.quote ? [h.quote] : [])), el("p", { text: h.why }), evidenceLink(run, t.i));
          }
        } else {
          if (run.headline) item.append(el("p", { text: run.headline }));
          const t = (run.turns || [])[0];
          if (t) item.append(el("p", { class: "sub", text: `第 ${t.i} 輪 · 孩子：${t.child}` }), el("blockquote", { text: t.tiger }));
          item.append(evidenceLink(run, t?.i));
        }
        if (run.report_url && /^https?:/.test(run.report_url)) item.append(" · ", el("a", { href: run.report_url, target: "_blank", rel: "noopener", text: "原始報告 ↗" }));
        panel.append(item);
      }
      panel.hidden = false;
      panel.scrollTop = 0;
      const box = node.getBoundingClientRect();
      const width = panel.offsetWidth, height = panel.offsetHeight;
      panel.style.left = Math.max(12, Math.min(box.left, innerWidth - width - 12)) + "px";
      panel.style.top = Math.max(12, Math.min(box.bottom + 8, innerHeight - height - 12)) + "px";
    }
    panel.addEventListener("pointerenter", cancel);
    panel.addEventListener("pointerleave", later);
    panel.addEventListener("focusin", cancel);
    panel.addEventListener("focusout", e => { if (!panel.contains(e.relatedTarget) && e.relatedTarget !== trigger) later(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { hide(); trigger?.focus(); hide(); } });
    document.addEventListener("pointerdown", e => { if (!panel.contains(e.target) && !e.target.closest("[data-preview]")) hide(); });
    window.addEventListener("resize", hide);
    return (node, status, group, count, clickOnly = false) => {
      node.setAttribute("data-preview", status);
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", `${group || "整批"} ${statuses[status].label} ${count} 張，開啟預覽`);
      node.setAttribute("aria-haspopup", "dialog");
      node.setAttribute("aria-controls", panel.id);
      node.setAttribute("aria-expanded", "false");
      const open = () => show(node, status, group, count);
      node.addEventListener("pointerenter", e => { if (!clickOnly && !pinned && e.pointerType !== "touch") open(); });
      node.addEventListener("pointerleave", later);
      node.addEventListener("focus", () => { if (!clickOnly && !pinned) open(); });
      node.addEventListener("blur", e => { if (!panel.contains(e.relatedTarget)) later(); });
      node.addEventListener("click", () => { pinned = clickOnly; open(); });
      node.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pinned = clickOnly; open(); panel.querySelector("button").focus(); }
        if (e.key === "Tab" && !e.shiftKey && !panel.hidden) { e.preventDefault(); panel.querySelector("button").focus(); }
      });
      return node;
    };
  }

  function donut(parts, bindPreview) {
    const total = parts.reduce((s, p) => s + p.n, 0) || 1;
    const r = 49, c = 2 * Math.PI * r, width = 10;
    const svg = el("svg", { viewBox: "0 0 112 112" });
    svg.append(el("circle", { cx: 56, cy: 56, r, fill: "none", stroke: "var(--line)", "stroke-width": width }));
    let offset = 0;
    for (const p of parts) {
      if (!p.n) continue;
      const len = (p.n / total) * c;
      svg.append(bindPreview(el("circle", { cx: 56, cy: 56, r, fill: "none", stroke: p.color, "stroke-width": width,
        "stroke-dasharray": `${Math.max(len - 2, 0)} ${c}`, "stroke-dashoffset": -offset }), p.status, "", p.n, true));
      offset += len;
    }
    return svg;
  }

  /** The card's average score in each batch it ran in, oldest first. */
  function sparkline(values, focusIndex) {
    const pts = values.map((v, i) => [values.length === 1 ? 48 : (i * 96) / (values.length - 1), 20 - v.y * 18]);
    const svg = el("svg", { viewBox: "0 0 96 22" });
    svg.append(el("line", { x1: 0, x2: 96, y1: 20 - 0.8 * 18, y2: 20 - 0.8 * 18, stroke: "var(--line)", "stroke-dasharray": "2 3", "stroke-width": 1 }));
    if (pts.length > 1) svg.append(el("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--mute)", "stroke-width": 1.5 }));
    pts.forEach((p, i) => svg.append(el("circle", { cx: p[0], cy: p[1], r: i === focusIndex ? 3 : 2,
      fill: i === focusIndex ? "var(--tone)" : "var(--mute)",
      onmousemove: (e) => showTip(e, `${values[i].label}\n平均 score ${values[i].y}`), onmouseleave: hideTip })));
    return svg;
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

  const line = (who, kids) => el("div", { class: "line" }, [el("span", { class: "who", text: who }), el("span", { class: "say" }, kids)]);

  /** One card's evidence: what failed, the turns that show it, and the full record folded below. */
  function runCard(run, data, status = "failed") {
    const byTurn = {};
    const misses = [];
    for (const h of run.highlights || []) {
      const turn = (run.turns || []).find((t) => t.i === h.turn);
      // No quote means the whole reply is the problem; a quote must be the reply's own words.
      if (turn && (!h.quote || turn.tiger.includes(h.quote))) (byTurn[h.turn] ||= []).push(h); else misses.push(h);
    }
    const trend = (data.series || []).filter((s) => s.tickets && run.ticket in s.tickets)
      .map((s) => ({ id: s.id, label: s.label, y: s.tickets[run.ticket] }));
    const st = run.ticket_stats;
    const source = run.report_url && /^https?:/.test(run.report_url)
      ? el("a", { href: run.report_url, target: "_blank", rel: "noopener", text: "原始報告 ↗" }) : null;
    const head = el("div", { class: "runhead" }, [
      el("div", { class: "name" }, [el("span", { class: "id", text: run.ticket }), cleanTitle(run)]),
      el("div", { class: "right num" }, [
        run.rate ? el("b", { text: `情境通過 ${run.rate.passed}／${run.rate.total} · ${pct(run.rate.passed, run.rate.total)}` }) : el("b", { text: statuses[status].label }),
        run.rate ? el("span", { text: `門檻 ${pct(run.rate.threshold, 1)}` }) : null,
        run.score == null ? null : el("span", { text: `原始 score ${run.score}` }),
        st ? el("span", { text: `歷次 ${st.passed}/${st.runs} 通過` }) : null,
        trend.length > 1 ? el("span", { class: "spark" }, sparkline(trend, trend.findIndex((t) => t.id === data.batch.id))) : null,
        source,
      ]),
    ]);

    const verdicts = run.verdicts || [];
    const problems = verdicts.filter((v) => verdictStatus(v.verdict) !== "passed");
    const findings = problems.length ? el("ul", { class: "findings" }, problems.map((v) =>
      el("li", { class: verdictStatus(v.verdict) }, [dot(),
        el("span", {}, [el("b", { text: sceneName(v.scene) }), v.rule ? `　${v.rule}` : ""]),
        v.basis ? el("span", { class: "basis", text: `判定依據：${v.basis}` }) : null]))) : null;

    const turns = run.turns || [];
    // A highlight wears its scenario's verdict: an undecided scenario is not shown as a failure.
    const toneOf = (h) => {
      const hit = verdicts.filter((v) => v.scene === h.rule).map((v) => verdictStatus(v.verdict));
      return hit.includes("failed") ? "failed" : hit.includes("unknown") ? "unknown" : status === "passed" ? "passed" : status;
    };
    const flagged = turns.filter((t) => byTurn[t.i]).map((t) => el("div", { class: "turn " + toneOf(byTurn[t.i][0]) }, [
      el("div", { class: "at", text: `第 ${t.i} 輪` }),
      line("孩子", t.child),
      line("巧虎", markText(t.tiger, byTurn[t.i].map((h) => h.quote))),
      ...byTurn[t.i].map((h) => el("div", { class: "why " + toneOf(h) }, [dot(), el("span", {}, [el("b", { text: sceneName(h.rule) }), `　${h.why}`]),
        el("a", { href: `#${slug(run.run_id)}-turn-${t.i}`, text: "看完整對話", onclick: jump })])),
    ]));

    const table = verdicts.length ? el("table", { class: "verdicts" }, verdicts.map((v) => el("tr", { class: verdictStatus(v.verdict) }, [
      el("td", {}, [dot(), statuses[verdictStatus(v.verdict)].label]),
      el("td", {}, [el("b", { text: sceneName(v.scene) }), v.rule ? `　${v.rule}` : "", v.basis ? el("div", { class: "basis", text: v.basis }) : null]),
    ]))) : null;
    const record = el("details", { class: "more" }, [
      el("summary", { text: `完整對話與逐項判定（${turns.length} 輪）` }), table,
      ...turns.map((t) => el("div", { class: "pair", id: `${slug(run.run_id)}-turn-${t.i}` }, [
        el("div", { class: "sub", text: `第 ${t.i} 輪` }), line("孩子", t.child),
        line("巧虎", markText(t.tiger, (byTurn[t.i] || []).map((h) => h.quote)))])),
    ]);
    const card = el("section", { class: `run ${status}`, id: slug(run.run_id) }, [head, findings, ...flagged, record]);
    for (const h of misses) card.append(el("div", { class: "miss", text: `引用對不上原文，沒有標示：「${h.quote}」（${h.rule}）` }));
    return card;
  }

  /** The table that says what each card is and how it did. */
  function cardRow(run, status) {
    const named = (kind, label) => {
      const names = scenarios(run).filter((s) => s.status === kind).map((s) => s.name);
      return names.length ? el("span", {}, [label, el("b", { text: names.join("、") })]) : null;
    };
    const notes = [named("failed", "未通過情境："), named("unknown", "無法判定：")].filter(Boolean);
    const note = notes.length ? el("div", { class: "miss-scenes" }, notes) : null;
    return el("a", { class: "cardrow " + status, href: "#" + slug(run.run_id), onclick: jump }, [
      el("div", { class: "what" }, [el("div", {}, [el("span", { class: "id", text: run.ticket }), el("span", { class: "title", text: cleanTitle(run) })]), note]),
      meter(run, status),
      el("span", { class: "state " + status }, [dot(), statuses[status].label]),
    ]);
  }

  function render(data) {
    useLabels(data);
    const b = data.batch;
    const unknown = b.unknown || 0;
    const failed = b.failed ?? b.runs - b.passed - unknown;
    const root = el("div", { class: "er" });
    const bindPreview = previewPanel(root, data);
    const parts = Object.entries(statuses).map(([status, info]) => ({ ...info, status, n: status === "passed" ? b.passed : status === "failed" ? failed : unknown }));
    const all = [["runs", "failed"], ["unknown_runs", "unknown"], ["passed_runs", "passed"]]
      .flatMap(([key, status]) => (data[key] || []).map((run) => ({ run, status })));
    const rated = all.filter((x) => x.run.rate);
    const scenePassed = rated.reduce((s, x) => s + x.run.rate.passed, 0);
    const sceneTotal = rated.reduce((s, x) => s + x.run.rate.total, 0);
    root.append(tip);

    root.append(el("header", {}, [
      el("div", { class: "eyebrow", text: "巧虎 Eval · 批次報表" }),
      el("h1", { text: b.label }),
      el("div", { class: "sub", text: [`${b.runs} 張卡`, sceneTotal ? `${sceneTotal} 個情境` : null, data.source ? `資料：${data.source}` : null, data.generated_at].filter(Boolean).join(" · ") }),
    ]));

    root.append(el("section", { class: "summary" }, [
      el("div", { class: "donut" }, [donut(parts, bindPreview),
        el("div", { class: "hole" }, [el("div", { class: "pct num", text: b.runs ? pct(b.passed, b.runs) : "—" }), el("div", { class: "of", text: `${statuses.passed.label} ${b.passed}／${b.runs}` })])]),
      el("div", { class: "tally" }, [
        el("div", {}, [el("h3", { text: "卡片結果" }), el("div", { class: "legend num" }, parts.map((p) =>
          bindPreview(el("div", { class: "row " + p.status }, [el("span", {}, [dot(), p.label]), el("span", { class: "n", text: `${p.n} 張` }), el("span", { class: "p", text: pct(p.n, b.runs) })]), p.status, "", p.n)))]),
        sceneTotal ? el("div", {}, [el("h3", { text: "情境通過" }),
          el("div", { class: "hero num" }, [`${scenePassed}／${sceneTotal}`, el("small", { text: pct(scenePassed, sceneTotal) })])]) : null,
      ]),
      el("div", { class: "rule sub", text: b.criterion || "門檻 score ≥ 0.8" }),
    ]));

    const groups = Object.entries(data.groups || {});
    if (groups.length) {
      const grid = el("div");
      for (const [g, name] of groups) {
        const stats = (data.group_stats || {})[g];
        if (!stats) { grid.append(el("p", { text: `${g} · ${name}（缺少分組統計）` })); continue; }
        const total = (stats.passed || 0) + (stats.failed || 0) + (stats.unknown || 0);
        const sc = stats.scenarios;
        const present = Object.keys(statuses).filter((status) => stats[status] > 0);
        grid.append(el("div", { class: "barrow" }, [
          el("div", { class: "name" }, [el("b", { text: `${g} ${name}` }), el("div", { class: "sub", text: `${total} 張卡` })]),
          el("div", {}, [
            el("div", { class: "bar" }, present.map((status) => bindPreview(el("button", { class: "segment " + status, type: "button", style: `flex:${stats[status]}` }), status, g, stats[status]))),
            el("div", { class: "barnote num" }, [
              ...present.map((status) => el("span", { class: status }, [dot(), `${statuses[status].label} ${stats[status]} 張 · ${pct(stats[status], total)}`])),
              sc ? el("span", { class: "sc", text: `情境通過 ${sc.passed}／${sc.total} · ${pct(sc.passed, sc.total)}` }) : null]),
          ]),
        ]));
      }
      root.append(el("section", {}, [el("h2", {}, ["各分類結果", el("small", { text: "指到色塊可預覽對話" })]), grid]));
    }

    if (all.length) {
      const order = (x) => { const m = String(x.run.ticket).match(/^([A-Z]+)(\d+)-?(\d+)?/) || []; return [m[1] || "~", +m[2] || 0, +m[3] || 0]; };
      const sorted = [...all].sort((p, q) => { const a = order(p), c = order(q); return a[0].localeCompare(c[0]) || a[1] - c[1] || a[2] - c[2]; });
      const list = el("div");
      let last = null;
      for (const x of sorted) {
        const g = groupOf(x.run.ticket);
        if (groups.length > 1 && g !== last) list.append(el("div", { class: "grouphead", text: `${g} ${(data.groups || {})[g] || ""}` }));
        last = g;
        list.append(cardRow(x.run, x.status));
      }
      root.append(el("section", {}, [el("h2", {}, ["各卡結果", el("small", { text: "每格是一個情境；點一列看證據" })]), list]));
    }

    root.append(el("h2", {}, [`${statuses.failed.label}的卡片與證據`, el("small", { text: `${(data.runs || []).length} 張` })]));
    for (const r of data.runs || []) root.append(runCard(r, data));
    for (const [key, status] of [["unknown_runs", "unknown"], ["passed_runs", "passed"]]) {
      const rows = data[key] || [];
      if (rows.length) root.append(el("details", { class: "extras" }, [el("summary", {}, [`${statuses[status].label}的卡片`, el("small", { text: `${rows.length} 張，點開看對話` })]), ...rows.map(r => runCard(r, data, status))]));
    }
    if (b.errors || b.cancelled) root.append(el("p", { class: "sub", text: `執行錯誤 ${b.errors || 0} · 已取消 ${b.cancelled || 0}（另列，不計入${statuses.failed.label}）` }));
    return root;
  }

  function start() {
    const style = el("style"); style.textContent = css; document.head.append(style);
    try { document.body.append(render(JSON.parse(document.getElementById("eval-report").textContent))); }
    catch (err) { document.body.append(el("pre", { text: "報表資料讀不了：" + err.message })); console.error(err); }
  }
  // The shell may load in <head> before <body> exists.
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
