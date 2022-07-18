// html elements
let timeDisplay = document.querySelector(".weather-time");
let tempDisplay = document.querySelector(".weather-temp");
let cityDisplay = document.querySelector(".city-display");
let searchForm = document.querySelector("form#search-form");
let currentLocationBtn = document.querySelector("#currentlocation");

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
}

function setTemperature(temperature) {
  let result = units === "metric" ? `${temperature}°C` : `${temperature}°F`;
  tempDisplay.innerHTML = result;
}

function changeUnits() {
  units = units === "metric" ? "imperial" : "metric";
  searchCity(city);
}

// connect functions to html elements
searchForm.addEventListener("submit", searchSubmit);
timeDisplay.innerHTML = getCurrentTime();
tempDisplay.addEventListener("click", changeUnits);
currentLocationBtn.addEventListener("click", getCurrentLocation);
searchCity(city);
