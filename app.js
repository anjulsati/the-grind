/* ============================================================
   The Grind — dynamic, editable, single page
   Built by Anjul Sati
   ============================================================ */
(function () {
  "use strict";

  var D = window.CUDATA;
  var LS_DB = "the-grind-db-v1";
  var LS = "the-grind-v1";
  var root = document.getElementById("app");
  var AUTHOR = "Anjul Sati";

  /* ============================================================
     THE DATABASE — seeded from data.js, then fully editable
     ============================================================ */
  function seedDB() {
    var weeks = [];
    D.WEEKS.forEach(function (w) {
      var days = D.DAYS.filter(function (d) { return d.week === w.n; }).map(function (d) {
        return {
          n: d.n, week: d.week, date: d.date, idx: d.idx,
          title: d.title, time: d.time, revision: !!d.revision, light: !!d.light,
          items: d.items.map(function (it) { return JSON.parse(JSON.stringify(it)); })
        };
      });
      weeks.push({
        n: w.n, mode: w.mode, theme: w.theme, goal: w.goal || "", note: w.note || "",
        pattern: w.pattern || "", pre: w.pre || null, cs: w.cs || "",
        csTopics: w.csTopics || [], csExtra: w.csExtra || [],
        days: days
      });
    });
    return { v: 1, by: AUTHOR, weeks: weeks, csAreas: JSON.parse(JSON.stringify(D.CS)) };
  }

  var db = loadDB();
  function loadDB() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_DB));
      if (raw && raw.v === 1 && raw.weeks && raw.weeks.length) return raw;
    } catch (e) { /* ignore */ }
    var seeded = seedDB();
    try { localStorage.setItem(LS_DB, JSON.stringify(seeded)); } catch (e) {}
    return seeded;
  }
  function saveDB() {
    try { localStorage.setItem(LS_DB, JSON.stringify(db)); } catch (e) {}
  }
  function restoreDB() {
    db = seedDB();
    saveDB();
    render();
    toast("Plan restored to the original");
  }

  function exportDB() {
    var blob = new Blob([JSON.stringify(db, null, 1)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "the-grind-plan-" + iso(new Date()) + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    toast("Plan exported as JSON");
  }
  function importDB(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var parsed = JSON.parse(fr.result);
        if (!parsed.weeks || !parsed.weeks.length) throw new Error("no weeks");
        db = parsed; saveDB(); render(); toast("Plan imported");
      } catch (e) { toast("Import failed — not a valid plan file"); }
    };
    fr.readAsText(file);
  }

  /* ---------- progress + review state ---------- */
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

  /* ============================================================
     HELPERS
     ============================================================ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
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
  } catch (e) { /* ignore */ }
  var TODAY = PREVIEW || iso(new Date());

  function fmtDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  function shortDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  function typeLabel(t) {
    return { dsa: "DSA", stretch: "STRETCH", watch: "WATCH", theory: "CS", dev: "BUILD", project: "SHIP", career: "CAREER", review: "REVIEW" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  function allDays() {
    var a = [];
    db.weeks.forEach(function (w) { w.days.forEach(function (d) { a.push(d); }); });
    return a;
  }
  var LAST_DATE = allDays()[allDays().length - 1].date;
  var TODAY_DAY = allDays().filter(function (d) { return d.date === TODAY; })[0] || null;
  var ACTIVE_WEEK = TODAY_DAY ? TODAY_DAY.week : (TODAY < db.weeks[0].days[0].date ? 1 : db.weeks.length);
  function weekByN(n) { return db.weeks.filter(function (w) { return w.n === n; })[0]; }

  function dayDone(day) { return day.items.filter(function (i) { return state.done[i.id]; }).length; }
  function weekStats(w) {
    var t = 0, d = 0;
    w.days.forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? Math.round((d / t) * 100) : 0 };
  }
  function overall() {
    var t = 0, d = 0;
    allDays().forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? (d / t) * 100 : 0 };
  }
  function problemCount() {
    var n = 0, seen = {};
    allDays().forEach(function (d) {
      d.items.forEach(function (it) {
        if (it.type === "dsa" && !seen[it.title]) { seen[it.title] = 1; n++; }
      });
    });
    return n;
  }

  function findItem(id) {
    var out = null;
    db.weeks.forEach(function (w) {
      w.days.forEach(function (d) {
        d.items.forEach(function (it) { if (it.id === id) out = { item: it, day: d, week: w }; });
      });
    });
    return out;
  }
  function uid() { return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ============================================================
     EDIT MODE
     ============================================================ */
  var editMode = false;
  function setEdit(v) {
    editMode = v;
    document.body.classList.toggle("editing", v);
    document.getElementById("editBtn").textContent = v ? "✓ Done editing" : "Edit plan";
    document.getElementById("editbar").style.display = v ? "flex" : "none";
    render();
    toast(v ? "Edit mode — changes save to this browser" : "Edit mode off");
  }

  /* ============================================================
     ITEM
     ============================================================ */
  function itemHTML(item) {
    var done = !!state.done[item.id];
    var title = item.url
      ? '<a href="' + item.url + '" target="_blank" rel="noopener">' + esc(item.title) + "</a>"
      : esc(item.title);
    var diff = item.diff ? '<span class="diff ' + item.diff + '">' + diffLabel(item.diff) + "</span>" : "";
    var hint = item.hint ? '<p class="hint">' + esc(item.hint) + "</p>" : "";
    var vid = item.vtitle
      ? '<p class="vid">▶ ' + (item.vauthor ? "<b>" + esc(item.vauthor) + "</b> · " : "") + esc(item.vtitle) + "</p>"
      : "";
    var actions;
    if (editMode) {
      actions = '<span class="itools">' +
        '<button class="tbtn" data-edit="' + item.id + '" title="Edit">✎</button>' +
        '<button class="tbtn danger" data-del="' + item.id + '" title="Delete">✕</button></span>';
    } else {
      actions = item.url ? '<a class="go" href="' + item.url + '" target="_blank" rel="noopener">open ↗</a>' : "";
    }

    return '<li class="item' + (done ? " done" : "") + '">' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") + ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" + title + diff + "</div>" + vid + hint + "</div>" +
      actions + "</li>";
  }

  function colBox(num, name, cls, items, day, track) {
    var add = editMode
      ? '<button class="addbtn" data-add="' + day.date + '" data-track="' + track + '" title="Add to ' + name + '">＋</button>'
      : "";
    return '<div class="dcol ' + cls + '">' +
      '<div class="dcol-h"><span class="dnum">' + num + "</span>" + name + add + "</div>" +
      (items.length ? '<ul class="items">' + items.join("") + "</ul>" : '<div class="dempty">Nothing here' + (editMode ? " — use ＋" : "") + "</div>") +
      "</div>";
  }

  function dayHTML(day) {
    var isToday = day.date === TODAY;
    var isNext = !TODAY_DAY && day.date === db.weeks[0].days[0].date;
    var dsa = [], dev = [];
    day.items.forEach(function (it) {
      ((it.track === "dsa") ? dsa : dev).push(itemHTML(it));
    });

    var cls = "day" + (isToday ? " is-today" : "") + (isNext ? " is-next" : "") + (day.revision ? " revision" : "") + (day.light ? " light" : "");
    var wtools = editMode
      ? '<button class="tbtn" data-wday="' + day.date + '" title="Rename this day">✎</button>' : "";

    return '<article class="' + cls + '" id="d-' + day.date + '">' +
      '<div class="day-head"><div class="left">' +
      '<span class="pill">' + esc(day.title) + "</span>" +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="pill pill-on">TODAY</span>' : "") +
      (isNext ? '<span class="pill pill-on">STARTS TOMORROW</span>' : "") +
      (day.time ? '<span class="day-date">· ' + esc(day.time) + "</span>" : "") +
      '</div><span class="day-wrap">' + wtools +
      '<span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></span></div>" +
      '<div class="day-cols">' +
      colBox("01", "DSA", "dsa", dsa, day, "dsa") +
      colBox("02", "DEV", "dev", dev, day, "dev") +
      "</div></article>";
  }

  /* ============================================================
     WEEK SUMMARY — derived from the items, so edits show up
     ============================================================ */
  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }
  function pchip(t, d) {
    return '<span class="pchip ' + (d || "") + '">' + esc(t) + (d ? '<span class="d">' + diffLabel(d) + "</span>" : "") + "</span>";
  }

  function weekSummaryHTML(w) {
    var dsaItems = [], devItems = [];
    w.days.forEach(function (d) {
      d.items.forEach(function (it) { (it.track === "dsa" ? dsaItems : devItems).push(it); });
    });

    var problems = dedupe(dsaItems.filter(function (i) { return i.type === "dsa"; }).map(function (i) { return pchip(i.title, i.diff); }));
    var watch = dsaItems.filter(function (i) { return i.type === "watch"; })[0];
    var concepts = dedupe(dsaItems.filter(function (i) { return i.type === "theory"; }).map(function (i) { return esc(i.title.replace(/^[^—]*— /, "")); }));
    var stretches = dedupe(dsaItems.filter(function (i) { return i.type === "stretch"; }).map(function (i) { return pchip(i.title, i.diff); }));
    var study = dedupe(devItems.filter(function (i) { return i.type === "theory"; }).map(function (i) { return esc(i.title.replace(/^[^—]*— /, "")); }));
    var build = dedupe(devItems.filter(function (i) { return i.type === "dev" || i.type === "project"; }).map(function (i) { return esc(i.title); }));
    var career = dedupe(devItems.filter(function (i) { return i.type === "career"; }).map(function (i) { return esc(i.title); }));

    var row = function (k, v) { return v ? '<div class="trow"><span class="sum-k">' + k + '</span><div class="sum-v">' + v + "</div></div>" : ""; };
    var line = function (k, arr) {
      return arr.length ? '<div class="trow"><span class="sum-k">' + k + '</span><div class="sum-v plain">' +
        arr.map(function (x) { return '<div class="sumline">' + x + "</div>"; }).join("") + "</div></div>" : "";
    };

    var b1 = '<div class="wbox dsa"><div class="wbox-h">01 · DSA</div><div class="wbox-b">' +
      (w.pattern ? row("Pattern", '<span class="plain">' + esc(w.pattern) + "</span>") : "") +
      (watch ? row("Watch 1st", '<span class="plain"><a href="' + watch.url + '" target="_blank" rel="noopener">' + esc(watch.vtitle || watch.title) + '</a><span class="a"> · ' + esc(watch.vauthor || "") + "</span></span>") : "") +
      (problems.length ? row("Problems", '<span class="sumcount">' + problems.length + "</span>" + problems.join("")) : "") +
      (concepts.length ? line("Concepts", concepts) : "") +
      (stretches.length ? row("Stretch", stretches.join("")) : "") +
      row("Day 7", '<span class="plain">' + (w.mode === "sprint" ? "Consolidation" : (w.n >= 10 ? "Timed set: 2 unseen mediums, 60 min" : "Re-solve cold")) + "</span>") +
      "</div></div>";

    var b2 = '<div class="wbox dev"><div class="wbox-h">02 · DEV</div><div class="wbox-b">' +
      (study.length ? line("Study", study) : "") +
      (build.length ? line("Build", build) : "") +
      (career.length ? line("Career", career) : "") +
      (!study.length && !build.length && !career.length ? '<div class="dim">—</div>' : "") +
      "</div></div>";

    return '<div class="wk-sum two">' + b1 + b2 + "</div>";
  }

  function weekHTML(w) {
    var st = weekStats(w);
    var isActive = w.n === ACTIVE_WEEK;
    var badge = w.mode === "exam" ? '<span class="wtag exam">EXAMS</span>'
      : w.mode === "transition" ? '<span class="wtag trans">TRANSITION</span>'
      : w.mode === "sprint" ? '<span class="wtag sprint">SPRINT</span>' : "";
    var wtools = editMode ? '<button class="tbtn" data-wweek="' + w.n + '" title="Edit week">✎</button>' : "";

    return '<section class="wk' + (isActive ? " open active" : "") + '" id="w' + w.n + '" data-week="' + w.n + '">' +
      '<div class="wk-head" data-toggle="' + w.n + '">' +
      '<div class="wk-left"><span class="wk-num">W' + w.n + "</span>" +
      '<div class="wk-title"><h3>' + esc(w.theme) + "</h3>" +
      '<div class="wk-dates">' + shortDate(w.days[0].date) + " → " + shortDate(w.days[6].date) +
      (w.goal ? " · " + esc(w.goal) : "") + "</div></div></div>" +
      '<div class="wk-right">' + badge +
      '<div class="mini-bar"><div style="width:' + st.pct + '%"></div></div>' +
      '<span class="day-count">' + st.done + "/" + st.total + "</span>" +
      '<span class="wk-tools">' + wtools + '</span><span class="caret">▾</span></div></div>' +
      (w.note ? '<div class="wk-note">' + esc(w.note) + "</div>" : "") +
      weekSummaryHTML(w) +
      '<div class="wk-body">' + w.days.map(dayHTML).join("") + "</div></section>";
  }

  /* ============================================================
     OVERVIEW — what we have to cover
     ============================================================ */
  function overviewHTML() {
    var pc = problemCount();
    var html = '<section id="overview">';

    html += '<h2>The three projects</h2><div class="grid three">' +
      '<div class="card proj"><div class="proj-n">01</div><h4>DSA</h4><p class="proj-tag">The gate. 90% of the interview.</p><ul>' +
      [pc + " problems, two a day", "Striver A2Z to learn · NeetCode 150 to revise", "Aditya Verma for DP, recursion, stacks",
       "Timed set every week from W10", "Bar: easy under 15 min, medium under 30"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card proj"><div class="proj-n">02</div><h4>CS Fundamentals</h4><p class="proj-tag">One round of the loop.</p><ul>' +
      [db.csAreas.length + " areas, 30 minutes a day", "Gate Smashers for OS, DBMS, CN", "LeetCode SQL 50 for queries",
       "Java internals and OOP", "AI fundamentals for AI interviews"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="card proj"><div class="proj-n">03</div><h4>DEV</h4><p class="proj-tag">The differentiator.</p><ul>' +
      ["Agentic AI: RAG, agents, evals", "Two deployed projects with eval scores", "LLD and HLD",
       "Java for DSA, Python for AI", "Applications from week 8"].map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") +
      "</ul></div></div>";

    html += '<h2 id="csfund">CS Fundamentals — what to cover</h2><p class="lead">These are the topics for the second box of your prep. Thirty minutes a day, one at a time, in your own words.</p>';
    html += '<div class="grid">' + db.csAreas.map(function (a, ai) {
      var t = editMode ? '<button class="tbtn" data-editcsarea="' + ai + '" title="Edit area">✎</button>' : "";
      var add = editMode ? '<button class="addbtn" data-addcstopic="' + ai + '" title="Add topic">＋</button>' : "";
      return '<div class="card"><h4>' + esc(a.name) + t + '</h4><p class="dim tiny">' + esc(a.weeks || "") + "</p><ul>" +
        a.topics.map(function (tp, ti) {
          return "<li>" + esc(typeof tp === "string" ? tp : tp.label) +
            (editMode ? ' <button class="tbtn tiny" data-delcstopic="' + ai + ':' + ti + '" title="Remove">✕</button>' : "") + "</li>";
        }).join("") + "</ul>" +
        '<div class="links">' + a.links.map(function (l) {
          return '<a href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
        }).join("") + "</div>" +
        '<div class="card-tools">' + add + "</div></div>";
    }).join("") + "</div>";

    html += "<h2>All the weeks</h2>";
    html += '<div class="tablewrap"><table><thead><tr><th>Week</th><th>Dates</th><th>Theme</th><th>Problems</th></tr></thead><tbody>' +
      db.weeks.map(function (w) {
        var probs = dedupe(w.days.reduce(function (a, d) {
          return a.concat(d.items.filter(function (i) { return i.type === "dsa"; }).map(function (i) { return i.title; }));
        }, []));
        return '<tr class="idxrow" data-goto="w' + w.n + '">' +
          '<td><span class="pill sm">W' + w.n + "</span></td>" +
          '<td class="dim">' + shortDate(w.days[0].date) + " – " + shortDate(w.days[6].date) + "</td>" +
          "<td>" + esc(w.theme) + (w.mode === "exam" ? ' <span class="wtag exam" style="font-size:9px;padding:1px 6px">EXAMS</span>' : "") + "</td>" +
          '<td class="num">' + probs.length + "</td></tr>";
      }).join("") + "</tbody></table></div>";

    html += "</section>";
    return html;
  }

  /* ============================================================
     OTHER SECTIONS
     ============================================================ */
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
    html += '<h3>STAR — the round everyone underestimates</h3><div class="grid">' + D.FAANG.star.map(function (x) {
      return '<div class="card tight"><h4>' + esc(x[0]) + "</h4><p>" + esc(x[1]) + "</p></div>";
    }).join("") + "</div></section>";
    return html;
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
    ["dsa", "DSA volume", ["Too little", "About right", "Too much"]],
    ["cs", "CS Fundamentals depth", ["Too shallow", "About right", "Too deep"]],
    ["ai", "DEV / AI load", ["Too little", "About right", "Too much — DSA will suffer"]],
    ["exam", "Exam weeks (45 min/day)", ["Too light", "About right", "Too heavy for endsems"]],
    ["time", "Daily budget (2h 45m)", ["Unrealistic", "Tight but doable", "Comfortable"]],
    ["apply", "Applications from week 8", ["Too late", "About right", "Too early"]]
  ];

  function rv(sec, key) {
    var r = state.review;
    return (r && r[sec] && r[sec][key]) || "";
  }
  function reviewMarkdown() {
    var L = [];
    L.push("# The Grind — plan review");
    L.push("");
    L.push("**Plan by:** " + AUTHOR + "  ");
    L.push("**Reviewer:** " + (state.review.name || "(unnamed)") + "  ");
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
    db.weeks.forEach(function (w) {
      var c = rv("w", String(w.n));
      if (c) L.push("| W" + w.n + " | " + w.theme + " | " + c.replace(/\|/g, "/").replace(/\n/g, " ") + " |");
    });
    L.push(""); L.push("---"); L.push("Generated from The Grind.");
    return L.join("\n");
  }

  function reviewHTML() {
    var html = '<section id="review"><h2>Review</h2>' +
      '<p class="lead">For an audit: pick a verdict, comment where you disagree, then download the file and send it back. Nothing leaves this browser until you do.</p>';
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
             ["add", "What is missing", "Anything that isn't here?"],
             ["final", "Final instruction", "One paragraph to read every Monday."]].map(function (a) {
      return '<div class="card" style="margin-bottom:14px"><h4>' + esc(a[1]) + "</h4><p>" + esc(a[2]) + "</p>" +
        '<textarea data-rk="a:' + a[0] + '" rows="3" placeholder="...">' + esc(rv("a", a[0])) + "</textarea></div>";
    }).join("");
    html += "<h3>Week by week</h3><p class=\"dim tiny\">Comment only where you disagree. Empty means approved.</p>";
    html += '<div class="wklist">' + db.weeks.map(function (w) {
      return '<div class="wkrow"><span class="pill sm">W' + w.n + "</span>" +
        '<input type="text" data-rk="w:' + w.n + '" placeholder="' + esc(w.theme) + '" value="' + esc(rv("w", String(w.n))) + '"></div>';
    }).join("") + "</div>";
    html += '<div class="form" style="margin-top:22px"><button id="rvDownload" class="btn solid">Download review .md</button>' +
      '<button id="rvCopy" class="btn">Copy as text</button>' +
      '<button id="rvClear" class="btn">Clear</button>' +
      '<span id="rvStatus" class="dim tiny" style="align-self:center"></span></div></section>';
    return html;
  }

  function navHTML() {
    var parts = ['<a href="#overview" class="navchip">Overview</a>'];
    db.weeks.forEach(function (w) {
      parts.push('<a href="#w' + w.n + '" class="navchip' + (w.n === ACTIVE_WEEK ? " on" : "") + '" data-nav="' + w.n + '">W' + w.n + "</a>");
    });
    parts.push('<a href="#faang" class="navchip">FAANG</a>');
    parts.push('<a href="#links" class="navchip">Links</a>');
    parts.push('<a href="#review" class="navchip">Review</a>');
    return parts.join("");
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var y = window.scrollY;
    var html = overviewHTML();
    html += '<section id="plan"><div class="plan-head"><h2>Week by week</h2>' +
      '<div class="plan-tools"><button id="expandAll" class="btn">Expand all</button>' +
      '<button id="collapseAll" class="btn">Collapse all</button></div></div>' +
      '<p class="lead">Two boxes a day: <b>01 DSA</b> is problem solving, <b>02 DEV</b> is everything else — CS study, building, applications. Click a week to open it.</p>' +
      db.weeks.map(weekHTML).join("") + "</section>";
    html += faangHTML();
    html += resourcesHTML();
    html += reviewHTML();

    root.innerHTML = html;
    document.getElementById("navchips").innerHTML = navHTML();
    refreshHeader();
    window.scrollTo(0, y);
  }

  function refreshHeader() {
    var o = overall();
    document.getElementById("overallbar").style.width = o.pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " (" + (o.pct > 0 && o.pct < 10 ? o.pct.toFixed(1) : Math.round(o.pct)) + "%)";
    var left = D.diffDays(TODAY, D.PLACEMENT_SEASON);
    document.getElementById("countdown").textContent = left > 0 ? left + " days to placements" : "placement season";
    var label;
    if (TODAY < db.weeks[0].days[0].date) label = "Starts " + fmtDate(db.weeks[0].days[0].date);
    else if (TODAY > LAST_DATE) label = "22 weeks complete";
    else label = "Day " + (D.diffDays(db.weeks[0].days[0].date, TODAY) + 1) + " of " + allDays().length;
    document.getElementById("todayLabel").textContent = (PREVIEW ? "Preview · " : "") + label;
  }

  /* ============================================================
     MODAL
     ============================================================ */
  function openModal(title, bodyHTML, onSave, extra) {
    var wrap = document.getElementById("modal");
    wrap.innerHTML = '<div class="modal"><div class="modal-h"><b>' + esc(title) + '</b><button class="tbtn" data-close="1">✕</button></div>' +
      '<div class="modal-b">' + bodyHTML + '</div>' +
      '<div class="modal-f"><button class="btn solid" data-save="1">Save</button>' +
      (extra && extra.delete ? '<button class="btn danger" data-delete="1">Delete</button>' : "") +
      '<button class="btn" data-close="1">Cancel</button></div></div>';
    wrap.style.display = "grid";
    var first = wrap.querySelector("input,textarea,select");
    if (first) first.focus();

    wrap.querySelectorAll("[data-save],[data-close],[data-delete]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-save")) {
          var vals = {};
          wrap.querySelectorAll("[data-f]").forEach(function (f) { vals[f.getAttribute("data-f")] = f.value.trim(); });
          wrap.style.display = "none";
          onSave(vals);
        } else if (b.getAttribute("data-delete")) {
          wrap.style.display = "none";
          extra.onDelete();
        } else {
          wrap.style.display = "none";
        }
      });
    });
  }
  function field(label, name, value, opts) {
    opts = opts || {};
    if (opts.type === "textarea") {
      return '<label class="fld"><span>' + esc(label) + '</span><textarea data-f="' + name + '" rows="3">' + esc(value || "") + "</textarea></label>";
    }
    if (opts.options) {
      return '<label class="fld"><span>' + esc(label) + '</span><select data-f="' + name + '">' +
        opts.options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (value === o[0] ? " selected" : "") + ">" + esc(o[1]) + "</option>"; }).join("") +
        "</select></label>";
    }
    return '<label class="fld"><span>' + esc(label) + '</span><input type="text" data-f="' + name + '" value="' + esc(value || "") + '" placeholder="' + esc(opts.ph || "") + '"></label>';
  }

  var TYPES = [["dsa", "DSA problem"], ["stretch", "Stretch problem"], ["watch", "Watch-first video"], ["theory", "CS Fundamentals topic"], ["dev", "Build / AI task"], ["project", "Deliverable"], ["career", "Career task"], ["review", "Review / other"]];

  function itemModal(existing, dayDate, track) {
    var it = existing || { title: "", url: "", diff: "", type: track === "dsa" ? "dsa" : "dev", hint: "", vtitle: "", vauthor: "", track: track };
    var body =
      field("Title", "title", it.title, { ph: "Two Sum / Build the RAG retriever" }) +
      field("Link (optional)", "url", it.url) +
      field("Box", "track", it.track === "dsa" ? "dsa" : "dev", { options: [["dsa", "01 DSA"], ["dev", "02 DEV"]] }) +
      field("Type", "type", it.type, { options: TYPES }) +
      field("Difficulty", "diff", it.diff, { options: [["", "—"], ["E", "easy"], ["M", "medium"], ["H", "hard"]] }) +
      field("Video title (optional)", "vtitle", it.vtitle) +
      field("Channel (optional)", "vauthor", it.vauthor) +
      field("How to do it", "hint", it.hint, { type: "textarea" });

    openModal(existing ? "Edit item" : "Add item", body, function (v) {
      if (!v.title) { toast("Title is required"); return; }
      if (existing) {
        Object.assign(existing, { title: v.title, url: v.url, track: v.track, type: v.type, diff: v.diff, hint: v.hint, vtitle: v.vtitle, vauthor: v.vauthor });
        toast("Item updated");
      } else {
        var d = allDays().filter(function (x) { return x.date === dayDate; })[0];
        d.items.push({ id: uid(), type: v.type, track: v.track, title: v.title, url: v.url, diff: v.diff, hint: v.hint, vtitle: v.vtitle, vauthor: v.vauthor });
        toast("Item added");
      }
      saveDB(); render();
    });
  }

  function weekModal(w) {
    var body = field("Theme", "theme", w.theme) + field("One-line goal", "goal", w.goal) + field("Note (shown in the week)", "note", w.note, { type: "textarea" });
    openModal("Week " + w.n, body, function (v) {
      w.theme = v.theme || w.theme; w.goal = v.goal; w.note = v.note;
      saveDB(); render(); toast("Week updated");
    });
  }

  function dayModal(d) {
    var body = field("Day title", "title", d.title) + field("Time", "time", d.time);
    openModal("Day — " + fmtDate(d.date), body, function (v) {
      d.title = v.title || d.title; d.time = v.time;
      saveDB(); render(); toast("Day updated");
    });
  }

  function csAreaModal(area, idx) {
    var body = field("Area name", "name", area.name) +
      field("When (e.g. Weeks 8-9)", "weeks", area.weeks) +
      field("Topics (one per line)", "topics", area.topics.join("\n"), { type: "textarea" }) +
      field("Links (Label | URL, one per line)", "links", area.links.map(function (l) { return l.label + " | " + l.url; }).join("\n"), { type: "textarea" });
    openModal("CS area", body, function (v) {
      area.name = v.name || area.name; area.weeks = v.weeks;
      area.topics = v.topics.split("\n").map(function (x) { return x.trim(); }).filter(Boolean);
      area.links = v.links.split("\n").map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) {
        var p = x.split("|"); return { label: (p[0] || "").trim(), url: (p[1] || "").trim() };
      }).filter(function (l) { return l.url; });
      saveDB(); render(); toast("CS area updated");
    }, { delete: true, onDelete: function () { db.csAreas.splice(idx, 1); saveDB(); render(); toast("CS area deleted"); } });
  }

  /* ============================================================
     TOAST
     ============================================================ */
  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ""; }, 2600);
  }

  /* ============================================================
     EVENTS
     ============================================================ */
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
      var st = weekStats(weekByN(Number(wk.getAttribute("data-week"))));
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
  });

  document.addEventListener("click", function (e) {
    var t = e.target;

    var tg = t.closest("[data-toggle]");
    if (tg) { var sec = tg.closest(".wk"); if (sec) sec.classList.toggle("open"); return; }

    var go = t.closest("[data-goto]");
    if (go) {
      var s2 = document.getElementById(go.getAttribute("data-goto"));
      if (s2) { s2.classList.add("open"); s2.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }

    if (t.id === "expandAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.add("open"); }); return; }
    if (t.id === "collapseAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.remove("open"); }); return; }
    if (t.id === "jumpToday") {
      var tt = document.getElementById("w" + ACTIVE_WEEK);
      if (tt) { tt.classList.add("open"); tt.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }
    if (t.id === "topBtn") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (t.id === "editBtn") { setEdit(!editMode); return; }
    if (t.id === "restoreBtn") {
      if (confirm("Restore the original plan? Your added, edited and deleted items will be lost. Checkmarks stay.")) restoreDB();
      return;
    }
    if (t.id === "exportBtn") { exportDB(); return; }
    if (t.id === "importBtn") { document.getElementById("importFile").click(); return; }

    var ed = t.closest("[data-edit]");
    if (ed) { var f = findItem(ed.getAttribute("data-edit")); if (f) itemModal(f.item, f.day.date, f.item.track); return; }

    var del = t.closest("[data-del]");
    if (del) {
      var fi = findItem(del.getAttribute("data-del"));
      if (fi && confirm('Delete "' + fi.item.title + '"?')) {
        fi.day.items = fi.day.items.filter(function (x) { return x.id !== fi.item.id; });
        delete state.done[fi.item.id]; save(); saveDB(); render(); toast("Item deleted");
      }
      return;
    }

    var add = t.closest("[data-add]");
    if (add) { itemModal(null, add.getAttribute("data-add"), add.getAttribute("data-track")); return; }

    var ww = t.closest("[data-wweek]");
    if (ww) { weekModal(weekByN(Number(ww.getAttribute("data-wweek")))); return; }

    var wd = t.closest("[data-wday]");
    if (wd) { dayModal(allDays().filter(function (x) { return x.date === wd.getAttribute("data-wday"); })[0]); return; }

    var ea = t.closest("[data-editcsarea]");
    if (ea) { csAreaModal(db.csAreas[Number(ea.getAttribute("data-editcsarea"))], Number(ea.getAttribute("data-editcsarea"))); return; }

    var at = t.closest("[data-addcstopic]");
    if (at) {
      var ai = Number(at.getAttribute("data-addcstopic"));
      var area = db.csAreas[ai];
      var body = field("Topic", "label", "") + field("Link (optional)", "url", "");
      openModal("Add topic to " + area.name, body, function (v) {
        if (!v.label) { toast("Topic is required"); return; }
        area.topics.push(v.label);
        if (v.url) area.links.push({ label: v.label, url: v.url });
        saveDB(); render(); toast("Topic added");
      });
      return;
    }

    var dt = t.closest("[data-delcstopic]");
    if (dt) {
      var pr = dt.getAttribute("data-delcstopic").split(":");
      db.csAreas[Number(pr[0])].topics.splice(Number(pr[1]), 1);
      saveDB(); render(); toast("Topic removed");
      return;
    }

    if (t.id === "rvDownload") {
      var text = reviewMarkdown();
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
      a.download = "the-grind-review-" + iso(new Date()) + ".md";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      document.getElementById("rvStatus").textContent = "downloaded";
      return;
    }
    if (t.id === "rvCopy") {
      var txt = reviewMarkdown(), s2 = document.getElementById("rvStatus");
      function fb() {
        var ta = document.createElement("textarea"); ta.value = txt;
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); s2.textContent = "copied"; } catch (err) { s2.textContent = "copy failed — use Download"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { s2.textContent = "copied"; }, fb);
      else fb();
      return;
    }
    if (t.id === "rvClear") {
      if (!confirm("Clear the whole review?")) return;
      state.review = { v: {}, a: {}, w: {}, name: "" }; save(); render();
      document.getElementById("review").scrollIntoView();
    }
  });

  document.getElementById("importFile").addEventListener("change", function (e) {
    if (e.target.files && e.target.files[0]) importDB(e.target.files[0]);
    e.target.value = "";
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all checkmarks and review notes? The plan itself is untouched.")) return;
    state = { done: {}, review: { v: {}, a: {}, w: {}, name: "" } };
    save(); location.reload();
  });

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "p" || e.key === "P") { setPen(!penOn); }
    else if (e.key === "e" || e.key === "E") { setEdit(!editMode); }
    else if (e.key === "Escape") { if (penOn) setPen(false); if (editMode) setEdit(false); }
  });

  /* ============================================================
     PEN LAYER
     ============================================================ */
  var penOn = false;
  (function pen() {
    var canvas = document.getElementById("penCanvas");
    var ctx = canvas.getContext("2d");
    var toggle = document.getElementById("penToggle");
    var on = false, drawing = null;
    var strokes = [], color = "#3ddc97", width = 4, fade = 30, raf = null, dpr = 1;

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
      ctx.globalAlpha = alpha; ctx.strokeStyle = s.color; ctx.fillStyle = s.color;
      ctx.lineWidth = s.w; ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, s.w / 2, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (var i = 1; i < pts.length - 1; i++) {
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.stroke();
    }
    function tick(now) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      var keep = [];
      for (var i = 0; i < strokes.length; i++) {
        var s = strokes[i], age = (now - s.born) / 1000, a = 1;
        if (fade > 0) { if (age > fade) continue; var hold = fade * 0.4; a = age <= hold ? 1 : 1 - (age - hold) / (fade - hold); }
        drawStroke(s, Math.max(0, Math.min(1, a)));
        keep.push(s);
      }
      strokes = keep; ctx.globalAlpha = 1;
      if (on || strokes.length) raf = requestAnimationFrame(tick);
      else { raf = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }
    function start() { size(); if (raf === null) raf = requestAnimationFrame(tick); }
    window.setPen = function (v) {
      penOn = on = v;
      document.body.classList.toggle("pen-on", v);
      toggle.textContent = v ? "✕ Done" : "✎ Pen";
      if (v) start();
    };
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    canvas.addEventListener("pointerdown", function (e) {
      if (!on) return;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      drawing = { pts: [pos(e)], color: color, w: width, born: performance.now() };
      strokes.push(drawing); e.preventDefault();
    });
    canvas.addEventListener("pointermove", function (e) { if (drawing) { drawing.pts.push(pos(e)); e.preventDefault(); } });
    canvas.addEventListener("pointerup", function () { drawing = null; });
    canvas.addEventListener("pointercancel", function () { drawing = null; });
    toggle.addEventListener("click", function () { setPen(!on); });
    document.getElementById("penExit").addEventListener("click", function () { setPen(false); });
    document.getElementById("penClear").addEventListener("click", function () { strokes = []; });
    document.querySelectorAll(".sw").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".sw").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on"); color = b.getAttribute("data-color");
      });
    });
    document.getElementById("penSize").addEventListener("change", function (e) { width = Number(e.target.value); });
    document.getElementById("penFade").addEventListener("change", function (e) { fade = Number(e.target.value); });
    window.addEventListener("resize", function () { if (on) size(); });
  })();

  render();
})();
