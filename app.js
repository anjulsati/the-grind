/* ============================================================
   CU Prep OS — app layer (v2)
   ============================================================ */
(function () {
  "use strict";

  var D = window.CUDATA;
  var LS = "cu-prep-os-v2";
  var app = document.getElementById("app");

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
  function save() {
    try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function iso(d) {
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  var PREVIEW = null;
  try {
    var q = new URLSearchParams(location.search).get("date");
    if (q && /^\d{4}-\d{2}-\d{2}$/.test(q)) PREVIEW = q;
  } catch (e) { /* ignore */ }
  var TODAY = PREVIEW || iso(new Date());

  function fmtDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  function typeLabel(t) {
    return { dsa: "DSA", stretch: "STRETCH", theory: "THEORY", dev: "DEV", project: "PROJECT", career: "CAREER", review: "REVIEW" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  var LAST_PLAN_DATE = D.planDays[D.planDays.length - 1].date;

  var WEEK_META = {};
  D.WEEKS.forEach(function (w) { WEEK_META[w.n] = { theme: w.theme, cs: w.cs, count: w.problems.length, sprint: false }; });
  D.SPRINTS.forEach(function (s) { WEEK_META[s.n] = { theme: s.theme, cs: s.cs, count: 0, sprint: true }; });

  function allDays() { return D.momentumDays.concat(D.planDays); }
  function dayDone(day) { return day.items.filter(function (i) { return state.done[i.id]; }).length; }

  /* ---------- rendering ---------- */
  function itemHTML(item) {
    var done = !!state.done[item.id];
    var title = item.url
      ? '<a href="' + item.url + '" target="_blank" rel="noopener">' + esc(item.title) + "</a>"
      : esc(item.title);
    var diff = item.diff ? '<span class="diff ' + item.diff + '">' + diffLabel(item.diff) + "</span>" : "";
    var go = item.url ? '<a class="go" href="' + item.url + '" target="_blank" rel="noopener">open ↗</a>' : "";
    var hint = item.hint ? '<p class="hint">' + esc(item.hint) + "</p>" : "";

    return '<li class="item' + (done ? " done" : "") + '">' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") +
      ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" +
      title + diff + "</div>" + hint + "</div>" + go + "</li>";
  }

  function dayCard(day, hideTitle) {
    var isToday = day.date === TODAY;
    var cls = "day" + (isToday ? " is-today" : "") + (day.revision ? " revision" : "");
    var head = '<div class="day-head"><div class="left">' +
      '<span class="pill">DAY ' + day.n + "</span>" +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="chip accent">TODAY</span>' : "") +
      (day.time ? '<span class="chip">' + day.time + "</span>" : "") +
      '</div><span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></div>";

    return '<article class="' + cls + '" id="' + day.date + '">' + head +
      (hideTitle ? "" : "<h3>" + esc(day.title) + "</h3>") +
      '<ul class="items">' + day.items.map(itemHTML).join("") + "</ul></article>";
  }

  function overall() {
    var total = 0, done = 0;
    allDays().forEach(function (d) { total += d.items.length; done += dayDone(d); });
    return { total: total, done: done };
  }

  function refreshHeader() {
    var o = overall();
    var pct = o.total ? (o.done / o.total) * 100 : 0;
    document.getElementById("overallbar").style.width = pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " (" + (pct > 0 && pct < 10 ? pct.toFixed(1) : Math.round(pct)) + "%)";

    var left = D.diffDays(TODAY, D.PLACEMENT_SEASON);
    document.getElementById("countdown").textContent =
      left > 0 ? left + " days to placement season" : "placement season is here";

    var label;
    if (TODAY < D.MOMENTUM_START) label = "Momentum starts " + fmtDate(D.MOMENTUM_START);
    else if (TODAY <= D.MOMENTUM_END) label = "Momentum day " + (D.diffDays(D.MOMENTUM_START, TODAY) + 1) + " of 22";
    else if (TODAY < D.PLAN_START) label = "Plan starts " + fmtDate(D.PLAN_START);
    else if (TODAY > LAST_PLAN_DATE) label = "20 weeks complete — Phase 3";
    else label = "Plan day " + (D.diffDays(D.PLAN_START, TODAY) + 1) + " of 140";

    document.getElementById("todayLabel").textContent = (PREVIEW ? "Preview · " : "") + label;
  }

  /* ---------- views ---------- */
  function viewToday() {
    var html = "";

    if (TODAY < D.MOMENTUM_START) {
      return '<div class="hero"><div class="kicker">Starts ' + fmtDate(D.MOMENTUM_START) + '</div>' +
        "<h1>Nothing due yet</h1>" +
        '<p class="lead">One assignment before tomorrow: create a GitHub account. That\'s the whole thing.</p>' +
        '<div class="meta"><span class="chip accent">35 min/day during endsems</span><span class="chip">4 micro-tasks</span></div></div>' +
        "<h2>Day 1</h2>" + dayCard(D.momentumDays[0]);
    }

    if (TODAY <= D.MOMENTUM_END) {
      var md = D.momentumDays[D.diffDays(D.MOMENTUM_START, TODAY)];
      html += '<div class="hero"><div class="kicker">Endsems · momentum mode</div>' +
        "<h1>40 minutes. That's the whole day.</h1>" +
        '<p class="lead">One easy problem, one short concept, one tiny setup task, one page of revision for tomorrow\'s paper. This exists so December 8 starts at Day 1 — not Day Zero.</p>' +
        '<div class="meta"><span class="chip accent">Day ' + md.n + ' of 22</span><span class="chip">10 min problem</span><span class="chip">10 min concept</span><span class="chip">15 min AI</span><span class="chip">5 min revision</span></div></div>';
      html += dayCard(md);
      html += '<h2>Next up</h2>' + D.momentumDays.slice(md.n, md.n + 2).map(function (d) { return dayCard(d); }).join("");
      html += '<div class="callout warn"><b>Escape hatch:</b> if a paper is tomorrow morning, do only the last task. That\'s allowed. Skipping the whole week is not.</div>';
      return html;
    }

    if (TODAY < D.PLAN_START) {
      return '<div class="hero"><div class="kicker">Exams done</div><h1>Plan starts ' + fmtDate(D.PLAN_START) + "</h1>" +
        '<p class="lead">Use the gap to finish the setup: GitHub, LeetCode account, project generated in your editor, plan.md committed.</p></div>' +
        "<h2>Day 1 preview</h2>" + dayCard(D.planDays[0]);
    }

    if (TODAY > LAST_PLAN_DATE) {
      return '<div class="hero"><div class="kicker">20 weeks done</div><h1>Phase 3</h1>' +
        '<p class="lead">Now it\'s DP depth, 2 mocks a week, 10 applications a week, and system design. Placement season starts in August.</p></div>';
    }

    var idx = D.diffDays(D.PLAN_START, TODAY);
    var pd = D.planDays[idx];
    var m = WEEK_META[pd.week];

    html += '<div class="hero"><div class="kicker">Week ' + pd.week + " · " + esc(m.theme) + "</div>" +
      "<h1>Today's block</h1>" +
      '<p class="lead">' + pd.items.length + " tasks · " + pd.time + ". Top to bottom. Nothing else is required today.</p>" +
      '<div class="meta"><span class="chip accent">Day ' + pd.n + " of 140</span>" +
      '<span class="chip info">' + esc(m.cs) + "</span>" +
      '<span class="chip warn">' + esc(pd.title.replace(/^Week \d+ · /, "")) + "</span>" +
      "</div></div>";

    html += dayCard(pd, true);
    html += "<h2>Coming up</h2>" + D.planDays.slice(idx + 1, idx + 3).map(function (d) { return dayCard(d); }).join("");
    html += '<h2>Non-negotiables</h2><div class="callout">' +
      D.RULES.slice(0, 4).map(function (r) { return "• " + esc(r); }).join("<br>") + "</div>";
    return html;
  }

  function viewMomentum() {
    var html = '<div class="hero"><div class="kicker">Nov 16 → Dec 7</div>' +
      "<h1>Momentum mode: 22 days × 40 minutes</h1>" +
      '<p class="lead">Four micro-tasks a day while your endsems run. One easy problem, one concept, one tiny AI task, one page of exam revision. The AI tasks start from zero and assume nothing — by Dec 7 you\'ll have called an LLM, made an embedding and run a 30-line RAG. Deliberately small: exams come first.</p>' +
      '<div class="meta"><span class="chip accent">22 easy problems</span><span class="chip info">22 concepts</span><span class="chip warn">22 AI micro-tasks</span></div></div>';
    html += '<div class="callout warn"><b>Rule:</b> a paper within 24 hours → do only the last task. Do the rest on a free day. A broken streak is fine; an abandoned plan is not.</div>';
    html += D.momentumDays.map(function (d) { return dayCard(d); }).join("");
    return html;
  }

  function weekCard(n, open) {
    var days = D.planDays.filter(function (d) { return d.week === n; });
    var meta = WEEK_META[n];
    var total = 0, done = 0;
    days.forEach(function (d) { total += d.items.length; done += dayDone(d); });
    var pct = total ? Math.round((done / total) * 100) : 0;

    return '<section class="week' + (open ? " open" : "") + '" data-week="' + n + '">' +
      '<div class="week-head" data-toggle="' + n + '">' +
      '<div class="wh-left"><span class="week-num">W' + n + "</span><div><h3>" + esc(meta.theme) + "</h3>" +
      '<div class="wh-sub">' + fmtDate(days[0].date) + " → " + fmtDate(days[6].date) +
      " · " + esc(meta.cs) + " · " + (meta.count ? meta.count + " problems" : "sprint") + "</div></div></div>" +
      '<div class="wh-right"><div class="mini-bar"><div style="width:' + pct + '%"></div></div>' +
      '<span class="day-count">' + done + "/" + total + "</span></div></div>" +
      '<div class="week-body">' + days.map(function (d) { return dayCard(d); }).join("") + "</div></section>";
  }

  function viewPlan() {
    var currentWeek = 1;
    if (TODAY >= D.PLAN_START && TODAY <= LAST_PLAN_DATE) {
      currentWeek = D.planDays[D.diffDays(D.PLAN_START, TODAY)].week;
    }
    var nums = Object.keys(WEEK_META).map(Number).sort(function (a, b) { return a - b; });

    var html = '<div class="hero"><div class="kicker">Dec 8 → ' + fmtDate(LAST_PLAN_DATE) + '</div>' +
      "<h1>The 5 months</h1>" +
      '<p class="lead">140 days. 200+ problems, 5 CS areas, a dev track that ships two deployed projects, and applications from week 8. Expand a week — everything inside is already linked.</p>' +
      '<div class="meta"><span class="chip accent">~210 problems</span><span class="chip info">5 CS areas</span><span class="chip warn">2 live projects</span><span class="chip">40+ applications</span></div></div>';

    html += nums.map(function (n) { return weekCard(n, n === currentWeek); }).join("");

    html += "<h2>Checkpoints</h2>";
    html += '<div class="grid">' + D.MILESTONES.map(function (ms) {
      return '<div class="card"><h4>' + esc(ms.when) + "</h4><ul>" +
        ms.checks.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";

    html += '<div class="callout bad"><b>If you fall behind:</b> cut the dev scope and the stretch problems. Never cut DSA, never skip CS, never go to zero. A 1-problem day is still a day.</div>';
    return html;
  }

  function viewDev() {
    var html = '<div class="hero"><div class="kicker">AI track · runs in parallel</div>' +
      "<h1>Agentic AI, built properly</h1>" +
      '<p class="lead">' + D.DEV.thesis + "</p>" +
      '<div class="links">' + D.DEV.stack.map(function (s) { return "<a>" + esc(s) + "</a>"; }).join("") + "</div></div>";

    html += '<div class="callout warn"><b>Reality check, because it matters:</b> at CU most campus drives are SDE and service roles. AI-specific fresher openings are fewer and mostly off-campus or startup. So <b>DSA and CS stay exactly where they are</b> — this track is your differentiator and your route into AI startups, not a replacement for the coding round. Java stays for DSA; Python for AI.</div>';

    html += "<h2>Why each piece earns its place</h2>";
    html += '<div class="grid">' + D.DEV.why.map(function (w) {
      return '<div class="card"><h4>' + esc(w[0]) + "</h4><p>" + esc(w[1]) + "</p></div>";
    }).join("") + "</div>";

    html += "<h2>What to skip (this list saves you months)</h2>";
    html += '<div class="callout bad">' + D.DEV.skip.map(function (x) { return "• " + esc(x); }).join("<br>") + "</div>";

    html += '<h2>The two projects</h2><div class="grid">' + D.DEV.projects.map(function (pr) {
      return '<div class="card"><h4>' + esc(pr.name) + "</h4><p>" + esc(pr.d) + "</p></div>";
    }).join("") + "</div>";

    html += "<h2>20-week AI curriculum</h2>";
    html += "<table><thead><tr><th>Wk</th><th>What you learn</th><th>What exists at the end</th></tr></thead><tbody>" +
      D.DEV_WEEKS.map(function (r) {
        return "<tr><td>W" + r[0] + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>";
      }).join("") + "</tbody></table>";

    html += '<div class="callout"><b>How this gets interviewed:</b> nobody asks "what is RAG". They ask "why did retrieval fail on this query", "how do you stop the agent looping forever", "what does your eval score mean", "what happens when the model picks the wrong tool", "what did it cost per request". Every week above gives you one more honest answer.</div>';
    return html;
  }

  function viewCS() {
    var html = '<div class="hero"><div class="kicker">The round after the coding round</div>' +
      "<h1>CS fundamentals</h1>" +
      '<p class="lead">Coding gets you shortlisted. These get you the offer. 30 minutes a day, one topic at a time, in your own words.</p></div>';
    html += '<div class="grid">' + D.CS.map(function (s) {
      return '<div class="card"><h4>' + esc(s.name) + "</h4><p>" + esc(s.when) + "</p><ul>" +
        s.topics.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") +
        '</ul><div class="links">' + s.links.map(function (l) {
          return '<a href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
        }).join("") + "</div></div>";
    }).join("") + "</div>";
    html += '<div class="callout"><b>The test:</b> close everything and explain "what happens when you type a URL", "why is a HashMap lookup O(1)", and "walk me through your login flow" out loud, 90 seconds each. If you can\'t, you don\'t know it yet.</div>';
    return html;
  }

  function viewResources() {
    var html = '<div class="hero"><div class="kicker">Nothing left to search for</div>' +
      "<h1>Every link</h1>" +
      '<p class="lead">Bookmark this. If a resource doesn\'t fit you, use it anyway — switching resources is procrastination wearing a disguise.</p></div>';
    html += D.RESOURCES.map(function (g) {
      return "<h2>" + esc(g.group) + '</h2><div class="grid">' + g.items.map(function (it) {
        return '<div class="card"><h4><a href="' + it.url + '" target="_blank" rel="noopener">' + esc(it.label) + "</a></h4>" +
          (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div>";
      }).join("") + "</div>";
    }).join("");
    html += '<h2>The rules that actually decide this</h2><div class="callout">' +
      D.RULES.map(function (r) { return "• " + esc(r); }).join("<br>") + "</div>";
    return html;
  }

  function viewTrack() {
    var html = '<div class="hero"><div class="kicker">Applications</div><h1>Tracker</h1>' +
      '<p class="lead">5/week from week 8, 10/week from week 12, 15–20 from week 16. Applied-and-forgotten doesn\'t count.</p></div>';

    html += '<div class="form">' +
      '<input type="text" id="appCompany" placeholder="Company" style="flex:1;min-width:140px">' +
      '<input type="text" id="appRole" placeholder="Role (SDE Intern)" style="flex:1;min-width:160px">' +
      '<select id="appStatus"><option>Applied</option><option>OA scheduled</option><option>Interview</option><option>Offer</option><option>Rejected</option></select>' +
      '<button id="addApp">Add</button></div>';

    if (!state.apps.length) {
      html += '<div class="callout">Nothing logged yet. That\'s correct until week 8 — but if a good opening shows up tomorrow, apply anyway. Underprepared beats unapplied.</div>';
    } else {
      var counts = {};
      state.apps.forEach(function (a) { counts[a.status] = (counts[a.status] || 0) + 1; });
      html += '<div class="links" style="margin-bottom:12px">' +
        Object.keys(counts).map(function (k) { return "<a>" + esc(k) + ": " + counts[k] + "</a>"; }).join("") + "</div>";
      html += "<table><thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>" +
        state.apps.slice().reverse().map(function (a, i) {
          var realIdx = state.apps.length - 1 - i;
          return "<tr><td><b>" + esc(a.company) + "</b></td><td>" + esc(a.role) + "</td><td>" + esc(a.status) +
            '</td><td class="dim">' + esc(a.date) + '</td><td><button class="ghost" data-del="' + realIdx + '">×</button></td></tr>';
        }).join("") + "</tbody></table>";
    }

    html += '<h2>Eligibility</h2><div class="callout">' +
      "• CGPA <b>7.65</b> — clears almost every gate. Keep it above 7.5.<br>" +
      "• <b>Zero active backlogs.</b> Most drives auto-reject otherwise.<br>" +
      "• 10th / 12th usually need 60%+. Check yours now, not in August.<br>" +
      "• CU's batch is huge — the coding test is the real shortlist. That's what the 20 weeks are for.</div>";
    return html;
  }

  /* ---------- audit / review ---------- */
  function rv(section, key) {
    var r = state.review;
    return (r && r[section] && r[section][key]) || "";
  }

  function reviewMarkdown() {
    var lines = [];
    var d = new Date();
    lines.push("# CU Prep OS — audit");
    lines.push("");
    lines.push("**Reviewer:** " + (state.review.name || "(unnamed)"));
    lines.push("**Date:** " + iso(d));
    lines.push("");
    lines.push("## Verdicts");
    VERDICTS.forEach(function (v) {
      lines.push("- **" + v[1] + ":** " + (rv("v", v[0]) || "—"));
    });
    lines.push("");
    lines.push("## Biggest risk");
    lines.push(rv("a", "risk") || "—");
    lines.push("");
    lines.push("## What to cut");
    lines.push(rv("a", "cut") || "—");
    lines.push("");
    lines.push("## What to add");
    lines.push(rv("a", "add") || "—");
    lines.push("");
    lines.push("## Final instruction to the student");
    lines.push(rv("a", "final") || "—");
    lines.push("");
    lines.push("## Week by week");
    lines.push("");
    lines.push("| Week | Theme | Comment |");
    lines.push("| --- | --- | --- |");
    Object.keys(WEEK_META).map(Number).sort(function (x, y) { return x - y; }).forEach(function (n) {
      var c = rv("w", String(n));
      if (c) lines.push("| W" + n + " | " + WEEK_META[n].theme + " | " + c.replace(/\|/g, "/").replace(/\n/g, " ") + " |");
    });
    lines.push("");
    lines.push("---");
    lines.push("Generated from the CU Prep OS site.");
    return lines.join("\n");
  }

  var VERDICTS = [
    ["overall", "Overall verdict", ["Keep as is", "Compress to 4 months", "Expand to 5.5–6 months", "Restructure"]],
    ["dsa", "DSA volume (~210 problems)", ["Too little", "About right", "Too much"]],
    ["cs", "CS fundamentals depth", ["Too shallow", "About right", "Too deep"]],
    ["ai", "Agentic AI load (3 × 45 min/week)", ["Too little", "About right", "Too much — DSA will suffer"]],
    ["time", "Time budget (2h 45m/day)", ["Unrealistic", "Tight but doable", "Comfortable"]],
    ["apply", "Applications start (week 8)", ["Too late", "About right", "Too early"]]
  ];

  function viewReview() {
    var html = '<div class="hero"><div class="kicker">For your auditor</div>' +
      "<h1>Review this plan</h1>" +
      '<p class="lead">If someone is checking this plan for you: pick a verdict on each line, drop comments on the weeks you disagree with, then hit <b>Download</b> and send the file back. Nothing leaves this browser until you do.</p>' +
      '<div class="meta"><span class="chip accent">6 verdicts</span><span class="chip">4 written answers</span><span class="chip">20 week comments</span></div></div>';

    html += '<div class="form"><input type="text" id="rvName" placeholder="Your name" value="' + esc(state.review.name || "") + '" style="flex:1;min-width:200px"></div>';

    html += "<h2>Verdicts</h2>";
    html += '<div class="grid">' + VERDICTS.map(function (v) {
      var cur = rv("v", v[0]);
      return '<div class="card"><h4>' + esc(v[1]) + '</h4><select data-rk="v:' + v[0] + '" style="width:100%">' +
        '<option value="">— pick —</option>' +
        v[2].map(function (o) { return '<option value="' + esc(o) + '"' + (cur === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
        "</select></div>";
    }).join("") + "</div>";

    var answers = [
      ["risk", "Biggest risk in this plan", "Be blunt. What will break first?"],
      ["cut", "What should be cut?", "Which weeks or tasks are wasted effort?"],
      ["add", "What is missing?", "Anything a CU student must do that isn't here?"],
      ["final", "Final instruction to the student", "One paragraph he should read every Monday."]
    ];
    html += "<h2>Written review</h2>";
    html += answers.map(function (a) {
      return '<div class="card" style="margin-bottom:12px"><h4>' + esc(a[1]) + "</h4><p>" + esc(a[2]) + "</p>" +
        '<textarea data-rk="a:' + a[0] + '" rows="3" style="width:100%;background:#0d141c;border:1px solid #2a3a4d;color:#e7eef5;border-radius:9px;padding:10px;font-family:inherit;font-size:13px;resize:vertical">' +
        esc(rv("a", a[0])) + "</textarea></div>";
    }).join("");

    html += '<h2>Week by week</h2><p class="dim tiny">Leave a comment only where you disagree. Empty means approved.</p>';
    html += '<div style="display:flex;flex-direction:column;gap:8px">' +
      Object.keys(WEEK_META).map(Number).sort(function (x, y) { return x - y; }).map(function (n) {
        return '<div style="display:grid;grid-template-columns:52px 1fr;gap:10px;align-items:center">' +
          '<span class="pill">W' + n + "</span>" +
          '<input type="text" data-rk="w:' + n + '" placeholder="' + esc(WEEK_META[n].theme) + '" value="' + esc(rv("w", String(n))) + '" style="width:100%">' +
          "</div>";
      }).join("") + "</div>";

    html += '<div class="form" style="margin-top:22px">' +
      "<button id=\"rvDownload\">Download review .md</button>" +
      "<button id=\"rvCopy\" class=\"ghost\">Copy as text</button>" +
      "<button id=\"rvClear\" class=\"ghost\">Clear review</button>" +
      '<span id="rvStatus" class="dim tiny" style="align-self:center"></span></div>';

    html += '<div class="callout"><b>How to send it back:</b> Download produces <code>cu-prep-audit-YYYY-MM-DD.md</code>. Send that file (WhatsApp, Telegram, email) — it contains every verdict and comment in a readable table.</div>';
    return html;
  }

  /* ---------- router ---------- */
  var VIEWS = {
    today: viewToday, momentum: viewMomentum, plan: viewPlan,
    dev: viewDev, cs: viewCS, resources: viewResources, track: viewTrack,
    review: viewReview
  };

  function route() {
    var tab = (location.hash || "#today").replace("#", "");
    if (!VIEWS[tab]) tab = "today";
    document.querySelectorAll("#tabs a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-tab") === tab);
    });
    app.innerHTML = VIEWS[tab]();
    refreshHeader();
    if (tab === "today") window.scrollTo(0, 0);
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
    refreshHeader();
  });

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-toggle]");
    if (toggle) { var sec = toggle.closest(".week"); if (sec) sec.classList.toggle("open"); return; }

    if (e.target.id === "addApp") {
      var company = document.getElementById("appCompany").value.trim();
      var role = document.getElementById("appRole").value.trim();
      var status = document.getElementById("appStatus").value;
      if (!company) return;
      state.apps.push({ company: company, role: role || "—", status: status, date: TODAY });
      save();
      app.innerHTML = viewTrack(); refreshHeader();
      return;
    }

    var del = e.target.closest("[data-del]");
    if (del) {
      state.apps.splice(Number(del.getAttribute("data-del")), 1);
      save();
      app.innerHTML = viewTrack(); refreshHeader();
    }
  });

  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.id === "rvName") {
      state.review.name = el.value;
      save();
      return;
    }
    var rk = el.getAttribute && el.getAttribute("data-rk");
    if (!rk) return;
    var parts = rk.split(":");
    state.review[parts[0]] = state.review[parts[0]] || {};
    state.review[parts[0]][parts[1]] = el.value;
    save();
    var st = document.getElementById("rvStatus");
    if (st) st.textContent = "saved";
  });

  function reviewText() {
    if (document.getElementById("rvName")) state.review.name = document.getElementById("rvName").value;
    return reviewMarkdown();
  }

  document.addEventListener("click", function (e) {
    if (e.target.id === "rvDownload") {
      var text = reviewText();
      var name = "cu-prep-audit-" + iso(new Date()) + ".md";
      var blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
      var st = document.getElementById("rvStatus");
      if (st) st.textContent = "downloaded " + name;
      return;
    }
    if (e.target.id === "rvCopy") {
      var t = reviewText();
      var st2 = document.getElementById("rvStatus");
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = t; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); if (st2) st2.textContent = "copied"; }
        catch (err) { if (st2) st2.textContent = "copy failed — use Download"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { if (st2) st2.textContent = "copied"; }, fallback);
      } else fallback();
      return;
    }
    if (e.target.id === "rvClear") {
      if (!confirm("Clear the whole review?")) return;
      state.review = { v: {}, a: {}, w: {}, name: "" };
      save();
      app.innerHTML = viewReview();
      return;
    }
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all checkmarks and the application log? This cannot be undone.")) return;
    state = { done: {}, apps: [], review: { v: {}, a: {}, w: {}, name: "" } };
    save();
    route();
  });

  window.addEventListener("hashchange", route);

  if (!location.hash) location.hash = "#today";
  route();
})();
