/* ============================================================
   Zero to Offer — single page, no tabs
   ============================================================ */
(function () {
  "use strict";

  var D = window.CUDATA;
  var LS = "zero-to-offer-v1";
  var root = document.getElementById("app");

  /* ---------- state ---------- */
  var state = load();
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS));
      if (raw && typeof raw === "object") {
        raw.done = raw.done || {};
        raw.review = raw.review || { v: {}, a: {}, w: {}, name: "" };
        return raw;
      }
    } catch (e) { /* ignore */ }
    return { done: {}, review: { v: {}, a: {}, w: {}, name: "" } };
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
    return { dsa: "DSA", stretch: "STRETCH", theory: "STUDY", dev: "AI", project: "BUILD", career: "CAREER", review: "REVIEW", ai: "AI", watch: "WATCH" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  var DAYS = D.DAYS;
  var LAST_DATE = DAYS[DAYS.length - 1].date;
  var WEEK_MAP = {};
  DAYS.forEach(function (d) { (WEEK_MAP[d.week] = WEEK_MAP[d.week] || []).push(d); });

  var PROBLEM_COUNT = 0;
  D.WEEKS.forEach(function (w) { if (w.problems) PROBLEM_COUNT += w.problems.length; });

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
    var vid = item.vtitle
      ? '<p class="vid">▶ ' + (item.vauthor ? "<b>" + esc(item.vauthor) + "</b> · " : "") + esc(item.vtitle) + "</p>"
      : "";

    return '<li class="item' + (done ? " done" : "") + '">' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") + ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" + title + diff + "</div>" + vid + hint + "</div>" + go + "</li>";
  }

  function colBox(num, name, cls, items) {
    return '<div class="dcol ' + cls + '">' +
      '<div class="dcol-h"><span class="dnum">' + num + "</span>" + name + "</div>" +
      (items.length ? '<ul class="items">' + items.join("") + "</ul>" : '<div class="dempty">—</div>') +
      "</div>";
  }

  function dayHTML(day) {
    var isToday = day.date === TODAY;
    var isNext = !TODAY_DAY && day.date === D.WEEK1;
    var cols = { dsa: [], cs: [], dev: [] };
    day.items.forEach(function (it) { (cols[it.track] || cols.dev).push(itemHTML(it)); });

    var cls = "day" + (isToday ? " is-today" : "") + (isNext ? " is-next" : "") + (day.revision ? " revision" : "") + (day.light ? " light" : "");
    return '<article class="' + cls + '" id="d-' + day.date + '">' +
      '<div class="day-head"><div class="left">' +
      '<span class="pill">' + esc(day.title) + "</span>" +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="pill" style="color:var(--accent);border-color:rgba(61,220,151,.35)">TODAY</span>' : "") +
      (isNext ? '<span class="pill" style="color:var(--accent);border-color:rgba(61,220,151,.35)">STARTS TOMORROW</span>' : "") +
      (day.time ? '<span class="day-date">· ' + day.time + "</span>" : "") +
      '</div><span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></div>" +
      '<div class="day-cols">' +
      colBox("01", "DSA", "dsa", cols.dsa) +
      colBox("02", "CS", "cs", cols.cs) +
      colBox("03", "DEV", "dev", cols.dev) +
      "</div></article>";
  }

  /* ---------- week summary ---------- */
  function pchip(p) {
    return '<span class="pchip ' + p.diff + '">' + esc(p.title) + '<span class="d">' + diffLabel(p.diff) + "</span></span>";
  }
  function cchip(c) { return '<span class="cchip">' + esc(c.label) + "</span>"; }

  function weekSummaryHTML(w) {
    var watchLink = w.pre
      ? '<a href="' + w.pre.url + '" target="_blank" rel="noopener">' + esc(w.pre.vtitle) + '</a><span class="a"> · ' + esc(w.pre.vauthor) + "</span>"
      : "—";

    if (w.mode === "sprint") {
      var by = { dsa: [], cs: [], dev: [] };
      var seen = {};
      w.days.forEach(function (d) {
        d.items.forEach(function (it) {
          var key = it.type + "|" + it.title;
          if (seen[key]) return; seen[key] = 1;
          var tr = it.type === "theory" ? "cs" : (it.type === "review" ? "dsa" : "dev");
          by[tr].push(esc(it.title));
        });
      });
      return '<div class="wk-sum three">' +
        '<div class="wbox dsa"><div class="wbox-h">01 · DSA</div><div class="wbox-b"><div class="sumline">Re-solving only — cold, timed, out loud.</div><div class="sumline">Bar: medium under 30 min, easy under 15.</div></div></div>' +
        '<div class="wbox cs"><div class="wbox-h">02 · CS</div><div class="wbox-b">' + (by.cs.length ? by.cs.map(function (x) { return '<div class="sumline">' + x + "</div>"; }).join("") : '<div class="dim">—</div>') + "</div></div>" +
        '<div class="wbox dev"><div class="wbox-h">03 · DEV</div><div class="wbox-b">' + (by.dev.length ? by.dev.map(function (x) { return '<div class="sumline">' + x + "</div>"; }).join("") : '<div class="dim">—</div>') + "</div></div>" +
        "</div>";
    }

    var b1 = '<div class="wbox dsa"><div class="wbox-h">01 · DSA</div><div class="wbox-b">' +
      '<div class="trow"><span class="sum-k">Pattern</span><div class="sum-v plain">' + esc(w.pattern) + "</div></div>" +
      '<div class="trow"><span class="sum-k">Watch 1st</span><div class="sum-v plain">' + watchLink + "</div></div>" +
      '<div class="trow"><span class="sum-k">Problems</span><div class="sum-v">' +
        '<span class="sumcount">' + w.problems.length + "</span>" + w.problems.map(pchip).join("") + "</div></div>" +
      '<div class="trow"><span class="sum-k">Day 7</span><div class="sum-v plain">' +
        (w.n >= 10 ? "Timed set: 2 unseen mediums, 60 min" : "Re-solve 3 cold") + "</div></div></div></div>";

    var b2 = '<div class="wbox cs"><div class="wbox-h">02 · CS</div><div class="wbox-b">' +
      '<div class="sum-v">' + w.csTopics.map(cchip).join("") + "</div></div></div>";

    var b3 = '<div class="wbox dev"><div class="wbox-h">03 · DEV</div><div class="wbox-b">' +
      (w.ai ? '<div class="trow"><span class="sum-k">Build</span><div class="sum-v plain">' + w.ai.map(function (a) { return '<div class="sumline">' + esc(a) + "</div>"; }).join("") + "</div></div>" : "") +
      (w.career ? '<div class="trow"><span class="sum-k">Career</span><div class="sum-v plain">' + w.career.map(function (a) { return '<div class="sumline">' + esc(a) + "</div>"; }).join("") + "</div></div>" : "") +
      (w.project ? '<div class="trow"><span class="sum-k">Ship</span><div class="sum-v"><span class="cchip" style="border-color:rgba(245,181,69,.3);color:#e8cf9e">' + esc(w.project) + "</span></div></div>" : "") +
      "</div></div>";

    return '<div class="wk-sum three">' + b1 + b2 + b3 + "</div>";
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
      '<div class="wk-left"><span class="wk-num">W' + w.n + "</span>" +
      '<div class="wk-title"><h3>' + esc(w.theme) + "</h3>" +
      '<div class="wk-dates">' + shortDate(days[0].date) + " → " + shortDate(days[6].date) + " · " + esc(w.goal) + "</div></div></div>" +
      '<div class="wk-right">' + badge +
      '<div class="mini-bar"><div style="width:' + st.pct + '%"></div></div>' +
      '<span class="day-count">' + st.done + "/" + st.total + "</span>" +
      '<span class="caret">▾</span></div></div>' +
      (w.note ? '<div class="wk-note">' + esc(w.note) + "</div>" : "") +
      weekSummaryHTML(w) +
      '<div class="wk-body">' + days.map(dayHTML).join("") + "</div></section>";
  }

  /* ---------- overview ---------- */
  function overviewHTML() {
    var html = '<section id="overview">';

    html += "<h2>The three projects</h2>";
    html += '<div class="grid three">' +
      '<div class="card proj"><div class="proj-n">01</div><h4>DSA</h4><p class="proj-tag">The gate. 90% of the interview.</p><ul>' +
      [PROBLEM_COUNT + " problems, two a day", "Striver A2Z to learn · NeetCode 150 to revise", "Aditya Verma for DP, recursion, stacks",
       "Timed set every week from W10", "Bar: easy under 15 min, medium under 30"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card proj"><div class="proj-n">02</div><h4>CS</h4><p class="proj-tag">One round of the loop.</p><ul>' +
      ["6 areas, 30 minutes a day", "Gate Smashers for OS, DBMS, CN", "LeetCode SQL 50 for queries",
       "Java internals and OOP", "AI fundamentals for AI interviews"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card proj"><div class="proj-n">03</div><h4>DEV</h4><p class="proj-tag">The differentiator.</p><ul>' +
      ["Agentic AI: RAG, agents, evals", "Two deployed projects with eval scores", "LLD and HLD",
       "Java for DSA, Python for AI", "Applications from week 8"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div></div>";

    html += "<h2>All 22 weeks</h2>";
    html += '<div class="tablewrap"><table><thead><tr><th>Week</th><th>Dates</th><th>Theme</th><th>Problems</th></tr></thead><tbody>' +
      D.WEEKS.map(function (w) {
        var days = WEEK_MAP[w.n];
        return '<tr class="idxrow" data-goto="w' + w.n + '">' +
          '<td><span class="pill sm">W' + w.n + "</span></td>" +
          '<td class="dim">' + shortDate(days[0].date) + " – " + shortDate(days[6].date) + "</td>" +
          "<td>" + esc(w.theme) + (w.mode === "exam" ? ' <span class="wtag exam" style="font-size:9px;padding:1px 6px">EXAMS</span>' : "") + "</td>" +
          '<td class="num">' + (w.problems ? w.problems.length : "—") + "</td></tr>";
      }).join("") + "</tbody></table></div>";

    html += "</section>";
    return html;
  }

  function faangHTML() {
    var html = '<section id="faang"><h2>The FAANG bar</h2>' +
      '<p class="lead">' + D.FAANG.thesis + "</p>";
    html += '<h3>Three routes in</h3><div class="grid">' + D.FAANG.route.map(function (r) {
      return '<div class="card"><h4>' + esc(r[0]) + '</h4><p class="dim tiny">' + esc(r[1]) + "</p><p>" + esc(r[2]) + "</p></div>";
    }).join("") + "</div>";
    html += '<h3>The interview loop, honestly</h3><div class="steps">' + D.FAANG.loop.map(function (l, i) {
      return '<div class="step"><span class="stnum">' + (i + 1) + '</span><div><h4>' + esc(l[0]) + "</h4><p>" + esc(l[1]) + "</p></div></div>";
    }).join("") + "</div>";
    html += '<h3>The bar you are training for</h3><div class="callout">' + D.FAANG.bar.map(function (b) { return "• " + esc(b); }).join("<br>") + "</div>";
    html += '<h3>STAR — for the round everyone underestimates</h3><div class="grid">' + D.FAANG.star.map(function (x) {
      return '<div class="card tight"><h4>' + esc(x[0]) + "</h4><p>" + esc(x[1]) + "</p></div>";
    }).join("") + "</div></section>";
    return html;
  }

  function csHTML() {
    return '<section id="cs"><h2>CS fundamentals</h2>' +
      '<p class="lead">Coding gets you shortlisted. These get you the offer. Thirty minutes a day, one topic at a time, in your own words.</p>' +
      '<div class="grid">' + D.CS.map(function (c) {
        return '<div class="card"><h4>' + esc(c.name) + '</h4><p class="dim tiny">' + esc(c.weeks) + "</p><ul>" +
          c.topics.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
          '</ul><div class="links">' + c.links.map(function (l) {
            return '<a href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
          }).join("") + "</div></div>";
      }).join("") + "</div></section>";
  }

  function aiHTML() {
    var html = '<section id="ai"><h2>The AI track</h2>' +
      '<p class="lead">' + D.AI.thesis + "</p>" +
      '<div class="links">' + D.AI.stack.map(function (s) { return "<a>" + esc(s) + "</a>"; }).join("") + "</div>" +
      '<div class="callout warn"><b>Reality check:</b> ' + D.AI.reality + "</div>";
    html += '<div class="grid">' + D.AI.projects.map(function (p) {
      return '<div class="card"><h4>' + esc(p.name) + "</h4><p>" + esc(p.d) + "</p></div>";
    }).join("") + "</div>";
    html += '<div class="callout bad"><b>Skip:</b> ' + D.AI.skip.map(function (s) { return esc(s); }).join(" · ") + "</div>";
    return html + "</section>";
  }

  function resourcesHTML() {
    var html = '<section id="links"><h2>Links</h2>';
    html += D.RESOURCES.map(function (g) {
      return "<h3>" + esc(g.group) + '</h3><div class="grid">' + g.items.map(function (it) {
        return '<div class="card tight"><h4><a href="' + it.url + '" target="_blank" rel="noopener">' + esc(it.label) + "</a></h4>" +
          (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div>";
      }).join("") + "</div>";
    }).join("");
    html += '<div class="callout">' + D.RULES.map(function (r) { return "• " + esc(r); }).join("<br>") + "</div>";
    html += '<h3>Checkpoints</h3><div class="grid">' + D.MILESTONES.map(function (m) {
      return '<div class="card"><h4>' + esc(m.when) + "</h4><ul>" + m.checks.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div></section>";
    return html;
  }

  var VERDICTS = [
    ["overall", "Overall verdict", ["Keep as is", "Compress to 4 months", "Expand to 6 months", "Restructure"]],
    ["dsa", "DSA volume (" + PROBLEM_COUNT + " problems)", ["Too little", "About right", "Too much"]],
    ["cs", "CS depth", ["Too shallow", "About right", "Too deep"]],
    ["ai", "AI load (3 hours/week)", ["Too little", "About right", "Too much — DSA will suffer"]],
    ["exam", "Exam weeks (40 min/day)", ["Too light", "About right", "Too heavy for endsems"]],
    ["time", "Daily budget (2h 45m)", ["Unrealistic", "Tight but doable", "Comfortable"]],
    ["apply", "Applications from week 8", ["Too late", "About right", "Too early"]]
  ];

  function rv(sec, key) {
    var r = state.review;
    return (r && r[sec] && r[sec][key]) || "";
  }

  function reviewMarkdown() {
    var L = [];
    L.push("# Zero to Offer — review");
    L.push("");
    L.push("**Reviewer:** " + (state.review.name || "(unnamed)"));
    L.push("**Date:** " + iso(new Date()));
    L.push("");
    L.push("## Verdicts");
    VERDICTS.forEach(function (v) { L.push("- **" + v[1] + ":** " + (rv("v", v[0]) || "-")); });
    L.push(""); L.push("## Biggest risk"); L.push(rv("a", "risk") || "-");
    L.push(""); L.push("## What to cut"); L.push(rv("a", "cut") || "-");
    L.push(""); L.push("## What is missing"); L.push(rv("a", "add") || "-");
    L.push(""); L.push("## Final instruction"); L.push(rv("a", "final") || "-");
    L.push(""); L.push("## Week by week");
    L.push(""); L.push("| Week | Theme | Comment |"); L.push("| --- | --- | --- |");
    D.WEEKS.forEach(function (w) {
      var c = rv("w", String(w.n));
      if (c) L.push("| W" + w.n + " | " + w.theme + " | " + c.replace(/\|/g, "/").replace(/\n/g, " ") + " |");
    });
    L.push(""); L.push("---"); L.push("Generated from Zero to Offer.");
    return L.join("\n");
  }

  function reviewHTML() {
    var html = '<section id="review"><h2>Review</h2>' +
      '<p class="lead">For an audit: pick a verdict on each line, comment where you disagree, then download the file and send it back. Nothing leaves this browser until you do.</p>';

    html += '<div class="form"><input type="text" id="rvName" placeholder="Reviewer name" value="' + esc(state.review.name || "") + '" style="flex:1;min-width:240px"></div>';

    html += '<div class="grid">' + VERDICTS.map(function (v) {
      var cur = rv("v", v[0]);
      return '<div class="card"><h4>' + esc(v[1]) + '</h4><select data-rk="v:' + v[0] + '" style="width:100%">' +
        '<option value="">— pick —</option>' +
        v[2].map(function (o) { return '<option value="' + esc(o) + '"' + (cur === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
        "</select></div>";
    }).join("") + "</div>";

    html += [["risk", "Biggest risk", "Be blunt. What breaks first?"],
             ["cut", "What to cut", "Which weeks are wasted effort?"],
             ["add", "What is missing", "Anything a CU student must do that isn't here?"],
             ["final", "Final instruction", "One paragraph to read every Monday."]].map(function (a) {
      return '<div class="card" style="margin-bottom:14px"><h4>' + esc(a[1]) + "</h4><p>" + esc(a[2]) + "</p>" +
        '<textarea data-rk="a:' + a[0] + '" rows="3" placeholder="...">' + esc(rv("a", a[0])) + "</textarea></div>";
    }).join("");

    html += "<h3>Week by week</h3><p class=\"dim tiny\">Comment only where you disagree. Empty means approved.</p>";
    html += '<div class="wklist">' + D.WEEKS.map(function (w) {
      return '<div class="wkrow"><span class="pill sm">W' + w.n + "</span>" +
        '<input type="text" data-rk="w:' + w.n + '" placeholder="' + esc(w.theme) + '" value="' + esc(rv("w", String(w.n))) + '">' +
        "</div>";
    }).join("") + "</div>";

    html += '<div class="form" style="margin-top:22px"><button id="rvDownload" class="btn solid">Download review .md</button>' +
      '<button id="rvCopy" class="btn">Copy as text</button>' +
      '<button id="rvClear" class="btn">Clear</button>' +
      '<span id="rvStatus" class="dim tiny" style="align-self:center"></span></div></section>';
    return html;
  }

  /* ---------- nav ---------- */
  function navHTML() {
    var parts = ['<a href="#overview" class="navchip">Overview</a>'];
    D.WEEKS.forEach(function (w) {
      parts.push('<a href="#w' + w.n + '" class="navchip' + (w.n === ACTIVE_WEEK ? " on" : "") + '" data-nav="' + w.n + '">W' + w.n + "</a>");
    });
    parts.push('<a href="#faang" class="navchip">FAANG</a>');
    parts.push('<a href="#cs" class="navchip">CS</a>');
    parts.push('<a href="#ai" class="navchip">AI</a>');
    parts.push('<a href="#links" class="navchip">Links</a>');
    parts.push('<a href="#review" class="navchip">Review</a>');
    return parts.join("");
  }

  /* ---------- render ---------- */
  function render() {
    var html = overviewHTML();
    html += '<section id="plan"><div class="plan-head"><h2>Week by week</h2>' +
      '<div class="plan-tools"><button id="expandAll" class="btn">Expand all</button>' +
      '<button id="collapseAll" class="btn">Collapse all</button></div></div>' +
      '<p class="lead">Every week opens with what you study that week. Click the header for the seven days.</p>' +
      D.WEEKS.map(weekHTML).join("") + "</section>";
    html += faangHTML();
    html += csHTML();
    html += aiHTML();
    html += resourcesHTML();
    html += reviewHTML();

    root.innerHTML = html;
    document.getElementById("navchips").innerHTML = navHTML();
    document.getElementById("overallcount").textContent = "";
    refreshHeader();
  }

  function refreshHeader() {
    var o = overall();
    document.getElementById("overallbar").style.width = o.pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " (" + (o.pct > 0 && o.pct < 10 ? o.pct.toFixed(1) : Math.round(o.pct)) + "%)";

    var left = D.diffDays(TODAY, D.PLACEMENT_SEASON);
    document.getElementById("countdown").textContent = left > 0 ? left + " days to placements" : "placement season";

    var label;
    if (TODAY < D.WEEK1) label = "Starts " + fmtDate(D.WEEK1);
    else if (TODAY > LAST_DATE) label = "22 weeks complete";
    else label = "Day " + (D.diffDays(D.WEEK1, TODAY) + 1) + " of 154";
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
      return;
    }
    var goto = e.target.closest("[data-goto]");
    if (goto) {
      var sec2 = document.getElementById(goto.getAttribute("data-goto"));
      if (sec2) { sec2.classList.add("open"); sec2.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }
    if (e.target.id === "expandAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.add("open"); }); return; }
    if (e.target.id === "collapseAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.remove("open"); }); return; }
    if (e.target.id === "jumpToday") {
      var t = document.getElementById("w" + ACTIVE_WEEK);
      if (t) { t.classList.add("open"); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }
    if (e.target.id === "topBtn") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }

    if (e.target.id === "rvDownload") {
      var text = reviewMarkdown();
      var name = "zero-to-offer-review-" + iso(new Date()) + ".md";
      var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      document.getElementById("rvStatus").textContent = "downloaded " + name;
      return;
    }
    if (e.target.id === "rvCopy") {
      var t2 = reviewMarkdown();
      var s2 = document.getElementById("rvStatus");
      function fb() {
        var ta = document.createElement("textarea");
        ta.value = t2; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); s2.textContent = "copied"; } catch (err) { s2.textContent = "copy failed — use Download"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t2).then(function () { s2.textContent = "copied"; }, fb);
      else fb();
      return;
    }
    if (e.target.id === "rvClear") {
      if (!confirm("Clear the whole review?")) return;
      state.review = { v: {}, a: {}, w: {}, name: "" };
      save(); render();
      document.getElementById("review").scrollIntoView();
    }
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all checkmarks and review notes?")) return;
    state = { done: {}, review: { v: {}, a: {}, w: {}, name: "" } };
    save();
    location.reload();
  });

  /* ============================================================
     PEN LAYER — annotate over the page, strokes fade on their own
     ============================================================ */
  (function pen() {
    var canvas = document.getElementById("penCanvas");
    var ctx = canvas.getContext("2d");
    var toggle = document.getElementById("penToggle");
    var bar = document.getElementById("penbar");
    var on = false, drawing = null;
    var strokes = [];
    var color = "#3ddc97", width = 4, fade = 30;
    var raf = null, dpr = 1;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawStroke(s, alpha) {
      var pts = s.pts;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.w;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (pts.length === 1) {
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, s.w / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length - 1; i++) {
        var mx = (pts[i].x + pts[i + 1].x) / 2;
        var my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      var last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }

    function tick(now) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      var keep = [];
      for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i];
        var age = (now - s.born) / 1000;
        var a = 1;
        if (fade > 0) {
          if (age > fade) continue;
          var hold = fade * 0.4;
          a = age <= hold ? 1 : 1 - (age - hold) / (fade - hold);
        }
        drawStroke(s, Math.max(0, Math.min(1, a)));
        keep.push(s);
      }
      strokes = keep;
      ctx.globalAlpha = 1;
      if (on || strokes.length) raf = requestAnimationFrame(tick);
      else { raf = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }

    function start() { size(); if (raf === null) raf = requestAnimationFrame(tick); }

    function setPen(v) {
      on = v;
      document.body.classList.toggle("pen-on", v);
      toggle.textContent = v ? "✕ Done" : "✎ Pen";
      if (v) { start(); }
      else { drawing = null; }
    }

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    canvas.addEventListener("pointerdown", function (e) {
      if (!on) return;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* synthetic or unsupported */ }
      drawing = { pts: [pos(e)], color: color, w: width, born: performance.now() };
      strokes.push(drawing);
      e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      drawing.pts.push(pos(e));
      e.preventDefault();
    });
    function endDraw() { drawing = null; }
    canvas.addEventListener("pointerup", endDraw);
    canvas.addEventListener("pointercancel", endDraw);

    toggle.addEventListener("click", function () { setPen(!on); });
    document.getElementById("penExit").addEventListener("click", function () { setPen(false); });
    document.getElementById("penClear").addEventListener("click", function () { strokes = []; });

    document.querySelectorAll(".sw").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".sw").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        color = b.getAttribute("data-color");
      });
    });
    document.getElementById("penSize").addEventListener("change", function (e) { width = Number(e.target.value); });
    document.getElementById("penFade").addEventListener("change", function (e) { fade = Number(e.target.value); });

    window.addEventListener("resize", function () { if (on) size(); });

    document.addEventListener("keydown", function (e) {
      if (e.target.matches("input, textarea, select")) return;
      if (e.key === "p" || e.key === "P") { setPen(!on); }
      else if (e.key === "Escape" && on) { setPen(false); }
      else if ((e.key === "c" || e.key === "C") && on) { strokes = []; }
    });
  })();

  render();
})();
