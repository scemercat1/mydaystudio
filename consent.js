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

  var bar = document.createElement("div");
  bar.className = "consent";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-label", "Cookie consent");
  bar.innerHTML =
    '<p>We use Google Analytics to see how this site is used. <a href="privacy.html">Privacy policy</a></p>' +
    '<div class="consent-actions">' +
    '<button type="button" class="consent-btn ghost" data-c="denied">Decline</button>' +
    '<button type="button" class="consent-btn" data-c="granted">Accept</button>' +
    '</div>';

  bar.addEventListener("click", function (e) {
    var choice = e.target.getAttribute("data-c");
    if (!choice) return;
    try { localStorage.setItem(KEY, choice); } catch (err) {}
    update(choice === "granted");
    bar.remove();
  });

  document.body.appendChild(bar);
})();
