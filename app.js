/* ============================================================
   CU Prep OS v3 — single page, no tabs
   ============================================================ */
(function () {
  "use strict";

  var D = window.CUDATA;
  var LS = "cu-prep-os-v3";
  var root = document.getElementById("app");

  /* ---------- state ---------- */
  var state = load();
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS));
      if (raw && typeof raw === "object") {
        raw.done = raw.done || {};
        raw.apps = raw.apps || [];
        raw.review = raw.review || { v: {}, a: {}, w: {}, name: "" };
        return raw;
      }
    } catch (e) { /* ignore */ }
    return { done: {}, apps: [], review: { v: {}, a: {}, w: {}, name: "" } };
  }
  function save() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {} }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  var PREVIEW = null;
  try {
    var q = new URLSearchParams(location.search).get("date");
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) PREVIEW = q;
  } catch (e) {}
  var TODAY = PREVIEW || iso(new Date());

  function fmtDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  function shortDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  function typeLabel(t) {
    return { dsa: "DSA", stretch: "STRETCH", theory: "STUDY", dev: "AI", project: "BUILD", career: "CAREER", review: "REVIEW", ai: "AI" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  var DAYS = D.DAYS;
  var LAST_DATE = DAYS[DAYS.length - 1].date;
  var WEEK_MAP = {};
  DAYS.forEach(function (d) { (WEEK_MAP[d.week] = WEEK_MAP[d.week] || []).push(d); });

  function dayDone(d) { return d.items.filter(function (i) { return state.done[i.id]; }).length; }
  function weekStats(n) {
    var t = 0, d = 0;
    WEEK_MAP[n].forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? Math.round((d / t) * 100) : 0 };
  }
  function overall() {
    var t = 0, d = 0;
    DAYS.forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? (d / t) * 100 : 0 };
  }

  /* ---------- today ---------- */
  var TODAY_DAY = DAYS.filter(function (d) { return d.date === TODAY; })[0] || null;
  var ACTIVE_WEEK = TODAY_DAY ? TODAY_DAY.week : (TODAY < D.WEEK1 ? 1 : 22);

  /* ---------- item ---------- */
  function itemHTML(item) {
    var done = !!state.done[item.id];
    var title = item.url
      ? '<a href="' + item.url + '" target="_blank" rel="noopener">' + esc(item.title) + "</a>"
      : esc(item.title);
    var diff = item.diff ? '<span class="diff ' + item.diff + '">' + diffLabel(item.diff) + "</span>" : "";
    var go = item.url ? '<a class="go" href="' + item.url + '" target="_blank" rel="noopener">open ↗</a>' : "";
    var hint = item.hint ? '<p class="hint">' + esc(item.hint) + "</p>" : "";

    return '<li class="item' + (done ? " done" : "") + '">' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") + ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" + title + diff + "</div>" + hint + "</div>" + go + "</li>";
  }

  function dayHTML(day) {
    var isToday = day.date === TODAY;
    var isNext = !TODAY_DAY && day.date === D.WEEK1;
    var cls = "day" + (isToday ? " is-today" : "") + (isNext ? " is-next" : "") + (day.revision ? " revision" : "") + (day.light ? " light" : "");
    return '<article class="' + cls + '" id="d-' + day.date + '">' +
      '<div class="day-head"><div class="left">' +
      '<span class="pill">' + esc(day.title) + "</span>" +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="chip accent">TODAY</span>' : "") +
      (isNext ? '<span class="chip accent">STARTS TOMORROW</span>' : "") +
      (day.time ? '<span class="chip">' + day.time + "</span>" : "") +
      '</div><span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></div>" +
      '<ul class="items">' + day.items.map(itemHTML).join("") + "</ul></article>";
  }

  /* ---------- week ---------- */
  function chips(list, cls) {
    return list.map(function (x) { return '<span class="tchip ' + (cls || "") + '">' + esc(x) + "</span>"; }).join("");
  }

  function weekSummaryHTML(w) {
    var rows = [];

    if (w.mode === "sprint") {
      rows.push(["Focus", w.days.map(function (d) { return d.t; }).join(" · ")]);
      rows.push(["Type", "Revision, mocks and applications — no new topics"]);
    } else {
      var names = w.problems.map(function (p) { return p.title; });
      rows.push(["DSA", w.problems.length + " problems: " + names.join(" · ")]);
      rows.push(["Study", w.cs + " — " + w.csTopics.map(function (c) { return c.label; }).join(" · ")]);
      if (w.ai) rows.push(["AI", w.ai.join(" · ")]);
      if (w.career) rows.push(["Career", w.career.join(" · ")]);
      if (w.project) rows.push(["Deliverable", w.project]);
      if (w.stretch) rows.push(["Stretch", w.stretch.title + " (optional)"]);
    }

    return '<div class="wk-sum">' + rows.map(function (r) {
      return '<div class="sum-row"><span class="sum-k">' + esc(r[0]) + '</span><span class="sum-v">' + esc(r[1]) + "</span></div>";
    }).join("") + "</div>";
  }

  function weekHTML(w) {
    var days = WEEK_MAP[w.n];
    var st = weekStats(w.n);
    var isActive = w.n === ACTIVE_WEEK;
    var badge = w.mode === "exam" ? '<span class="wtag exam">EXAMS · 40 MIN/DAY</span>'
      : w.mode === "transition" ? '<span class="wtag trans">TRANSITION</span>'
      : w.mode === "sprint" ? '<span class="wtag sprint">SPRINT</span>' : "";

    return '<section class="wk' + (isActive ? " open active" : "") + '" id="w' + w.n + '" data-week="' + w.n + '">' +
      '<div class="wk-head" data-toggle="' + w.n + '">' +
      '<div class="wk-left">' +
      '<span class="wk-num">W' + w.n + "</span>" +
      '<div class="wk-title"><h3>' + esc(w.theme) + "</h3>" +
      '<div class="wk-dates">' + shortDate(days[0].date) + " → " + shortDate(days[6].date) +
      ' <span class="dot2">·</span> ' + esc(w.goal) + "</div></div>" +
      "</div>" +
      '<div class="wk-right">' + badge +
      '<div class="mini-bar"><div style="width:' + st.pct + '%"></div></div>' +
      '<span class="day-count">' + st.done + "/" + st.total + "</span>" +
      '<span class="caret">▾</span></div>' +
      "</div>" +
      (w.note ? '<div class="wk-note">' + esc(w.note) + "</div>" : "") +
      weekSummaryHTML(w) +
      '<div class="wk-body">' + days.map(dayHTML).join("") + "</div>" +
      "</section>";
  }

  /* ---------- overview ---------- */
  function overviewHTML() {
    var o = overall();
    var problems = 0, studied = 0;
    D.WEEKS.forEach(function (w) { if (w.problems) problems += w.problems.length; });

    var html = '<section id="overview">';
    html += '<div class="hero">' +
      '<div class="kicker">16 Nov 2026 → 18 Apr 2027 · 22 weeks</div>' +
      "<h1>Everything you have to do, in one place</h1>" +
      '<p class="lead">One page, no tabs. Weeks 1–3 are your endsems, so they are 40 minutes a day and nothing more. Week 4 is your last paper — the 5-month block starts <b>Dec 8</b>. Every problem appears exactly once; the only repeats are labelled <i>re-solve</i> on purpose.</p>' +
      '<div class="meta"><span class="chip accent">' + problems + ' new problems</span>' +
      '<span class="chip info">22 weeks</span><span class="chip">6 CS areas</span>' +
      '<span class="chip warn">2 deployed AI projects</span><span class="chip">' + o.total + ' tasks</span></div>' +
      "</div>";

    html += '<div class="callout warn"><b>Read this once:</b> during exams (Nov 16 – Dec 6) your only job is 40 minutes a day. Do not start the full plan early. The plan is built so that week 4 begins at <i>day one</i>, not at a backlog.</div>';

    html += '<h2>The shape of it</h2><div class="phases">' +
      [["W1-3", "Exams", "21 easy problems · Python · first LLM call", "40 min/day"],
       ["W4-9", "Foundations", "Arrays to backtracking · DBMS · embeddings and RAG", "2h 45m/day"],
       ["W10-15", "Depth", "Linked lists to greedy · OS, CN, OOP · agents, evals, guardrails", "2h 45m/day"],
       ["W16-19", "Hard part", "Graphs, DP, tries · LLD, HLD · deploy P2, red-team", "2h 45m/day"],
       ["W20-22", "Proof", "Repair, 5 mocks, portfolio, 45+ applications", "~3h/day"]].map(function (p) {
        return '<div class="phase"><div class="ph-w">' + p[0] + '</div><h4>' + esc(p[1]) + "</h4><p>" + esc(p[2]) + '</p><span class="ph-t">' + esc(p[3]) + "</span></div>";
      }).join("") + "</div>";

    html += "<h2>Everything you'll study, at a glance</h2>";
    html += '<div class="grid">' +
      '<div class="card"><h4>DSA — ' + problems + ' problems</h4><p>Two per day, six days a week, one revision day.</p><ul>' +
      ["Arrays, hashing, prefix sums", "Two pointers, sliding window", "Strings, matrices", "Sorting, binary search, BS on answer",
       "Recursion, backtracking", "Linked lists, stacks, queues", "Trees, BST", "Heaps, greedy",
       "Graphs (BFS/DFS, topo, union-find, Dijkstra)", "DP (1D, knapsack, LCS, grid)", "Tries, bits"].map(function (x) { return "<li>" + x + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card"><h4>CS — 6 areas</h4><p>30 minutes a day, rotated.</p><ul>' +
      D.CS.map(function (c) { return "<li><b>" + esc(c.name) + "</b> — " + esc(c.weeks) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card"><h4>AI track — 16 weeks</h4><p>3 × 45 min a week, runs in parallel.</p><ul>' +
      ["Python for AI", "LLM APIs, streaming, cost", "Embeddings, chunking, vector DB", "Retrieval quality, reranking, citations",
       "Tool calling, ReAct by hand", "LangGraph, memory, HITL", "FastAPI in production shape", "Evals, LLM-as-judge, tracing",
       "Guardrails, injection, PII", "Docker, CI, deploy"].map(function (x) { return "<li>" + x + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card"><h4>Proof of work</h4><p>What you actually have on 18 April.</p><ul>' +
      ["P1 agent deployed with eval score", "P2 narrow agent + eval report", "2 READMEs with numbers", "Demo video",
       "Resume v5", "45+ applications", "5 mock interviews", "Answer bank in your own words"].map(function (x) { return "<li>" + x + "</li>"; }).join("") +
      "</ul></div></div>";

    html += "<h2>The 22 weeks</h2>";
    html += '<div class="tablewrap"><table class="idx"><thead><tr><th>Wk</th><th>Dates</th><th>Theme</th><th class="num">DSA</th><th>Study</th><th>AI / Build</th></tr></thead><tbody>' +
      D.WEEKS.map(function (w) {
        var days = WEEK_MAP[w.n];
        var ai = w.mode === "sprint" ? "Mock + repair" : (w.ai ? w.ai[0].split(".")[0] : "—");
        return '<tr class="idxrow" data-goto="w' + w.n + '">' +
          '<td><span class="pill sm">W' + w.n + "</span></td>" +
          '<td class="dim">' + shortDate(days[0].date) + " – " + shortDate(days[6].date) + "</td>" +
          "<td><b>" + esc(w.theme) + "</b>" + (w.mode === "exam" ? ' <span class="wtag exam sm">EXAMS</span>' : "") + "</td>" +
          '<td class="num">' + (w.problems ? w.problems.length : "—") + "</td>" +
          "<td>" + esc(w.cs) + "</td>" +
          '<td class="dim">' + esc(ai) + "</td></tr>";
      }).join("") + "</tbody></table></div>";

    html += '<div class="callout"><b>How to read a week:</b> every week opens with exactly what you study that week — the problem list, the CS topics, the AI task and the deliverable. Click the header to see the seven days.</div>';
    return html + "</section>";
  }

  /* ---------- reference sections ---------- */
  function csHTML() {
    return '<section id="cs"><h2>CS fundamentals</h2>' +
      '<p class="lead">Coding gets you shortlisted. These get you the offer. 30 minutes a day, one topic at a time, in your own words.</p>' +
      '<div class="grid">' + D.CS.map(function (c) {
        return '<div class="card"><h4>' + esc(c.name) + '</h4><p class="dim tiny">' + esc(c.weeks) + "</p><ul>" +
          c.topics.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
          '</ul><div class="links">' + c.links.map(function (l) {
            return '<a href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
          }).join("") + "</div></div>";
      }).join("") + "</div>" +
      '<div class="callout"><b>The test:</b> close everything and explain "what happens when you type a URL", "why is a HashMap lookup O(1)", and "walk me through your login flow" out loud in 90 seconds each.</div></section>';
  }

  function aiHTML() {
    var html = '<section id="ai"><h2>The AI track</h2>' +
      '<p class="lead">' + D.AI.thesis + "</p>" +
      '<div class="links">' + D.AI.stack.map(function (s) { return "<a>" + esc(s) + "</a>"; }).join("") + "</div></div>" +
      '<div class="callout warn"><b>Reality check:</b> ' + D.AI.reality + "</div>";
    html += '<h2>Two projects</h2><div class="grid">' + D.AI.projects.map(function (p) {
      return '<div class="card"><h4>' + esc(p.name) + "</h4><p>" + esc(p.d) + "</p></div>";
    }).join("") + "</div>";
    html += '<h2>What to skip</h2><div class="callout bad">' + D.AI.skip.map(function (s) { return "• " + esc(s); }).join("<br>") + "</div>";
    html += '<div class="callout"><b>How it gets interviewed:</b> nobody asks "what is RAG". They ask "why did retrieval fail on this query", "how do you stop the agent looping", "what does your eval score mean", "what happens when the model picks the wrong tool", "what did one request cost".</div>';
    return html + "</section>";
  }

  function resourcesHTML() {
    var html = '<section id="links"><h2>Every link</h2><p class="lead">Bookmark this section. If a resource doesn\'t fit you, use it anyway — switching resources is procrastination in disguise.</p>';
    html += D.RESOURCES.map(function (g) {
      return "<h3>" + esc(g.group) + '</h3><div class="grid">' + g.items.map(function (it) {
        return '<div class="card tight"><h4><a href="' + it.url + '" target="_blank" rel="noopener">' + esc(it.label) + "</a></h4>" +
          (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div>";
      }).join("") + "</div>";
    }).join("");
    html += '<h2>The rules</h2><div class="callout">' + D.RULES.map(function (r) { return "• " + esc(r); }).join("<br>") + "</div>";
    html += '<h2>Checkpoints</h2><div class="grid">' + D.MILESTONES.map(function (m) {
      return '<div class="card"><h4>' + esc(m.when) + "</h4><ul>" + m.checks.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div></section>";
    return html;
  }

  /* ---------- review ---------- */
  var VERDICTS = [
    ["overall", "Overall verdict", ["Keep as is", "Compress to 4 months", "Expand to 5.5-6 months", "Restructure"]],
    ["dsa", "DSA volume (228 problems)", ["Too little", "About right", "Too much"]],
    ["cs", "CS depth", ["Too shallow", "About right", "Too deep"]],
    ["ai", "AI load (3 x 45 min/week)", ["Too little", "About right", "Too much - DSA will suffer"]],
    ["exam", "Exam weeks (40 min/day)", ["Too light", "About right", "Too heavy for endsems"]],
    ["time", "Time budget (2h 45m/day)", ["Unrealistic", "Tight but doable", "Comfortable"]],
    ["apply", "Applications from week 8", ["Too late", "About right", "Too early"]]
  ];

  function rv(sec, key) {
    var r = state.review;
    return (r && r[sec] && r[sec][key]) || "";
  }

  function reviewMarkdown() {
    var L = [];
    L.push("# CU Prep OS - audit");
    L.push("");
    L.push("**Reviewer:** " + (state.review.name || "(unnamed)"));
    L.push("**Date:** " + iso(new Date()));
    L.push("");
    L.push("## Verdicts");
    VERDICTS.forEach(function (v) { L.push("- **" + v[1] + ":** " + (rv("v", v[0]) || "-")); });
    L.push("");
    L.push("## Biggest risk"); L.push(rv("a", "risk") || "-");
    L.push(""); L.push("## What to cut"); L.push(rv("a", "cut") || "-");
    L.push(""); L.push("## What is missing"); L.push(rv("a", "add") || "-");
    L.push(""); L.push("## Final instruction"); L.push(rv("a", "final") || "-");
    L.push(""); L.push("## Week by week");
    L.push(""); L.push("| Week | Theme | Comment |"); L.push("| --- | --- | --- |");
    D.WEEKS.forEach(function (w) {
      var c = rv("w", String(w.n));
      if (c) L.push("| W" + w.n + " | " + w.theme + " | " + c.replace(/\|/g, "/").replace(/\n/g, " ") + " |");
    });
    L.push(""); L.push("---"); L.push("Generated from the CU Prep OS site.");
    return L.join("\n");
  }

  function reviewHTML() {
    var html = '<section id="review"><h2>Review this plan</h2>' +
      '<p class="lead">If someone is auditing this for you: pick a verdict on each line, comment on the weeks you disagree with, then <b>Download</b> and send the file back. Nothing leaves this browser until you do.</p>';

    html += '<div class="form"><input type="text" id="rvName" placeholder="Your name" value="' + esc(state.review.name || "") + '" style="flex:1;min-width:220px"></div>';

    html += '<div class="grid">' + VERDICTS.map(function (v) {
      var cur = rv("v", v[0]);
      return '<div class="card"><h4>' + esc(v[1]) + '</h4><select data-rk="v:' + v[0] + '" style="width:100%">' +
        '<option value="">— pick —</option>' +
        v[2].map(function (o) { return '<option value="' + esc(o) + '"' + (cur === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
        "</select></div>";
    }).join("") + "</div>";

    html += [["risk", "Biggest risk", "Be blunt. What breaks first?"],
             ["cut", "What should be cut?", "Which weeks are wasted effort?"],
             ["add", "What is missing?", "Anything a CU student must do that isn't here?"],
             ["final", "Final instruction", "One paragraph to read every Monday."]].map(function (a) {
      return '<div class="card" style="margin-bottom:12px"><h4>' + esc(a[1]) + "</h4><p>" + esc(a[2]) + "</p>" +
        '<textarea data-rk="a:' + a[0] + '" rows="3" placeholder="...">' + esc(rv("a", a[0])) + "</textarea></div>";
    }).join("");

    html += "<h3>Week by week</h3><p class=\"dim tiny\">Comment only where you disagree. Empty means approved.</p>";
    html += '<div class="wklist">' + D.WEEKS.map(function (w) {
      return '<div class="wkrow"><span class="pill sm">W' + w.n + "</span>" +
        '<input type="text" data-rk="w:' + w.n + '" placeholder="' + esc(w.theme) + '" value="' + esc(rv("w", String(w.n))) + '">' +
        "</div>";
    }).join("") + "</div>";

    html += '<div class="form" style="margin-top:20px"><button id="rvDownload">Download review .md</button>' +
      '<button id="rvCopy" class="ghost">Copy as text</button>' +
      '<button id="rvClear" class="ghost">Clear</button>' +
      '<span id="rvStatus" class="dim tiny" style="align-self:center"></span></div>';

    html += '<div class="callout"><b>To send it back:</b> Download produces <code>cu-prep-audit-YYYY-MM-DD.md</code> — every verdict and comment in one readable file. WhatsApp it, email it, paste it.</div></section>';
    return html;
  }

  /* ---------- nav ---------- */
  function navHTML() {
    var parts = ['<a href="#overview" class="navchip">Overview</a>'];
    D.WEEKS.forEach(function (w) {
      parts.push('<a href="#w' + w.n + '" class="navchip' + (w.n === ACTIVE_WEEK ? " on" : "") + '" data-nav="' + w.n + '">W' + w.n + "</a>");
    });
    parts.push('<a href="#cs" class="navchip">CS</a>');
    parts.push('<a href="#ai" class="navchip">AI</a>');
    parts.push('<a href="#links" class="navchip">Links</a>');
    parts.push('<a href="#review" class="navchip">Review</a>');
    return parts.join("");
  }

  /* ---------- render ---------- */
  function render() {
    var html = "";
    html += overviewHTML();
    html += '<section id="plan"><div class="plan-head"><h2>The plan, week by week</h2>' +
      '<div class="plan-tools"><button id="expandAll" class="ghost">Expand all</button>' +
      '<button id="collapseAll" class="ghost">Collapse all</button></div></div>' +
      '<p class="lead">Each week tells you exactly what to study before you see the days. Click a week to open it.</p>' +
      D.WEEKS.map(weekHTML).join("") + "</section>";
    html += csHTML();
    html += aiHTML();
    html += resourcesHTML();
    html += reviewHTML();

    root.innerHTML = html;
    document.getElementById("navchips").innerHTML = navHTML();
    refreshHeader();
  }

  function refreshHeader() {
    var o = overall();
    document.getElementById("overallbar").style.width = o.pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " (" + (o.pct > 0 && o.pct < 10 ? o.pct.toFixed(1) : Math.round(o.pct)) + "%)";

    var left = D.diffDays(TODAY, D.PLACEMENT_SEASON);
    document.getElementById("countdown").textContent = left > 0 ? left + " days to placement season" : "placement season";

    var label;
    if (TODAY < D.WEEK1) label = "Starts " + fmtDate(D.WEEK1);
    else if (TODAY > LAST_DATE) label = "22 weeks done — Phase 3";
    else {
      var idx = D.diffDays(D.WEEK1, TODAY) + 1;
      label = "Day " + idx + " of 154 · " + (TODAY_DAY ? TODAY_DAY.title : "");
    }
    document.getElementById("todayLabel").textContent = (PREVIEW ? "Preview · " : "") + label;
  }

  /* ---------- events ---------- */
  document.addEventListener("change", function (e) {
    var cb = e.target;
    if (!cb.matches || !cb.matches('input[type="checkbox"][data-id]')) return;
    var id = cb.getAttribute("data-id");
    if (cb.checked) state.done[id] = true; else delete state.done[id];
    save();

    var li = cb.closest(".item");
    if (li) li.classList.toggle("done", cb.checked);

    var card = cb.closest(".day");
    if (card) {
      var boxes = card.querySelectorAll('input[type="checkbox"]');
      var checked = card.querySelectorAll('input[type="checkbox"]:checked');
      var cnt = card.querySelector(".day-count");
      if (cnt) cnt.textContent = checked.length + "/" + boxes.length;
    }
    var wk = cb.closest(".wk");
    if (wk) {
      var n = Number(wk.getAttribute("data-week"));
      var st = weekStats(n);
      var wcnt = wk.querySelector(".wk-head .day-count");
      var bar = wk.querySelector(".mini-bar > div");
      if (wcnt) wcnt.textContent = st.done + "/" + st.total;
      if (bar) bar.style.width = st.pct + "%";
    }
    refreshHeader();
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.id === "rvName") { state.review.name = el.value; save(); return; }
    var rk = el.getAttribute && el.getAttribute("data-rk");
    if (!rk) return;
    var p = rk.split(":");
    state.review[p[0]] = state.review[p[0]] || {};
    state.review[p[0]][p[1]] = el.value;
    save();
    var st = document.getElementById("rvStatus");
    if (st) st.textContent = "saved";
  });

  document.addEventListener("click", function (e) {
    var tg = e.target.closest("[data-toggle]");
    if (tg) {
      var sec = tg.closest(".wk");
      if (sec) sec.classList.toggle("open");
      var n = sec.getAttribute("data-week");
      var chip = document.querySelector('[data-nav="' + n + '"]');
      if (chip) chip.classList.toggle("visited", sec.classList.contains("open"));
      return;
    }

    var goto = e.target.closest("[data-goto]");
    if (goto) {
      var id = goto.getAttribute("data-goto");
      var sec2 = document.getElementById(id);
      if (sec2) {
        sec2.classList.add("open");
        sec2.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (e.target.id === "expandAll") {
      document.querySelectorAll(".wk").forEach(function (w) { w.classList.add("open"); });
      return;
    }
    if (e.target.id === "collapseAll") {
      document.querySelectorAll(".wk").forEach(function (w) { w.classList.remove("open"); });
      return;
    }
    if (e.target.id === "jumpToday") {
      var target = document.getElementById("w" + ACTIVE_WEEK);
      if (target) { target.classList.add("open"); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }
    if (e.target.id === "topBtn") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    if (e.target.id === "rvDownload") {
      var text = reviewMarkdown();
      var name = "cu-prep-audit-" + iso(new Date()) + ".md";
      var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      var s1 = document.getElementById("rvStatus"); if (s1) s1.textContent = "downloaded " + name;
      return;
    }
    if (e.target.id === "rvCopy") {
      var t = reviewMarkdown();
      var s2 = document.getElementById("rvStatus");
      function fb() {
        var ta = document.createElement("textarea");
        ta.value = t; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); if (s2) s2.textContent = "copied"; }
        catch (err) { if (s2) s2.textContent = "copy failed - use Download"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { if (s2) s2.textContent = "copied"; }, fb);
      } else fb();
      return;
    }
    if (e.target.id === "rvClear") {
      if (!confirm("Clear the whole review?")) return;
      state.review = { v: {}, a: {}, w: {}, name: "" };
      save();
      render();
      document.getElementById("review").scrollIntoView();
      return;
    }
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all checkmarks and the application log? This cannot be undone.")) return;
    state = { done: {}, apps: [], review: { v: {}, a: {}, w: {}, name: "" } };
    save();
    location.reload();
  });

  document.getElementById("jumpToday").addEventListener("click", function () {});

  render();
})();
