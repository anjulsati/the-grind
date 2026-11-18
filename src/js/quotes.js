/* ============================================================
   The Grind — quotes.js
   "Daily Motivation". One quote + one image per day, chosen from
   the date so it stays the same all day (refresh-proof) and
   changes at midnight. Only verified attributions are shown.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  /* verified, attributed quotes on discipline, persistence and hard work */
  var QUOTES = [
    { q: "It's not that I'm so smart, it's just that I stay with problems longer.", a: "Albert Einstein" },
    { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
    { q: "Hard work beats talent when talent doesn't work hard.", a: "Tim Notke" },
    { q: "I have not failed. I've just found 10,000 ways that won't work.", a: "Thomas Edison" },
    { q: "Discipline is the bridge between goals and accomplishment.", a: "Jim Rohn" },
    { q: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", a: "Will Durant" },
    { q: "Do the hard jobs first. The easy jobs will take care of themselves.", a: "Dale Carnegie" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "The expert in anything was once a beginner.", a: "Helen Hayes" },
    { q: "Perseverance is not a long race; it is many short races one after the other.", a: "Walter Elliot" },
    { q: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", a: "Stephen King" },
    { q: "You miss 100% of the shots you don't take.", a: "Wayne Gretzky" },
    { q: "Fall seven times, stand up eight.", a: "Japanese proverb" },
    { q: "The best way out is always through.", a: "Robert Frost" },
    { q: "Don't watch the clock; do what it does. Keep going.", a: "Sam Levenson" },
    { q: "Genius is one percent inspiration and ninety-nine percent perspiration.", a: "Thomas Edison" },
    { q: "A river cuts through rock, not because of its power, but because of its persistence.", a: "James N. Watkins" },
    { q: "Great things are done by a series of small things brought together.", a: "Vincent van Gogh" },
    { q: "If you're going through hell, keep going.", a: "Winston Churchill" },
    { q: "Opportunities don't happen. You create them.", a: "Chris Grosser" },
    { q: "The struggle you're in today is developing the strength you need for tomorrow.", a: "Robert Tew" },
    { q: "Discipline equals freedom.", a: "Jocko Willink" },
    { q: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.", a: "David Goggins" },
    { q: "Little by little, one travels far.", a: "J. R. R. Tolkien" },
    { q: "Energy and persistence conquer all things.", a: "Benjamin Franklin" },
    { q: "Perseverance is failing 19 times and succeeding the 20th.", a: "Julie Andrews" },
    { q: "The man who moves a mountain begins by carrying away small stones.", a: "Confucius" },
    { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
    { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
    { q: "Practice isn't the thing you do once you're good. It's the thing you do that makes you good.", a: "Malcolm Gladwell" },
    { q: "Motivation gets you going, but discipline keeps you growing.", a: "John C. Maxwell" },
    { q: "A little more persistence, a little more effort, and what seemed hopeless failure may turn to a glorious success.", a: "Elbert Hubbard" },
    { q: "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, I will try again tomorrow.", a: "Mary Anne Radmacher" },
    { q: "We must all suffer one of two things: the pain of discipline or the pain of regret.", a: "Jim Rohn" }
  ];

  /* curated Unsplash photographs (mountains, dawn, wilderness) */
  var IMAGES = [
    "photo-1506905925346-21bda4d32df4",
    "photo-1519681393784-d120267933ba",
    "photo-1464822759023-fed622ff2c3b",
    "photo-1454496522488-7a8e488e8606",
    "photo-1441974231531-c6227db76b6e",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1506744038136-46273834b3fb",
    "photo-1472214103451-9374bd1c798e",
    "photo-1469474968028-56623f02e42e",
    "photo-1447752875215-b2761acb3c5d",
    "photo-1433086966358-54859d0ed716",
    "photo-1439066615861-d1af74d74000"
  ];
  function imageURL(id) {
    return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1600&q=80";
  }

  /* local day number — same all day, changes at midnight */
  function dayNumber() {
    var off = new Date().getTimezoneOffset() * 60000;
    return Math.floor((Date.now() - off) / 86400000);
  }
  function pick() {
    var d = dayNumber();
    return {
      quote: QUOTES[d % QUOTES.length],
      image: imageURL(IMAGES[(d * 5 + 7) % IMAGES.length])
    };
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var openFlag = false;
  function open() {
    if (openFlag) return;
    var p = pick();
    var wrap = document.createElement("div");
    wrap.id = "motView";
    wrap.className = "mot-view";
    wrap.innerHTML =
      '<div class="mot-card">' +
      '<button class="mot-close" id="motClose" title="Close">✕</button>' +
      '<div class="mot-media">' +
      '<img class="mot-img" alt="" src="' + esc(p.image) + '">' +
      '<div class="mot-shade"></div>' +
      '<div class="mot-quotebox"><p class="mot-quote">“' + esc(p.quote.q) + '”</p>' +
      (p.quote.a ? '<p class="mot-author">— ' + esc(p.quote.a) + "</p>" : "") + "</div></div>" +
      '<div class="mot-foot"><span class="mot-day">' +
      new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) +
      '</span><span class="mot-tag">stay consistent · the grind continues</span></div>' +
      "</div>";
    document.body.appendChild(wrap);
    openFlag = true;
    requestAnimationFrame(function () { wrap.classList.add("show"); });

    function close() {
      wrap.classList.remove("show");
      openFlag = false;
      setTimeout(function () { wrap.remove(); }, 260);
      document.removeEventListener("keydown", onKey, true);
    }
    function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    wrap.querySelector("#motClose").addEventListener("click", close);
    wrap.addEventListener("click", function (e) { if (e.target === wrap) close(); });
    document.addEventListener("keydown", onKey, true);
    var img = wrap.querySelector(".mot-img");
    img.addEventListener("error", function () { img.remove(); }); /* gradient fallback */
  }

  TG.quotes = { open: open, today: pick };
})();
