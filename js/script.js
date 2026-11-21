/* Campus Life Super App - script.js (shared by all pages) */

/* ---------- Settings you should change ---------- */
// TODO: replace with your campus's coordinates (in Google Maps, right-click your campus and
// click the numbers at the top of the menu to copy them: latitude first, then longitude).
const CAMPUS = { lat: 42.5006, lon: -90.6646 };

// Base address for TheMealDB (free, no API key needed)
const MEALDB = "https://www.themealdb.com/api/json/v1/1";

// Run setup code once the page has finished loading
document.addEventListener("DOMContentLoaded", () => {
  initHome();
  initDining();
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

/* =========================================================
   DINING PAGE: meal cards (API #2: TheMealDB)
   ========================================================= */
function initDining() {
  const grid = document.getElementById("meal-grid");
  if (!grid) return; // this page has no meal grid, so it isn't the dining page

  const select = document.getElementById("category-select");
  const form = document.getElementById("meal-form");

  loadCategories();

  // Choosing a different category loads that category's meals
  select.addEventListener("change", () => loadMealsByCategory(select.value));

  // Submitting the form searches by name (or uses the category if the search box is empty)
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // stops the browser from reloading the page
    const term = document.getElementById("meal-search").value.trim();
    if (term) searchMeals(term);
    else loadMealsByCategory(select.value);
  });
}

// Fills the dropdown with TheMealDB's categories, then loads the first category's meals
async function loadCategories() {
  const select = document.getElementById("category-select");
  const status = document.getElementById("meal-status");
  try {
    const response = await fetch(`${MEALDB}/categories.php`);
    const data = await response.json();
    select.innerHTML = "";
    data.categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.strCategory;
      option.textContent = cat.strCategory;
      select.appendChild(option);
    });
    loadMealsByCategory(select.value);
  } catch (error) {
    console.error(error);
    status.textContent = "Categories could not load. Check your connection and reload the page.";
  }
}

// Gets all meals in one category
async function loadMealsByCategory(category) {
  await fetchMeals(`${MEALDB}/filter.php?c=${encodeURIComponent(category)}`, category + " meals");
}

// Gets meals whose name matches what the user typed
async function searchMeals(term) {
  await fetchMeals(`${MEALDB}/search.php?s=${encodeURIComponent(term)}`, `results for "${term}"`);
}

// Shared helper: requests a meal list, then hands it to renderMeals()
async function fetchMeals(url, label) {
  const status = document.getElementById("meal-status");
  status.textContent = "Loading meals...";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Request failed: " + response.status);
    const data = await response.json();
    renderMeals(data.meals || []); // the API sends null when nothing matches
    status.textContent = data.meals
      ? `Showing ${data.meals.length} ${label}.`
      : `No ${label} found. Try another search.`;
  } catch (error) {
    console.error(error);
    status.textContent = "Meals could not load. Check your connection and try again.";
  }
}

// Builds one Bootstrap card per meal. textContent is used (not innerHTML) so text from the API
// can't inject HTML into the page.
function renderMeals(meals) {
  const grid = document.getElementById("meal-grid");
  grid.innerHTML = ""; // clear old cards first
  meals.forEach((meal) => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-3";

    const card = document.createElement("article");
    card.className = "card meal-card h-100";

    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal; // alt text is the meal name
    img.loading = "lazy";
    img.className = "card-img-top";

    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("h3");
    title.className = "h6 card-title mb-0";
    title.textContent = meal.strMeal;

    body.appendChild(title);
    card.append(img, body);
    col.appendChild(card);
    grid.appendChild(col);
  });
  // TODO (later): "View details" button with a Bootstrap modal
  // TODO (later): "Add to favorites" saved with localStorage
}

// TODO: map page - Leaflet map, study spots