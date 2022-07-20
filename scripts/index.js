// html elements
let timeDisplay = document.querySelector(".weather-time");
let tempDisplay = document.querySelector(".weather-temp");
let cityDisplay = document.querySelector(".city-display");
let windDisplay = document.querySelector(".bi-wind");
let humidityDisplay = document.querySelector(".bi-droplet-half");
let forecastDisplay = document.querySelector(".forecast");
let weatherDesc = document.querySelector(".weather-desc");
let weatherIcon = document.querySelector(".weather-icon");

let searchForm = document.querySelector("form#search-form");

let currentLocationBtn = document.querySelector("#currentlocation");
let celsiusBtn = document.querySelector(".celsiusBtn");
let fahrenheitBtn = document.querySelector(".fahrenheitBtn");

// values
let units = "metric";
let apiKey = "d7f6d0659f67a7d0ccdfde0057bc3ea0";
let city = "los angeles";
let temp = 0;

// functions
function getCurrentTime() {
  let current = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[current.getDay()];
  let options = {
    hour: "2-digit",
    minute: "2-digit"
  };
  let time = current.toLocaleTimeString("en-US", options);

  return `${day} ${time}`;
}

function getDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  console.log(date.getDay());
  return day;
}

function searchSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  city = cityInput.value;
  searchCity(city);
}

function searchCity(city) {
  cityDisplay.innerHTML = city;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(getTemperature);
  axios.get(apiUrl).then(getCityCoordinates)
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function searchCurrentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(setCurrentLocation);
  getForecast(lat,long);
}

function setCurrentLocation(response) {
  city = response.data.name;
  cityDisplay.innerHTML = city;
  getTemperature(response);
}

function getTemperature(response) {
  let data = response.data;
  temp = data.main.temp;
  setTemperature(temp);
  setWind(response);
  setHumidity(response);
  setWeatherDisplay(response);
}

function getCityCoordinates(response) {
  let data = response.data;
  let lat = data.coord.lat;
  let long = data.coord.lon;
  getForecast(lat,long);
}

function getForecast(lat,long) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=${units}&appid=${apiKey}&exclude=current,minutely,hourly,alerts`;
  axios.get(apiUrl).then(setForecast);
}

function setForecast(response) {
  let data = response.data;
  let forecasts = data.daily;
  console.log(forecasts);
  let cards = "";
  forecasts.forEach(function (forecast, index) {
    if (index < 5) {
      let timestamp = forecast.dt;
      let min = forecast.temp.min;
      let max = forecast.temp.max;
      let iconCode = forecast.weather[0].icon;
      let iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
      let forecastCard = `
        <div class="col-sm-2">
          <div class="card">
            <div class="card-body">
              <img 
                class="forecast-icon"
                src=${iconUrl}
              />
              <h5 class="card-title">${max}°</h5>
              <h6 class="card-subtitle mb-2 text-muted">${min}°</h6>
              <p class="card-text">${getDay(timestamp)}</p>
            </div>
          </div>
        </div>
      `;
      cards += forecastCard;
      forecastDisplay.innerHTML = cards;
    }
    
  });
  
}



function setWeatherDisplay(response) {
  let data = response.data;
  let iconCode = data.weather[0].icon;
  let description = data.weather[0].main;
  weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`);
  weatherDesc.innerHTML = description;
}

function setWind(response) {
  let data = response.data;
  let wind = data.wind.speed;
  let result = units == "metric" ? `: ${wind} km/hr` : `: ${wind} mi/hr`;
  windDisplay.innerHTML = result;
}

function setHumidity(response) {
  let data = response.data;
  let humidity = data.main.humidity;
  humidityDisplay.innerHTML = ": " + humidity + "%";
}

function setTemperature(temperature) {
  let result = units === "metric" ? `${temperature}°C` : `${temperature}°F`;
  tempDisplay.innerHTML = result;
}

function setMetric() { if (units != "metric") { units = "metric"; searchCity(city); } }

function setImperial() { if (units != "imperial") { units = "imperial"; searchCity(city); } }

// connect functions to html elements
timeDisplay.innerHTML = "Your Time: " + getCurrentTime();
searchForm.addEventListener("submit", searchSubmit);
celsiusBtn.addEventListener("click", setMetric);
fahrenheitBtn.addEventListener("click", setImperial);
currentLocationBtn.addEventListener("click", getCurrentLocation);

// run default
searchCity(city);
