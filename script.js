let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/warren%20vt?unitGroup=metric&key=X44DACF4AYUDSHG6SE78NXTRP&contentType=json';
const searchBar = document.querySelector('input');
const submit = document.querySelector('.submit');

function searchAddress() {
    const searchResult = searchBar.value;
    let words = searchResult.split(' ');
    const newLocation = updateUrl(words);
    url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${newLocation}?unitGroup=metric&key=X44DACF4AYUDSHG6SE78NXTRP&contentType=json`
    populateTiles();
    searchBar.value = '';
}

// Function to update URL based on Search
function updateUrl(arr) {
    let urlLocationTag = arr.join('%20');
    return urlLocationTag;    
}

submit.addEventListener('click', searchAddress);

searchBar.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchAddress();
    }
});

// Load Weather Data as JSON
async function getWeather() {
    const response = await fetch(url);
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}

// Convert celsius to fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Convert number date to written date
async function formatWrittenDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = new Date(date);
    return dateString.toLocaleDateString('en-US', options);
}

// Weather Icon map
function getWeatherIcon(condition) {
    const conditionToIconMap = {
        "Partially cloudy": './weather_icons/animated/cloudy-day-1.svg',
        "Rain, Partially cloudy": './weather_icons/animated/rainy-3.svg',
        "Clear": './weather_icons/animated/day.svg',
        "Overcast": './weather_icons/animated/cloudy.svg',
        "Mist": './weather_icons/animated/rainy-5.svg',
        "Rain": './weather_icons/animated/rainy-5.svg'
    };

    return conditionToIconMap[condition] || './weather_icons/animated/day.svg'; // Fallback to a default icon if condition is not found
}

async function findWeatherAlerts() {
    const weatherAlerts = document.querySelector('#weather-alerts');
    const weatherData = await getWeather();
    const alerts = weatherData.alerts;

    weatherAlerts.innerHTML = '';

    if (alerts.length === 0) {
        const noAlerts = document.createElement('p');
        noAlerts.textContent = 'There are currently no weather alerts in your area.'
        weatherAlerts.appendChild(noAlerts);
    } else {
        alerts.forEach(alert => {
            if (alert) {
                const alertHeader = document.createElement('h3');
                const alertItem = document.createElement('p');
                alertItem.classList.add('alert-item');
                alertHeader.textContent = alert.headline;
                alertItem.textContent = alert.description;
                weatherAlerts.appendChild(alertHeader);
                weatherAlerts.appendChild(alertItem)                
            }
        });
    }
}


// Parse hourly data for future use
async function getHourlyData() {
    const response = await fetch(url);
    const weatherData = await response.json();
    const hours = weatherData.days[0].hours;
    return hours;
}

function convertToStandardTime(militaryTime) {
    let [hours, minutes] = militaryTime.split(':');
    hours = parseInt(hours);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    return `${hours}:${minutes} ${ampm}`;
}

function feelsLikeColor(element, temp) {
    if (temp >= 85) {
        element.style.color = 'red';
    } else if (temp >= 70) {
        element.style.color = 'orange';
    } else if (temp >= 50) {
        element.style.color = 'green';
    } else {
        element.style.color = 'blue';
    }
}

// DOM Manipulation
async function populateTiles() {
    const weatherData = await getWeather();

    findWeatherAlerts();

    const location = document.querySelector('#location');
    const temperature = document.querySelector('.temperature');
    const icon = document.querySelector('.current-cond-icon');
    const description = document.querySelector('.description');

    //Current conditions tile
    location.textContent =  `${weatherData.resolvedAddress}`;
    description.textContent = `${weatherData.days[0].description}`;

    // Convert to degrees F
    const tempInFahrenheit = celsiusToFahrenheit(weatherData.currentConditions.temp);
    const roundedTemp = Math.round(tempInFahrenheit);
    temperature.textContent = roundedTemp.toString() + '°F';

    icon.src = getWeatherIcon(weatherData.currentConditions.conditions);

    // Tomorrow tile
    const tomorrow = document.querySelector('#tomorrow');
    const tomorowIcon = document.querySelector('#tomorrow-icon');
    const tomorrowTemp = document.querySelector('#tomorrow-temp');
    const tomorrowDesc = document.querySelector('#tomorrow-description');

    // Append Date, icon, temp & description
    const tomorrowDate = await formatWrittenDate(weatherData.days[2].datetime);
    tomorrow.textContent = `${tomorrowDate}`;

    tomorowIcon.src = getWeatherIcon(weatherData.days[2].conditions);
    const tomorrowMinTempCalc = Math.round(celsiusToFahrenheit(weatherData.days[2].tempmin));
    const tomorrowHighTempCalc =  Math.round(celsiusToFahrenheit(weatherData.days[2].tempmax));
    tomorrowTemp.textContent = 'Low: ' + tomorrowMinTempCalc.toString() + '°F' + '     ' + 'High: ' + tomorrowHighTempCalc.toString() + '°F';
    tomorrowDesc.textContent = `${weatherData.days[2].description}`
    
    // Next day tile
    const nextDay = document.querySelector('#next-day');
    const nextDayIcon = document.querySelector('#next-day-icon');
    const nextDayTemp = document.querySelector('#next-day-temp');
    const nextDayDesc = document.querySelector('#next-day-description');

    // Append Date, icon, temp & description
    const nextDayDate = await formatWrittenDate(weatherData.days[3].datetime);
    nextDay.textContent = `${nextDayDate}`;

    nextDayIcon.src = getWeatherIcon(weatherData.days[3].conditions);
    nextDayTemp.textContent = 'Low: ' + tomorrowMinTempCalc.toString() + '°F' + '     ' + 'High: ' + tomorrowHighTempCalc.toString() + '°F';
    nextDayDesc.textContent = `${weatherData.days[3].description}`;

    // Hourly Forecast
    const hourlyForecast = document.querySelector('.hourly-weather');
    hourlyForecast.innerHTML = '';
    const hourlyData = await getHourlyData();
    console.log(hourlyData);

    for (let i=0; i<hourlyData.length; i++) {
        let tile = document.createElement('div');
        tile.classList.add('hourly-tile');
        const time = document.createElement('p');
        const icon = document.createElement('img');
        const temp = document.createElement('p');
        const precipitation = document.createElement('div')
        const precipIcon = document.createElement('img');
        const precipPercentage = document.createElement('p');
        const precipAmount = document.createElement('p');
        const iconSpan = document.createElement('span')
        precipPercentage.classList.add('precip-percent');
        precipAmount.classList.add('precip-amount')

        let tempInFahrenheit = celsiusToFahrenheit(hourlyData[i].temp)
        let roundedTemp = Math.round(tempInFahrenheit);

        time.textContent = convertToStandardTime(hourlyData[i].datetime);
        icon.src = getWeatherIcon(hourlyData[i].conditions)
        temp.textContent = roundedTemp + ' °F';
        precipIcon.src = './rain.svg';
        iconSpan.appendChild(precipIcon);
        precipPercentage.textContent = `${hourlyData[i].precipprob.toString()}%`;
        precipAmount.textContent = `${Math.round(hourlyData[i].precip).toString()} "`;
        precipitation.appendChild(iconSpan);
        precipitation.appendChild(precipPercentage);
        precipitation.appendChild(precipAmount);
        tile.appendChild(time);
        tile.appendChild(icon);
        tile.appendChild(temp);
        tile.appendChild(precipitation);
        hourlyForecast.appendChild(tile);
    }

    // Feels Like tab
    const feelsLikeTempContianer = document.querySelector('.feels-like-temp');
    const feelsLikeTemp = celsiusToFahrenheit(weatherData.currentConditions.feelslike);
    const roundedFeelsLike = Math.round(feelsLikeTemp);
    
    feelsLikeColor(feelsLikeTempContianer, roundedFeelsLike);

    feelsLikeTempContianer.textContent = roundedFeelsLike.toString() + ' ' + '°F';
}

populateTiles();


// Nav bar JS

// add classes for mobile navigation toggling
var CSbody = document.querySelector("body");
const CSnavbarMenu = document.querySelector("#cs-navigation");
const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

CShamburgerMenu.addEventListener('click', function() {
    CShamburgerMenu.classList.toggle("cs-active");
    CSnavbarMenu.classList.toggle("cs-active");
    CSbody.classList.toggle("cs-open");
});

    // This script adds a class to the body after scrolling 100px
// and we used these body.scroll styles to create some on scroll 
// animations with the navbar

document.addEventListener('scroll', (e) => { 
    const scroll = document.documentElement.scrollTop;
    if(scroll >= 100){
document.querySelector('body').classList.add('scroll')
    } else {
    document.querySelector('body').classList.remove('scroll')
    }
});


// mobile nav toggle code
const dropDowns = Array.from(document.querySelectorAll('#cs-navigation .cs-dropdown'));
    for (const item of dropDowns) {
        const onClick = () => {
        item.classList.toggle('cs-active')
    }
    item.addEventListener('click', onClick)
    }
                            