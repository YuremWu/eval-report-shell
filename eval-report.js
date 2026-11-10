(function () {
  const css = `
  :root{--er-pass:var(--success,#22a06b);--er-fail:var(--destructive,#e5484d);--er-warn:var(--warning,#d6a100);
    --er-accent:var(--chart-1,#4c8bf5);--er-muted:var(--muted-foreground,#8a8f98);--er-border:var(--border,#8884);
    --er-card:var(--card,#fff);--er-bot:color-mix(in srgb,var(--foreground,#888) 7%,transparent);
    --er-kid:color-mix(in srgb,var(--er-accent) 16%,transparent);}
  .er{max-width:1100px;margin:auto;font:14px/1.6 var(--font-sans,system-ui);color:var(--foreground,inherit);display:flex;flex-direction:column;gap:18px}
  .er h2{font-size:13px;font-weight:600;margin:4px 0 0;color:var(--er-muted);letter-spacing:.02em}
  .er .sub{color:var(--er-muted);font-size:12px}
  .er a{color:var(--er-accent);text-decoration:none}.er a:hover{text-decoration:underline}

  .er .summary{display:grid;grid-template-columns:132px 1fr;gap:16px;align-items:center;
    border:1px solid var(--er-border);border-radius:var(--radius,12px);padding:16px;background:var(--er-card)}
  .er .donut{position:relative;width:132px;height:132px}
  .er .donut svg{width:100%;height:100%;transform:rotate(-90deg)}
  .er .donut .hole{pointer-events:none;position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .er .donut .pct{font-size:26px;font-weight:650;line-height:1}
  .er .donut .of{font-size:11px;color:var(--er-muted)}
  .er .legend{display:flex;flex-direction:column;gap:6px}
  .er .legend .title{font-weight:600;word-break:break-all}
  .er .legend .row{display:flex;gap:14px;flex-wrap:wrap;font-size:13px}
  .er .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:middle}
  .er .fails{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
  .er .fails a{font-size:12px;border:1px solid var(--er-border);border-radius:999px;padding:1px 9px;color:inherit}
  .er .fails a b{color:var(--er-fail);font-weight:600;margin-left:4px}

  .er .run.passed{--er-fail:var(--er-pass)}.er .run.unknown{--er-fail:var(--er-warn)}
  .er .run{border:1px solid var(--er-border);border-radius:var(--radius,12px);background:var(--er-card);overflow:hidden}
  .er .runhead{display:grid;grid-template-columns:1fr auto;gap:4px 16px;padding:12px 16px;border-bottom:1px solid var(--er-border)}
  .er .runhead .left{display:flex;flex-direction:column;gap:4px;min-width:0}
  .er .runhead .right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-align:right}
  .er .stat{font-size:12px;color:var(--er-muted);font-variant-numeric:tabular-nums}
  .er .stat b{color:var(--foreground,inherit);font-weight:600}
  .er .grp{display:inline-block;font-size:11px;font-weight:600;border-radius:4px;padding:0 6px;margin-right:6px;vertical-align:1px;
    background:color-mix(in srgb,var(--er-accent) 14%,transparent);color:var(--er-accent)}
  .er .groups{display:grid;grid-template-columns:auto 1fr auto;gap:2px 10px;font-size:12px;margin-top:6px;align-items:baseline}
  .er .groups .n{color:var(--er-fail);font-weight:600;font-variant-numeric:tabular-nums}
  .er .groups .ok{color:var(--er-muted)}
  .er .runhead .name{font-weight:600}
  .er .runhead .score{font-weight:650;color:var(--er-fail);text-align:right;font-variant-numeric:tabular-nums}
  .er .runhead .why{font-size:12px;color:var(--er-muted)}
  .er .spark svg{display:block}
  .er .spark svg{width:96px;height:22px;overflow:visible}
  .er .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
  .er .chip{font-size:12px;border-radius:999px;padding:1px 9px;border:1px solid var(--er-border);display:inline-flex;gap:5px;align-items:center}
  .er .chip.pass::before{content:"✓";color:var(--er-pass);font-weight:700}
  .er .chip.fail{border-color:var(--er-fail);color:var(--er-fail);background:color-mix(in srgb,var(--er-fail) 8%,transparent)}
  .er .chip.fail::before{content:"✕";font-weight:700}
  .er .chip.unk{border-color:var(--er-warn);color:var(--er-warn)}.er .chip.unk::before{content:"?";font-weight:700}

  .er .chat{display:flex;flex-direction:column;gap:8px;padding:14px 16px}
  .er .msg{display:flex;flex-direction:column;max-width:82%}
  .er .msg.kid{align-self:flex-end;align-items:flex-end}
  .er .msg.bot{align-self:flex-start}
  .er .who{font-size:11px;color:var(--er-muted);margin:0 4px 2px}
  .er .bubble{padding:8px 12px;border-radius:14px;white-space:pre-wrap;word-break:break-word}
  .er .kid .bubble{background:var(--er-kid);border-bottom-right-radius:4px}
  .er .bot .bubble{background:var(--er-bot);border-bottom-left-radius:4px}
  .er .bot.flag .bubble{background:color-mix(in srgb,var(--er-fail) 9%,transparent);border-left:4px solid var(--er-fail);border-radius:6px 14px 14px 6px}
  .er .badge{display:inline-block;font-size:10px;font-weight:700;color:#fff;background:var(--er-fail);border-radius:4px;padding:0 5px;margin-left:6px;vertical-align:1px}
  .er mark{background:color-mix(in srgb,var(--er-fail) 26%,transparent);color:inherit;border-radius:3px;padding:0 2px;
    text-decoration:underline;text-decoration-color:var(--er-fail);text-decoration-thickness:2px;text-underline-offset:3px}
  .er .reason{margin:6px 0 2px 4px;border:1px solid color-mix(in srgb,var(--er-fail) 45%,transparent);border-radius:8px;
    padding:6px 10px;font-size:12px;display:flex;flex-direction:column;gap:2px;background:var(--er-card)}
  .er .reason .rule{font-weight:600;color:var(--er-fail)}
  .er .reason .src{color:var(--er-muted)}
  .er .fold{align-self:center;font-size:12px;color:var(--er-muted);background:none;border:1px dashed var(--er-border);
    border-radius:999px;padding:2px 12px;cursor:pointer;font-family:inherit}
  .er .fold:hover{color:var(--foreground,inherit);border-style:solid}
  .er .miss{margin:0 16px 14px;font-size:12px;border-left:3px solid var(--er-warn);padding:4px 10px;color:var(--er-warn);
    background:color-mix(in srgb,var(--er-warn) 8%,transparent);border-radius:0 6px 6px 0}
  .er .tip{position:fixed;pointer-events:none;background:var(--popover,#222);color:var(--popover-foreground,#fff);
    border:1px solid var(--er-border);border-radius:6px;padding:4px 8px;font-size:12px;display:none;z-index:9;white-space:pre}
  .er .barrow{display:grid;grid-template-columns:180px 1fr;gap:12px;align-items:center;margin:12px 0}
  .er .bar{display:flex;height:30px;border-radius:5px;overflow:hidden;background:var(--er-border)}
  .er .segment{border:0;border-radius:0;padding:0;color:white;min-width:24px;font:inherit;cursor:pointer}
  .er [data-preview]{cursor:pointer}.er [data-preview]:focus-visible{outline:3px solid var(--er-accent);outline-offset:2px}
  .er .panel{position:fixed;z-index:1000;width:min(440px,calc(100vw - 24px));max-height:min(480px,calc(100dvh - 24px));
    overflow:auto;padding:16px;border:1px solid var(--er-border);border-radius:12px;background:var(--popover,#fff);
    color:var(--popover-foreground,#20324a);box-shadow:0 12px 40px #0003;overscroll-behavior:contain}
  .er .panel[hidden]{display:none}.er .panel h3{margin:0 32px 8px 0;font-size:15px}
  .er .panel .close{float:right;position:sticky;top:0;border:0;background:var(--popover,#fff);color:inherit;cursor:pointer;font:inherit}
  .er .preview{border-top:1px solid var(--er-border);padding:10px 0;overflow-wrap:anywhere}
  .er .preview p{margin:4px 0;white-space:pre-wrap}.er .preview blockquote{margin:6px 0;padding:8px;background:var(--er-bot);white-space:pre-wrap}
  .er .extras{border:1px solid var(--er-border);border-radius:12px;padding:12px}.er .extras>summary{cursor:pointer}
  @media(max-width:520px){.er .barrow{grid-template-columns:1fr;gap:4px}}
  @media (max-width:520px){.er .summary{grid-template-columns:1fr;justify-items:center}.er .msg{max-width:92%}}`;

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
  const shortGroup = (name) => String(name).split("：")[0];
  const slug = (id) => "run-" + id.replace(/[^A-Za-z0-9-]/g, "");

  const statuses = {
    passed: { label: "通過", color: "var(--er-pass)" },
    failed: { label: "不通過", color: "var(--er-fail)" },
    unknown: { label: "無法判定", color: "var(--er-warn)" },
  };

  function previewPanel(root, data) {
    let trigger, timer;
    const panel = el("div", { class: "panel", id: "eval-preview", role: "dialog", "aria-label": "結果預覽", hidden: "" });
    root.append(panel);
    const cancel = () => clearTimeout(timer);
    const hide = () => { cancel(); panel.hidden = true; trigger?.setAttribute("aria-expanded", "false"); };
    const later = () => { cancel(); timer = setTimeout(hide, 250); };
    const evidenceLink = (run, turn) => el("a", {
      href: "#" + (turn ? `${slug(run.run_id)}-turn-${turn}` : slug(run.run_id)),
      text: turn ? `查看第 ${turn} 輪 →` : "查看對話 →",
      onclick: (event) => {
        const target = document.getElementById(event.currentTarget.hash.slice(1));
        if (target) {
          event.preventDefault();
          for (let p = target.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          history.replaceState(null, "", event.currentTarget.hash);
        }
        hide();
      },
    });
    function show(node, status, group, count) {
      cancel(); trigger?.setAttribute("aria-expanded", "false"); trigger = node;
      node.setAttribute("aria-expanded", "true");
      const source = status === "passed" ? data.passed_runs || [] : status === "unknown" ? data.unknown_runs || [] : data.runs || [];
      const rows = source.filter(r => !group || groupOf(r.ticket) === group);
      const shown = status === "passed" ? rows.slice(0, 3) : rows;
      panel.replaceChildren(el("button", { class: "close", type: "button", "aria-label": "關閉預覽", text: "×", onclick: () => { hide(); node.focus(); hide(); } }),
        el("h3", { text: `${group || "整批"} · ${statuses[status].label} ${count} 筆` }));
      panel.append(el("div", { class: "sub", text: status === "passed" ? `依資料順序預覽前 ${shown.length} 筆` : `已載入 ${shown.length} 筆證據` }));
      if (!shown.length) panel.append(el("p", { text: "尚未提供對話資料，請查看原始報告。" }));
      for (const run of shown) {
        const item = el("article", { class: "preview" }, [el("b", { text: run.title || run.ticket })]);
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
          if (t) item.append(el("p", { class: "sub", text: `第 ${t.i} 輪 · 小朋友：${t.child}` }), el("blockquote", { text: t.tiger }));
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
    return (node, status, group, count) => {
      node.setAttribute("data-preview", status);
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-label", `${group || "整批"} ${statuses[status].label} ${count} 筆，開啟預覽`);
      node.setAttribute("aria-haspopup", "dialog");
      node.setAttribute("aria-controls", panel.id);
      node.setAttribute("aria-expanded", "false");
      const open = () => show(node, status, group, count);
      node.addEventListener("pointerenter", e => { if (e.pointerType !== "touch") open(); });
      node.addEventListener("pointerleave", later);
      node.addEventListener("focus", open);
      node.addEventListener("blur", e => { if (!panel.contains(e.relatedTarget)) later(); });
      node.addEventListener("click", open);
      node.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); panel.querySelector("button").focus(); }
        if (e.key === "Tab" && !e.shiftKey && !panel.hidden) { e.preventDefault(); panel.querySelector("button").focus(); }
      });
      return node;
    };
  }

  function donut(parts, bindPreview) {
    const total = parts.reduce((s, p) => s + p.n, 0) || 1;
    const r = 52, c = 2 * Math.PI * r;
    const svg = el("svg", { viewBox: "0 0 132 132" });
    svg.append(el("circle", { cx: 66, cy: 66, r, fill: "none", stroke: "var(--er-border)", "stroke-width": 14 }));
    let offset = 0;
    for (const p of parts) {
      if (!p.n) continue;
      const len = (p.n / total) * c;
      svg.append(bindPreview(el("circle", { cx: 66, cy: 66, r, fill: "none", stroke: p.color, "stroke-width": 14,
        "stroke-dasharray": `${Math.max(len - 2, 0)} ${c}`, "stroke-dashoffset": -offset }), p.status, "", p.n));
      offset += len;
    }
    return svg;
  }

  /** The card's average score in each batch it ran in, oldest first. */
  function sparkline(values, focusIndex) {
    const pts = values.map((v, i) => [values.length === 1 ? 48 : (i * 96) / (values.length - 1), 20 - v.y * 18]);
    const svg = el("svg", { viewBox: "0 0 96 22" });
    svg.append(el("line", { x1: 0, x2: 96, y1: 20 - 0.8 * 18, y2: 20 - 0.8 * 18, stroke: "var(--er-warn)", "stroke-dasharray": "2 3", "stroke-width": 1 }));
    if (pts.length > 1) svg.append(el("polyline", { points: pts.map((p) => p.join(",")).join(" "), fill: "none", stroke: "var(--er-accent)", "stroke-width": 1.5 }));
    pts.forEach((p, i) => svg.append(el("circle", { cx: p[0], cy: p[1], r: i === focusIndex ? 3 : 2,
      fill: i === focusIndex ? "var(--er-fail)" : "var(--er-accent)",
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

  const bubble = (side, who, kids, extra = "") =>
    el("div", { class: `msg ${side} ${extra}` }, [el("div", { class: "who" }, who), el("div", { class: "bubble" }, kids)]);

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
    const group = groupOf(run.ticket);
    const groupName = (data.groups || {})[group];
    const st = run.ticket_stats;
    const left = el("div", { class: "left" }, [
      el("div", { class: "name" }, [groupName ? el("span", { class: "grp", title: groupName, text: `${group} ${shortGroup(groupName)}` }) : null, run.title || run.ticket]),
      el("div", { class: "why", text: run.headline || "" }),
      el("div", { class: "chips" }, (run.verdicts || []).map((v) =>
        el("span", { class: "chip " + (v.verdict.includes("不通過") ? "fail" : v.verdict.includes("無法") ? "unk" : "pass"), text: v.scene }))),
    ]);
    const right = el("div", { class: "right" }, [
      el("div", { class: "score", text: run.score == null ? statuses[status].label : "這次 score " + run.score }),
      st ? el("div", { class: "stat" }, ["這張卡歷次 ", el("b", { text: `${st.passed}/${st.runs}` }), ` 通過 · ${Math.round((100 * st.passed) / st.runs)}%`]) : null,
      trend.length > 1 ? el("div", { class: "spark" }, sparkline(trend, trend.findIndex((t) => t.id === data.batch.id))) : null,
    ]);
    const head = el("div", { class: "runhead" }, [left, right]);

    const chat = el("div", { class: "chat" });
    const turns = run.turns || [];
    let quiet = [];
    const flushQuiet = () => {
      if (!quiet.length) return;
      const hidden = quiet.flatMap((t) => [bubble("kid", `孩子 · 第 ${t.i} 輪`, t.child), bubble("bot", `巧虎 · 第 ${t.i} 輪`, t.tiger)]);
      const range = quiet.length === 1 ? `第 ${quiet[0].i} 輪` : `第 ${quiet[0].i}–${quiet[quiet.length - 1].i} 輪`;
      const btn = el("button", { class: "fold", type: "button", text: `▸ ${range}沒有標記，點開看原文`,
        onclick: () => btn.replaceWith(...hidden) });
      chat.append(btn);
      quiet = [];
    };
    for (const t of turns) {
      const marks = byTurn[t.i];
      if (!marks) { quiet.push(t); continue; }
      flushQuiet();
      chat.append(bubble("kid", `孩子 · 第 ${t.i} 輪`, t.child));
      const bot = bubble("bot", [`巧虎 · 第 ${t.i} 輪`, el("span", { class: "badge", text: statuses[status].label })], markText(t.tiger, marks.map((h) => h.quote)), "flag");
      for (const h of marks) {
        bot.append(el("div", { class: "reason" }, [
          el("span", { class: "rule", text: h.rule }), el("span", { text: h.why }),
          el("span", { class: "src" }, ["來源 ", el("a", { href: run.report_url, target: "_blank", rel: "noopener", text: `${run.run_id} · 第 ${t.i} 輪` })]),
        ]));
      }
      chat.append(bot);
    }
    flushQuiet();
    const transcript = el("details", {}, [el("summary", { text: "完整對話（保留原文）" }), el("div", { class: "chat" }, turns.flatMap(t => {
      const pair = el("div", { id: `${slug(run.run_id)}-turn-${t.i}` }, [bubble("kid", `孩子 · 第 ${t.i} 輪`, t.child), bubble("bot", `巧虎 · 第 ${t.i} 輪`, markText(t.tiger, (byTurn[t.i] || []).map(h => h.quote)))]);
      return [pair];
    }))]);
    const card = el("section", { class: `run ${status}`, id: slug(run.run_id) }, [head, chat, transcript]);
    for (const h of misses) card.append(el("div", { class: "miss", text: `引用對不上原文，沒有標示：「${h.quote}」（${h.rule}）` }));
    return card;
  }

  function render(data) {
    const b = data.batch;
    const unknown = b.unknown || 0;
    const failed = b.failed ?? b.runs - b.passed - unknown;
    const root = el("div", { class: "er" });
    const bindPreview = previewPanel(root, data);
    const parts = Object.entries(statuses).map(([status, info]) => ({ ...info, status, n: status === "passed" ? b.passed : status === "failed" ? failed : unknown }));
    root.append(tip);
    root.append(el("section", { class: "summary" }, [
      el("div", { class: "donut" }, [donut(parts, bindPreview),
        el("div", { class: "hole" }, [el("div", { class: "pct", text: (b.runs ? Math.round((100 * b.passed) / b.runs) + "%" : "—") }), el("div", { class: "of", text: `${b.passed} / ${b.runs}` })])]),
      el("div", { class: "legend" }, [
        el("div", { class: "title", text: b.label }),
        el("div", { class: "row" }, parts.map(p => bindPreview(el("span", {}, [el("span", { class: "dot", style: `background:${p.color}` }), `${p.label} ${p.n}`]), p.status, "", p.n))),
        el("div", { class: "fails" }, (data.runs || []).map((r) => el("a", { href: "#" + slug(r.run_id) }, [r.ticket, el("b", { text: r.score })]))),
        el("div", { class: "sub", text: `${b.criterion || "門檻 score ≥ 0.8"} · 資料：${data.source} · ${data.generated_at}` }),
      ]),
    ]));
    const groups = Object.entries(data.groups || {});
    if (groups.length) {
      const grid = el("div");
      for (const [g, name] of groups) {
        const stats = (data.group_stats || {})[g];
        if (!stats) { grid.append(el("p", { text: `${g} · ${name}（缺少分組統計）` })); continue; }
        const total = (stats.passed || 0) + (stats.failed || 0) + (stats.unknown || 0);
        grid.append(el("div", { class: "barrow" }, [el("span", { text: `${g} · ${name} · ${total} 筆` }),
          el("div", { class: "bar" }, Object.entries(statuses).filter(([status]) => stats[status] > 0).map(([status, info]) =>
            bindPreview(el("button", { class: "segment", type: "button", text: stats[status], style: `background:${info.color};flex:${stats[status]}` }), status, g, stats[status])))
        ]));
      }
      root.append(el("section", {}, [el("h2", { text: "卡片分類與結果分布" }), grid,
        data.groups_note ? el("div", { class: "sub", text: data.groups_note }) : null]));
    }
    root.append(el("h2", { text: `沒過的 run · ${(data.runs || []).length}` }));
    for (const r of data.runs || []) root.append(runCard(r, data));
    for (const [key, status] of [["unknown_runs", "unknown"], ["passed_runs", "passed"]]) {
      const rows = data[key] || [];
      if (rows.length) root.append(el("details", { class: "extras" }, [el("summary", { text: `${statuses[status].label}案例 · ${rows.length} 筆已載入` }), ...rows.map(r => runCard(r, data, status))]));
    }
    if (b.errors || b.cancelled) root.append(el("p", { class: "sub", text: `執行錯誤 ${b.errors || 0} · 已取消 ${b.cancelled || 0}（另列，不計入不通過）` }));
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
