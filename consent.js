(function () {
  var KEY = "myday-consent";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  function update(granted) {
    if (typeof gtag === "function") {
      gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    }
  }

  if (stored === "granted") update(true);
  if (stored === "denied") update(false);
  if (stored) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var bar = document.createElement("div");
  bar.className = "consent";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-label", "Cookie consent");
  bar.setAttribute("aria-describedby", "consent-text");
  bar.innerHTML =
    '<div class="consent-icon" aria-hidden="true">🍪</div>' +
    '<div class="consent-body">' +
    '<p class="consent-title">Cookies for better stats</p>' +
    '<p id="consent-text" class="consent-text">We use Google Analytics to see how this site is used. Nothing runs until you say yes. <a href="privacy.html">Privacy policy</a></p>' +
    '</div>' +
    '<div class="consent-actions">' +
    '<button type="button" class="consent-btn ghost" data-c="denied">Decline</button>' +
    '<button type="button" class="consent-btn" data-c="granted">Accept</button>' +
    '</div>';

  // Keep the end of the page reachable while the banner is on screen
  function reserveSpace() {
    document.body.style.setProperty("--consent-space", bar.offsetHeight + 16 + "px");
  }

  function close() {
    window.removeEventListener("resize", reserveSpace);
    document.body.classList.remove("has-consent");
    document.body.style.removeProperty("--consent-space");
    if (reduceMotion) { bar.remove(); return; }
    bar.classList.add("is-leaving");
    bar.addEventListener("animationend", function () { bar.remove(); });
    setTimeout(function () { bar.remove(); }, 600);
  }

  bar.addEventListener("click", function (e) {
    var choice = e.target.getAttribute("data-c");
    if (!choice) return;
    try { localStorage.setItem(KEY, choice); } catch (err) {}
    update(choice === "granted");
    close();
  });

  // First in the tab order, so keyboard users reach it right away
  document.body.insertBefore(bar, document.body.firstChild);
  document.body.classList.add("has-consent");
  reserveSpace();
  window.addEventListener("resize", reserveSpace);
})();
