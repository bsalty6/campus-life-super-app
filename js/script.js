/* Campus Life Super App - script.js (shared by all pages) */

// Run setup code once the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  initHome();
});

/* =========================================================
   HOME PAGE: greeting and live clock
   ========================================================= */
function initHome() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return; // this page has no greeting, so it isn't the home page

  // The greeting changes with the time of day
  const hour = new Date().getHours();
  greeting.textContent = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Real-time clock: show the time now, then update it every second
  const clock = document.getElementById("clock");
  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) +
      ", " + now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// TODO: home page - weather (Open-Meteo)
// TODO: dining page - categories, meal cards (TheMealDB)
// TODO: map page - Leaflet map, study spots