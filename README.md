# Campus Life Super App

A multi-page web app for Loras College students that helps them plan their day: check the weather, find meal ideas, and pick a place to study on a campus map.

**Live site:** https://bsalty6.github.io/campus-life-super-app/ (works once GitHub Pages is turned on)

## Project description and purpose

College students often check several places before heading out: a weather app, a food site, and a map. The Campus Life Super App brings those into one place. The home page shows a greeting, a live clock, and the current weather on campus. The Dining page lets students browse meal ideas by category or search by name. The Map page shows study spots on an interactive campus map so students can find a good place to work.

## Technologies used

- HTML5 with semantic elements (`header`, `nav`, `main`, `section`, `footer`)
- CSS3 (custom styles, CSS variables, responsive rules)
- Bootstrap 5 (grid, navbar, cards, forms)
- JavaScript (event-driven programming and the `fetch` API)
- Open-Meteo API (live weather, no API key needed)
- TheMealDB API (meal categories and recipes, no API key needed)
- Leaflet and OpenStreetMap (interactive map)
- Git and GitHub, with GitHub Pages for deployment

## Setup and deployment instructions

**Run it locally**

1. Clone the repository:
   ```
   git clone https://github.com/bsalty6/campus-life-super-app.git
   cd campus-life-super-app
   ```
2. Open the folder in VS Code and open `index.html` with the Live Server extension (or open the file in a browser).
3. An internet connection is needed because the weather, meals, and map load from online services.

**Deploy with GitHub Pages**

1. Push the project to a public GitHub repository.
2. In the repository, go to Settings, then Pages.
3. Under "Build and deployment," choose "Deploy from a branch," select the `main` branch and the `/ (root)` folder, then save.
4. After a minute or two, the site is live at `https://YOUR-USERNAME.github.io/campus-life-super-app/`.

**Change the campus location**

In `js/script.js`, edit `CAMPUS` (the map center and weather location) and the `STUDY_SPOTS` list (name, latitude, longitude, noise level, and hours).

## Features and how to use them

- **Home page:** shows a time-of-day greeting, a live clock, and the current temperature and conditions on campus, with a short tip like "Bring a jacket." Select "Refresh weather" to update it.
- **Dining page:** choose a category from the dropdown to see meals, or type a meal name and select "Search meals." These are general meal ideas, not the dining hall menu.
- **Map page:** shows campus study spots as markers. Select a spot in the list or click a marker to zoom in and see its noise level and hours. Use the "Show" dropdown to filter by Quiet or Group spots.
- **Accessibility:** semantic HTML, a skip-to-content link, labeled form fields, alt text on meal photos, keyboard-accessible controls, and a visible focus outline.
- **Responsive design:** the layout adapts to desktop, tablet, and mobile, and the navigation collapses into a menu on small screens.

## Future improvements or stretch goals

- A "View details" window for each meal, with ingredients and instructions
- Favorite meals and study spots saved with localStorage
- A dark mode toggle
- More study spots, with photos
- Event listings and a campus calendar

## Credits

- Weather data: [Open-Meteo](https://open-meteo.com/)
- Meal data: [TheMealDB](https://www.themealdb.com/)
- Map data: [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, displayed with [Leaflet](https://leafletjs.com/)