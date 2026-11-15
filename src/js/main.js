/* ============================================================
   The Grind — main.js
   Boots the app. Everything else is wired by the time this runs.
   ============================================================ */
(function () {
  "use strict";

  var toastTimer = null;
  window.TG.toast = function (msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "show";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.className = ""; }, 2600);
  };

  document.getElementById("editbar").style.display = "none";
  window.TG.ui.render();
})();
