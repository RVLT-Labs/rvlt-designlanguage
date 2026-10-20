// Phone navigation drawer for the marketing mockups (DESIGN.md §16.7): a hamburger opens a
// full-height drawer over an espresso scrim. Focus moves in and is trapped, Esc / scrim / close /
// link tap closes it, focus returns to the button, and the page behind does not scroll.
// Markup: <button data-drawer-open aria-controls="drawer" aria-expanded="false">…</button>
//         <div id="drawer" class="drawer" role="dialog" aria-modal="true" aria-label="…" hidden>
//           <div class="drawer-scrim" data-drawer-close></div><div class="drawer-panel">… <button data-drawer-close>…</div>
//         </div>
(function () {
  var opener = document.querySelector("[data-drawer-open]");
  if (!opener) return;
  var drawer = document.getElementById(opener.getAttribute("aria-controls"));
  var panel = drawer.querySelector(".drawer-panel");
  var focusables = function () {
    return Array.prototype.slice.call(panel.querySelectorAll("a[href], button:not([disabled])"));
  };
  function open() {
    drawer.hidden = false;
    opener.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    var first = focusables()[0];
    if (first) first.focus();
    document.addEventListener("keydown", onKey);
  }
  function close(restore) {
    drawer.hidden = true;
    opener.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    if (restore !== false) opener.focus();
  }
  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key !== "Tab") return;
    var f = focusables();
    var i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  }
  opener.addEventListener("click", function () { drawer.hidden ? open() : close(); });
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("[data-drawer-close]")) close();
    else if (e.target.closest("a[href^='#']")) close(false);
  });
  // leaving the phone layout with the drawer open must not leave the page locked
  window.matchMedia("(min-width: 881px)").addEventListener("change", function (m) { if (m.matches && !drawer.hidden) close(false); });
})();
