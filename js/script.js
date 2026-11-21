/* Campus Life Super App - script.js (shared by all pages) */

/* ---------- Settings you should change ---------- */
// TODO: replace with your campus's coordinates (in Google Maps, right-click your campus and
// click the numbers at the top of the menu to copy them: latitude first, then longitude).
const CAMPUS = { lat: 42.5006, lon: -90.6646 };

// Run setup code once the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  initHome();
});

/* =========================================================
   HOME PAGE: greeting, live clock, weather (API #1: Open-Meteo)
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

  // Weather loads when the page opens and again each time the button is clicked
  loadWeather();
  document.getElementById("refresh-weather").addEventListener("click", loadWeather);
}

// Turns Open-Meteo's numeric weather code into plain words
function describeWeather(code) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "Rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "Snow";
  if (code >= 95) return "Thunderstorm";
  return "Mixed conditions";
}

// Gets current weather from Open-Meteo (no API key needed) and fills in the weather card
async function loadWeather() {
  const status = document.getElementById("weather-status");
  status.textContent = "Loading weather...";

  const url = "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${CAMPUS.lat}&longitude=${CAMPUS.lon}` +
    "&current=temperature_2m,weather_code&temperature_unit=fahrenheit";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed: " + response.status);
    const data = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const desc = describeWeather(data.current.weather_code);

    document.getElementById("weather-temp").textContent = temp + "\u00B0F";
    document.getElementById("weather-desc").textContent = desc;

    // Simple advice based on the conditions and temperature
    let tip = "Comfortable for the walk to class.";
    if (desc === "Rain" || desc === "Drizzle" || desc === "Thunderstorm") tip = "Bring an umbrella.";
    else if (desc === "Snow") tip = "Wear boots and watch for ice.";
    else if (temp < 35) tip = "Wear a heavy coat.";
    else if (temp < 55) tip = "Bring a jacket.";
    document.getElementById("weather-tip").textContent = tip;
    status.textContent = "Updated just now.";
  } catch (error) {
    // Tell the user what happened and what to do
    console.error(error);
    status.textContent = "Weather could not load. Check your connection and select Refresh weather.";
  }
}

// TODO: dining page - categories, meal cards (TheMealDB)
// TODO: map page - Leaflet map, study spots