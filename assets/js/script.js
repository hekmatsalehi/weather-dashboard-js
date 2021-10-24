// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var inputCityEl = document.querySelector("#inputCity");
var searchBtnEl = document.querySelector("#searchBtn");
var searchedCitiesEl = document.querySelector("#searchedCities");
var todayResultEl = document.querySelector("#todayResult");
var fiveDaysResultEl = document.querySelector("#fiveDaysResult");

var ApiKey = "863c2b1c4c72649f2696950cc0de60f5";
var cityBtns = [];

function getWeatherUpdate(cityName) {
  todayResultEl.innerHTML = "";
  fiveDaysResultEl.innerHTML = "";

  var getLonLatURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    ",US&limit=5&appid=" +
    ApiKey;

  fetch(getLonLatURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var cityInfo = data[0];
      var openWeatherUrl =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        cityInfo.lat +
        "&lon=" +
        cityInfo.lon +
        "&exclude=minutely,hourly&units=imperial&appid=" +
        ApiKey;

      fetch(openWeatherUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (forecastData) {
          var cityNameEl = document.createElement("h2");
          cityNameEl.textContent =
            cityName.toUpperCase() +
            " " +
            moment.unix(forecastData.current.sunrise).format("DD/MM/YYYY");
          var weatherIcon = document.createElement("img");
          weatherIcon.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" +
              forecastData.current.weather[0].icon +
              ".png"
          );
          cityNameEl.append(weatherIcon);
          todayResultEl.append(cityNameEl);

          var temperature = document.createElement("p");
          var wind = document.createElement("p");
          var humidity = document.createElement("p");
          var uvi = document.createElement("p");

          temperature.textContent = "Temp: " + forecastData.current.temp + " F";
          wind.textContent =
            "Wind: " + forecastData.current.wind_speed + " MPH";
          humidity.textContent =
            "Humidity: " + forecastData.current.humidity + " %";
          uvi.textContent = "UV Index: " + forecastData.current.uvi;

          todayResultEl.append(temperature);
          todayResultEl.append(wind);
          todayResultEl.append(humidity);
          todayResultEl.append(uvi);

          var fiveDaysResultTitle = document.createElement("h2");
          fiveDaysResultTitle.textContent = "Five Days Forecast";
          fiveDaysResultEl.append(fiveDaysResultTitle);

          for (var i = 0; i < 5; i++) {
            var comingDayWeather = forecastData.daily[i];
            var comingDayWeatherCard = document.createElement("p");
            comingDayWeatherCard.style.width = "18%";

            var date = moment
              .unix(comingDayWeather.sunrise)
              .format("DD/MM/YYYY");

            comingDayWeatherCard.append(date);
            var weatherIcon = document.createElement("img");
            weatherIcon.setAttribute(
              "src",
              "https://openweathermap.org/img/w/" +
                comingDayWeather.weather[0].icon +
                ".png"
            );

            comingDayWeatherCard.append(weatherIcon);

            var temp = document.createElement("p");
            temp.textContent = "Temp: " + comingDayWeather.temp.day + " F";
            comingDayWeatherCard.append(temp);

            var wind = document.createElement("p");
            wind.textContent = "Wind: " + comingDayWeather.wind_speed + " MPH";
            comingDayWeatherCard.append(wind);

            var humidity = document.createElement("p");
            humidity.textContent =
              "Humidty: " + comingDayWeather.humidity + " %";
            comingDayWeatherCard.append(humidity);

            fiveDaysResultEl.append(comingDayWeatherCard);
          }
        });
    });
}

searchBtnEl.addEventListener("click", function (event) {
  event.preventDefault();

  var searchValue = inputCityEl.value.trim();

  if (!searchValue) {
    return;
  }

  cityBtns.push(searchValue);
  getWeatherUpdate(searchValue);
  generateBtns();
});

function intialLoad() {
  var searchedCitiesBtns = localStorage.getItem("searchedCities");
  if (searchedCitiesBtns) {
    cityBtns = JSON.parse(searchedCitiesBtns);
    generateBtns();
  }
}

function generateBtns() {
  for (var i = 0; i < cityBtns.length; i++) {
    city = cityBtns[i];
    var newBtn = document.createElement("button");

    newBtn.textContent = city;
    newBtn.setAttribute("data-value", city);

    newBtn.addEventListener("click", function () {
      var searchCity = this.getAttribute("data-value");
      getWeatherUpdate(searchCity);
    });
    searchedCitiesEl.append(newBtn);
  }

  localStorage.setItem("searchedCities", JSON.stringify(cityBtns));
}
intialLoad();
