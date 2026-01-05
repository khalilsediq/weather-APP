const apiKey = "7e65d992566547fb4909f210b55e5a2f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search-box input");
const searchBtn = document.querySelector(".search-box button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + "&appid=" + apiKey);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();

    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/1163/1163624.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
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
