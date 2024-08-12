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

function updateUrl(arr) {
    let urlLocationTag = arr.join('%20');
    return urlLocationTag;    
}

submit.addEventListener('click', searchAddress);

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

function getWeatherIcon(condition) {
    const conditionToIconMap = {
        "Partially cloudy": '/images/weather_icons/animated/cloudy-day-1.svg',
        "Rain, Partially cloudy": '/images/weather_icons/animated/rainy-3.svg',
        "Clear": '/images/weather_icons/animated/day.svg',
        "Overcast": '/images/weather_icons/animated/cloudy.svg',
        "Mist": '/images/weather_icons/animated/rainy-5.svg',
        "Rain": '/images/weather_icons/animated/rainy-5.svg'
    };

    return conditionToIconMap[condition] || '/images/weather_icons/animated/day.svg'; // Fallback to a default icon if condition is not found
}


async function populateTiles() {
    const weatherData = await getWeather();

    const location = document.querySelector('#location');
    const temperature = document.querySelector('.temperature');
    const icon = document.querySelector('.current-cond-icon');
    const description = document.querySelector('.description');

    //Current conditions tile
    location.textContent =  `${weatherData.resolvedAddress}`;
    description.textContent = `${weatherData.description}`;

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
    tomorrowTemp.textContent = 'Min: ' + tomorrowMinTempCalc.toString() + '°F' + '     ' + 'High: ' + tomorrowHighTempCalc.toString() + '°F';
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
    const nextDayMinTempCalc = Math.round(celsiusToFahrenheit(weatherData.days[3].tempmin));
    const nextDayHighTempCalc =  Math.round(celsiusToFahrenheit(weatherData.days[3].tempmax));
    nextDayTemp.textContent = 'Min: ' + tomorrowMinTempCalc.toString() + '°F' + '     ' + 'High: ' + tomorrowHighTempCalc.toString() + '°F';
    nextDayDesc.textContent = `${weatherData.days[3].description}`;
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
    // run the function to check the aria-expanded value
    ariaExpanded();
});

// checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not 
function ariaExpanded() {
    const csUL = document.querySelector('#cs-expanded');
    const csExpanded = csUL.getAttribute('aria-expanded');

    if (csExpanded === 'false') {
        csUL.setAttribute('aria-expanded', 'true');
    } else {
        csUL.setAttribute('aria-expanded', 'false');
    }
}

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
                            