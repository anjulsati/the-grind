/* ============================================================
   The Grind — notes.js
   Draggable, minimisable sticky notes with rich text,
   author tags and auto date/time. Persisted in localStorage.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "the-grind-notes-v1";
  var authors = ["Anjul Sati", "Anurag"];
  var noteCounter = 0;
  var notes = load();
  var activeDrag = null;
  var activeNote = null;

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(notes)); } catch (e) {}
  }

  function now() {
    var d = new Date();
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  function uid() { return "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

  /* ============================================================
     CREATE
     ============================================================ */
  function createNote(x, y, author) {
    var id = uid();
    var note = {
      id: id,
      author: author || authors[0],
      created: now(),
      updated: now(),
      x: (x || window.innerWidth / 2 - 180) + window.scrollX + (Math.random() - 0.5) * 100,
      y: (y || window.innerHeight / 2 - 150) + window.scrollY + (Math.random() - 0.5) * 80,
      w: 380,
      h: "auto",
      minimized: false,
      html: "<p><br></p>"
    };
    notes.push(note);
    save();
    renderNote(note);
    return note;
  }

  /* ============================================================
     RENDER ONE NOTE
     ============================================================ */
  function renderNote(note) {
    var el = document.getElementById("note-" + note.id);
    if (!el) {
      el = document.createElement("div");
      el.className = "sticky-note";
      el.id = "note-" + note.id;
      document.body.appendChild(el);
    }

    if (note.minimized) {
      el.innerHTML =
        '<div class="sn-minimized" data-nid="' + note.id + '">' +
          '<span class="sn-avatar" data-author="' + esc(note.author) + '">' + esc(note.author.charAt(0)) + "</span>" +
          '<span class="sn-mini-text">' + esc(stripHtml(note.html).slice(0, 40) || "Empty note") + "</span>" +
          '<span class="sn-mini-meta">' + esc(note.author.split(" ")[0]) + " · " + esc(note.created.split(" · ")[0]) + "</span>" +
          '<button class="sn-expand" data-expand="' + note.id + '" title="Expand">▣</button>' +
          '<button class="sn-close" data-remove="' + note.id + '" title="Delete">✕</button>' +
        "</div>";
      el.style.left = note.x + "px";
      el.style.top = note.y + "px";
      el.style.width = "280px";
      el.classList.add("minimized");
    } else {
      el.innerHTML =
        '<div class="sn-header">' +
          '<span class="sn-grip" title="Drag to move">⠿</span>' +
          '<span class="sn-avatar" data-author="' + esc(note.author) + '">' + esc(note.author.charAt(0)) + "</span>" +
          '<span class="sn-author">' + esc(note.author) + "</span>" +
          '<span class="sn-date">' + esc(note.created) + "</span>" +
          '<button class="sn-btn" data-minimize="' + note.id + '" title="Minimise">▁</button>' +
          '<button class="sn-btn danger" data-remove="' + note.id + '" title="Delete">✕</button>' +
        "</div>" +
        '<div class="sn-toolbar">' +
          '<button class="sn-fmt" data-cmd="bold" title="Bold (Ctrl+B)"><b>B</b></button>' +
          '<button class="sn-fmt" data-cmd="italic" title="Italic (Ctrl+I)"><i>I</i></button>' +
          '<button class="sn-fmt" data-cmd="underline" title="Underline (Ctrl+U)"><u>U</u></button>' +
          '<button class="sn-fmt" data-cmd="strikeThrough" title="Strikethrough"><s>S</s></button>' +
          '<span class="sn-sep"></span>' +
          '<button class="sn-fmt" data-cmd="insertUnorderedList" title="Bullet list">•≡</button>' +
          '<button class="sn-fmt" data-cmd="insertOrderedList" title="Numbered list">1≡</button>' +
          '<button class="sn-fmt" data-cmd="formatBlock" data-value="H3" title="Heading">H</button>' +
          '<button class="sn-fmt" data-cmd="formatBlock" data-value="BLOCKQUOTE" title="Quote">❝</button>' +
          '<button class="sn-fmt" data-cmd="formatBlock" data-value="P" title="Paragraph">¶</button>' +
          '<span class="sn-sep"></span>' +
          '<button class="sn-fmt" data-cmd="createLink" title="Add link">🔗</button>' +
          '<button class="sn-fmt" data-unlink title="Remove link">⛓</button>' +
          '<button class="sn-fmt" data-cmd="insertHorizontalRule" title="Divider">─</button>' +
          '<span class="sn-sep"></span>' +
          '<button class="sn-fmt" data-insert-checkbox title="Checkbox">☑</button>' +
        "</div>" +
        '<div class="sn-body" contenteditable="true" data-nid="' + note.id + '" data-placeholder="Write a note… paste links, add checkboxes, format with the toolbar above…">' + note.html + "</div>" +
        '<div class="sn-footer">' +
          '<span class="sn-updated">Updated ' + esc(note.updated) + "</span>" +
        "</div>";
      el.style.left = note.x + "px";
      el.style.top = note.y + "px";
      el.style.width = note.w + "px";
      el.classList.remove("minimized");

      /* wire contenteditable save */
      var body = el.querySelector(".sn-body");
      body.addEventListener("input", function () {
        note.html = body.innerHTML;
        note.updated = now();
        save();
        updateFooter(el, note);
      });
      body.addEventListener("focus", function () { activeNote = note; });

      /* toolbar */
      el.querySelectorAll(".sn-fmt").forEach(function (btn) {
        btn.addEventListener("mousedown", function (e) { e.preventDefault(); });
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          body.focus();
          var cmd = btn.getAttribute("data-cmd");
          if (btn.hasAttribute("data-insert-checkbox")) {
            document.execCommand("insertHTML", false,
              '<div class="sn-check"><input type="checkbox"><span> </span></div>');
            note.html = body.innerHTML; save();
            return;
          }
          if (cmd === "createLink") {
            var url = prompt("Paste a link:");
            if (url) document.execCommand("createLink", false, url);
          } else if (btn.hasAttribute("data-value")) {
            document.execCommand(cmd, false, btn.getAttribute("data-value"));
          } else {
            document.execCommand(cmd, false, null);
          }
          note.html = body.innerHTML; save();
        });
      });
    }
    attachDrag(el, note);
    attachControls(el, note);
  }

  function stripHtml(html) {
    var d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent || "";
  }
  function updateFooter(el, note) {
    var f = el.querySelector(".sn-updated");
    if (f) f.textContent = "Updated " + note.updated;
  }

  /* ============================================================
     DRAG
     ============================================================ */
  function attachDrag(el, note) {
    var grip = el.querySelector(".sn-grip") || el.querySelector(".sn-minimized");
    if (!grip) return;
    grip.style.cursor = "grab";

    grip.addEventListener("mousedown", function (e) {
      e.preventDefault();
      var sx = e.clientX - note.x;
      var sy = e.clientY - note.y;
      grip.style.cursor = "grabbing";

      function move(ev) {
        note.x = Math.max(0, ev.clientX + window.scrollX - sx);
        note.y = Math.max(0, ev.clientY + window.scrollY - sy);
        el.style.left = note.x + "px";
        el.style.top = note.y + "px";
      }
      function up() {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        grip.style.cursor = "grab";
        save();
      }
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });
  }

  /* ============================================================
     CONTROLS
     ============================================================ */
  function attachControls(el, note) {
    el.querySelectorAll("[data-minimize]").forEach(function (b) {
      b.addEventListener("click", function () {
        note.minimized = true; save(); renderNote(note);
      });
    });
    el.querySelectorAll("[data-expand]").forEach(function (b) {
      b.addEventListener("click", function () {
        note.minimized = false; save(); renderNote(note);
      });
    });
    el.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!confirm("Delete this note?")) return;
        notes = notes.filter(function (n) { return n.id !== note.id; });
        save();
        el.remove();
      });
    });
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============================================================
     PUBLIC API
     ============================================================ */
  function renderAll() {
    notes.forEach(renderNote);
  }

  function toggle() {
    var panel = document.getElementById("notePanel");
    if (panel) { panel.remove(); return; }

    panel = document.createElement("div");
    panel.id = "notePanel";
    panel.innerHTML =
      '<div class="np-head">Sticky Notes</div>' +
      '<div class="np-body">' +
        '<div class="np-author">' +
          '<span>Creating as:</span>' +
          '<select id="npAuthor"><option>Anjul Sati</option><option>Reviewer</option></select>' +
        "</div>" +
        '<button id="npCreate" class="np-create">＋ New note</button>' +
        '<div class="np-count">' + notes.length + " note" + (notes.length !== 1 ? "s" : "") + " on the page</div>" +
      "</div>";
    document.body.appendChild(panel);

    document.getElementById("npCreate").addEventListener("click", function () {
      var author = document.getElementById("npAuthor").value;
      var x = window.innerWidth / 2 - 190 + (Math.random() - 0.5) * 120;
      var y = window.innerHeight / 2 - 150 + (Math.random() - 0.5) * 80;
      createNote(x, y, author);
    });
  }

  function init() {
    renderAll();

    /* button handler */
    var btn = document.getElementById("noteBtn");
    if (btn) btn.addEventListener("click", toggle);

    /* keyboard */
    document.addEventListener("keydown", function (e) {
      if (e.target.matches("input, textarea, select, [contenteditable]")) return;
      if (e.key === "n" || e.key === "N") toggle();
    });
  }

  /* wait for DOM */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  TG.notes = { create: createNote, toggle: toggle, renderAll: renderAll, notes: notes };
})();
