"use strict";

(function () {
  const storageKey = "gyanig-theme";
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") preference = saved;
  } catch (_) {
    // The toggle still works when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll(".theme-toggle").forEach(function (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  // This script runs in the head so the chosen theme is set before painting.
  applyTheme();

  function onSystemThemeChange() {
    if (!preference) applyTheme();
  }
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener("change", onSystemThemeChange);
  } else {
    systemTheme.addListener(onSystemThemeChange);
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== storageKey && event.key !== null) return;
    preference = event.newValue === "light" || event.newValue === "dark"
      ? event.newValue
      : null;
    applyTheme();
  });

  // A page restored with Back/Forward may predate a choice made on another page.
  window.addEventListener("pageshow", function () {
    try {
      const saved = window.localStorage.getItem(storageKey);
      preference = saved === "light" || saved === "dark" ? saved : null;
    } catch (_) {
      // Preserve the current-page choice when storage is unavailable.
    }
    applyTheme();
  });

  // Bind at the document level so the static button works as soon as it appears.
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".theme-toggle")) return;
    preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme();
    try {
      window.localStorage.setItem(storageKey, preference);
    } catch (_) {
      // Keep the current-page preference even if it cannot be saved.
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTheme, { once: true });
  } else {
    applyTheme();
  }
})();
