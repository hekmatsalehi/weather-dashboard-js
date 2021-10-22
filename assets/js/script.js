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



var searchContainerEl = document.querySelector(".search-container")
var inputCityEl = document.querySelector("#inputCity")
var serchBtnEl = document.querySelector("#searchBtn")
var todayResultEl = document.querySelector("#todayResult");
console.log(todayResultEl)



function getWeatherUpdate() {
    var ApiKey = "863c2b1c4c72649f2696950cc0de60f5"
    var cityName = inputCityEl.value;
    var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + ApiKey;
    fetch(queryUrl)
        .then(function (response){
            return response.json();
        })
        .then(function (data){

            console.log(data)
            
            var todayWeather = document.createElement("p")
            todayWeather.textContent = data.main.temp
            todayResultEl.append(todayWeather)

        })
}


serchBtnEl.addEventListener("click", function(e){
    e.preventDefault()

    getWeatherUpdate()
    

    

})