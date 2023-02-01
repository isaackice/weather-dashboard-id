var $submitButton = document.querySelector("#submit-button");
var $cityInput = document.querySelector("#city-input");
var $cityName = document.querySelector(".city-name");
var $currentDate = document.querySelector(".current-date");
var $currentInfo = document.querySelector(".current-info");
var $searchHistory = document.querySelector(".search-history");
var $dayNumber = document.querySelector(".dayNumber");

function init() {
    loadFromLS();
}

function weatherToday(city) {
    var weatherTodayAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=d088a74694305d7b067b5b867fc46a3a`;


    fetch(weatherTodayAPI).then((response) => {
        if (response.ok)
            response.json().then((data) => {
                if (data.length === 0) {
                    console.log("no link");
                } else {
                    saveToLS(data.name);
                    $cityName.textContent = data.name + " " + dayjs().format("MM/DD/YYYY");
                    $currentInfo.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png"></img>
                    <li>Temperature: ${data.main.temp}</li>
                    <li>Humidity: ${data.main.humidity}</li>
                    <li>Wind Speed: ${data.wind.speed}</li>`;
                    weatherFive(city);
                }
            });
    });
}

function weatherFive(city) {
    var weatherFiveAPI = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&limit=1&units=imperial&appid=d088a74694305d7b067b5b867fc46a3a`;

    fetch(weatherFiveAPI).then((response) => {
        if (response.ok)
            response.json().then((data) => {
                if (data.length === 0) {
                    console.log("no link");
                } else {
                    console.log(data);
                    var day = 0;
                    $dayNumber.innerHTML = "";
                    for (var i = 0; i < 33; i += 8) {
                        $dayNumber.innerHTML += `<section class="weather-box col">
                        <h4>${dayjs().add(day++, "day").format("MM/DD/YYYY")}</h4>
                        <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png"></img>
                        <li>Temperature: ${data.list[i].main.temp}</li>
                        <li>Humidity: ${data.list[i].main.humidity}</li>
                        <li>Wind Speed: ${data.list[i].wind.speed}</li></section>`;
                    }
                }
            });
    });
}

function saveToLS(cityToSave) {
    var localArray = JSON.parse(localStorage.getItem("city")) || [];
    for (var i = 0; i < localArray.length; i++) {
        if (localArray[i] === cityToSave) {
            return;
        }
    }

    createHistory(cityToSave);

    localArray.unshift(cityToSave);
    if (localArray.length > 5) {
        localArray.pop();
    }
    localStorage.setItem("city", JSON.stringify(localArray));
}

function loadFromLS() {
    var historyArray = JSON.parse(localStorage.getItem("city"));

    for (var i = 0; i < historyArray.length; i++) {
        createHistory(historyArray[i]);
    }
}

function createHistory(name) {
    $searchHistory.innerHTML += `<li class="history-tabs">${name}</li>`;
}

function searchHistory(event) {
    if (event.target.matches("li")) {
        weatherToday(event.target.textContent);
    }
}

function searchNewCity() {
    var city = $cityInput.value;
    weatherToday(city);
}

$submitButton.addEventListener("click", searchNewCity);
$searchHistory.addEventListener("click", searchHistory);

init();