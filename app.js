const apiKey = "7e65d992566547fb4909f210b55e5a2f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + "&appid=" + apiKey);
  const errorElement = document.querySelector(".error");
  const weatherContainer = document.querySelector("#weatherContainer");

  if (response.status == 404) {
    errorElement.style.display = "block";
    // Hide error after 3 seconds
    setTimeout(() => {
      errorElement.style.display = "none";
    }, 3000);
  } else {
    errorElement.style.display = "none";
    var data = await response.json();

    console.log(data); // Optional: keep for debugging

    // Determine Day or Night
    const currentTime = new Date().getTime() / 1000; // Current time in seconds
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    // Check if it's day or night at the searched location
    // Note: This uses the user's current local time compared to the location's sunrise/sunset.
    // For more accuracy based on the *location's* time zone, we would need to offset currentTime with data.timezone.
    // However, usually day/night is perceived by the user's current time if they are there,
    // but for a weather app checking another city, we should ideally check that city's local time.
    // Let's stick to comparing simple timestamps first, which work generally well if we assume 'current moment'.

    // Actually, comparing timestamps is absolute. If currentTime (UTC) is between Sunrise (UTC) and Sunset (UTC), it's day there.
    // API returns UTC unix timestamps for sunrise/sunset.

    const body = document.querySelector("body");
    if (currentTime >= sunrise && currentTime < sunset) {
      body.classList.remove("night-background");
      body.classList.add("day-background");
    } else {
      body.classList.remove("day-background");
      body.classList.add("night-background");
    }

    // Determine weather icon
    let imageSrc = "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // Default Clear
    if (data.weather[0].main == "Clouds") {
      imageSrc = "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    } else if (data.weather[0].main == "Clear") {
      imageSrc = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    } else if (data.weather[0].main == "Rain") {
      imageSrc = "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    } else if (data.weather[0].main == "Drizzle") {
      imageSrc = "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";
    } else if (data.weather[0].main == "Mist") {
      imageSrc = "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }

    // Create new weather card HTML
    const card = document.createElement("div");
    card.classList.add("weather-card");

    // Capitalize Description
    const description = data.weather[0].description;
    const capitalizedDesc =
      description.charAt(0).toUpperCase() + description.slice(1);

    card.innerHTML = `
        <img src="${imageSrc}" class="weather-icon">
        <h1 class="temp">${Math.round(data.main.temp)}°C</h1>
        <h2 class="city">${data.name}, <span class="country">${
      data.sys.country
    }</span></h2>
        <p class="description">${capitalizedDesc}</p>
        <p class="feels-like">Feels like ${Math.round(
          data.main.feels_like
        )}°C</p>
        
        <div class="details">
            <div class="col">
                <img src="https://cdn-icons-png.flaticon.com/512/481/481427.png" class="icon-small">
                <div>
                    <p class="humidity">${data.main.humidity}%</p>
                    <p>Humidity</p>
                </div>
            </div>
            <div class="col">
                <img src="https://cdn-icons-png.flaticon.com/512/136/136712.png" class="icon-small">
                <div>
                    <p class="wind">${data.wind.speed} km/h</p>
                    <p>Wind Speed</p>
                </div>
            </div>
        </div>
    `;

    // Prepend the new card to the container (Newest on top)
    weatherContainer.prepend(card);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
