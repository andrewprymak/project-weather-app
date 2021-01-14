let searchbox = document.querySelector('.search-box')
let iconElement = document.querySelector('.weather-icon');
let tempElement = document.querySelector('.temperature-value p');
let feelsElement = document.querySelector('.feels-like p');
let descElement = document.querySelector('.temperature-description p');
let locationElement = document.querySelector('.location p');
let timezoneElement = document.querySelector('.timezone p');
let timeElement = document.querySelector('.time p');
let sunriseElement = document.querySelector('.sunrise p');
let sunsetElement = document.querySelector('.sunset p');
let pressureElement = document.querySelector('.pressure p');
let humidityElement = document.querySelector('.humidity p');
let notificationElement = document.querySelector('.notification');
let windSpeedElement = document.querySelector('.wind-speed p');
let windDirection = document.querySelector('.wind-direction p');
let windIcon = document.querySelector('.wind-icon span');
let cloudElement = document.querySelector('.clouds p');
let visibilityElement = document.querySelector('.visibility p');
let precipitationSnowElement = document.querySelector('.precipitation-snow p');
let precipitationRainElement = document.querySelector('.precipitation-rain p');
let overlay = document.getElementById('overlay');
let tips = document.querySelector('.tipBtn');
let close = document.querySelector('.closebtn');
let key = 'efe51061c1c37d3412dbecca39cc1624';
let kelvin = 273.15;
let error;

let weather = {};

weather.temperature = {
    unit: "celsius"
}
weather.feels = {
    unit: "celsius"
}
weather.pressure = {
    unit: "hPa"
}
weather.windspeed = {
    unit: "m/s"
}
weather.visibility = {
    unit: "km"
}

if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p> Browser doesn't support geolocation </p>"
}

function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(`lat=${latitude}&lon=${longitude}`);
}

function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`
}

searchbox.addEventListener('keypress', setQuery);

function setQuery(evt){
    if(evt.keyCode == 13){
        getWeather(`q=${searchbox.value}`)
        searchbox.value = "";
        searchbox.placeholder;
    }
    
}

function getWeather(position){
    let api = `https://api.openweathermap.org/data/2.5/weather?${position}&appid=${key}`;
    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            if(response.status == 404){
                alert('City not found')
            }
            return data;
            
            
        })
        .then(function(data){
            weather.temperature.value = Math.round(data.main.temp - kelvin);
            weather.feels.value = Math.round(data.main.feels_like - kelvin);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
            weather.timezone = data.timezone / 3600;
            weather.time = data.dt *1000;
            weather.sunrise = data.sys.sunrise * 1000;
            weather.sunset = data.sys.sunset * 1000;
            weather.pressure.value = Math.floor(data.main.pressure);
            weather.humidity = data.main.humidity;
            weather.windspeed.value = Math.floor(data.wind.speed);
            weather.winddirection = data.wind.deg;
            weather.cloudiness = data.clouds.all;
            weather.visibility.value = data.visibility/1000;
            checkSnow  = function(){
                if(data.snow === undefined){
                    precipitationSnowElement.innerHTML = ' ';
                }
                else(precipitationSnowElement.innerHTML = `Snow: ${data.snow["1h"]} mm/s`)
            }
            weather.snow = checkSnow();
            checkRain  = function(){
                if(data.rain === undefined){
                    precipitationRainElement.innerHTML = ' ';
                }
                else(precipitationRainElement.innerHTML = `Rain: ${data.rain["1h"]} mm/s`)
            }
            weather.rain = checkRain();
        })
        .then(function(){
            displayWeather();
        })     
}

function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value} °<span>C</span>`;
    feelsElement.innerHTML = `Feels like: ${weather.feels.value} °<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    timezoneElement.innerHTML = `Timezone: GMT + ${weather.timezone}`;
    timeElement.innerHTML = new Date(weather.time).toString();
    sunriseElement.innerHTML = `Sunrise: ${new Date(weather.sunrise).getHours()} : ${new Date(weather.sunrise).getMinutes()}`;
    sunsetElement.innerHTML = `Sunset: ${new Date(weather.sunset).getHours()} : ${new Date(weather.sunset).getMinutes()}`;
    pressureElement.innerHTML = `Pressure: ${weather.pressure.value} hPa`;
    humidityElement.innerHTML = `Humidity: ${weather.humidity} %`;
    windSpeedElement.innerHTML = `Wind speed: ${weather.windspeed.value.toFixed(1)} m/s`;
    windDirection.innerHTML = `Wind direction: ${degreesToDirection(weather.winddirection)}`;
    windIcon.innerHTML = `<img src="icons/${degreesToDirection(weather.winddirection)}.png"/>`;
    visibilityElement.innerHTML = `Visibility: ${weather.visibility.value.toFixed(1)} km`;
    cloudElement.innerHTML = `Cloudiness: ${weather.cloudiness} %`;
    }

//wind direction
function degreesToDirection(degrees){
    if(degrees >= 337.5 || degrees < 22.5)
	return "N";
    if(degrees >= 22.5  && degrees < 67.5)
	return "NE";
    if(degrees >= 67.5  && degrees < 112.5)
	return "E";
    if(degrees >= 112.5  && degrees < 157.5)
	return "SE";
    if(degrees >= 157.5  && degrees < 202.5)
	return "S";
    if(degrees >= 202.5 && degrees < 247.5)
	return "SW";
    if(degrees >= 247.5  && degrees < 292.5)
	return "W";
    if(degrees >= 292.5  && degrees < 337.5)
	return "NW";
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}
//for feels_like
function celsiusToFahr(feels){
    return (feels * 9/5) + 32;
}
//hPa to mmHg
function hpaToMmhg(pressure){
    return (pressure * 0.75)
}
//m/s to miles/h
function msToMilesh(windspeed){
    return (windspeed * 2.24)
}
//km to miles
function kmToMiles(visibility){
    return (visibility * 0.621371192)
}

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener('click', function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
//for feels_like
tempElement.addEventListener('click', function(){
    if(weather.feels.value === undefined) return;
    
    if(weather.feels.unit == "celsius"){
        let fahrenheit = celsiusToFahr(weather.feels.value);
        fahrenheit = Math.floor(fahrenheit);
        
        feelsElement.innerHTML = `Feels like: ${fahrenheit}°<span>F</span>`;
        weather.feels.unit = "fahrenheit";
    }else{
        feelsElement.innerHTML = `Feels like: ${weather.feels.value}°<span>C</span>`;
        weather.feels.unit = "celsius"
    }
});

//hpa to mmhg
pressureElement.addEventListener('click', function(){
    if(weather.pressure.value === undefined) return;
    
    if(weather.pressure.unit == "hPa"){
        let mmhg = hpaToMmhg(weather.pressure.value);
        mmhg = Math.floor(mmhg);
        
        pressureElement.innerHTML = `Pressure: ${mmhg} <span>mmHg</span>`;
        weather.pressure.unit = "mmHg";
    }else{
        pressureElement.innerHTML = `Pressure: ${weather.pressure.value} <span>hPa</span>`;
        weather.pressure.unit = "hPa"
    }
});
//m/s to miles/h
windSpeedElement.addEventListener('click', function(){
    if(weather.windspeed.value === undefined) return;
    
    if(weather.windspeed.unit == "m/s"){
        let milesh = msToMilesh(weather.windspeed.value);
        milesh = milesh.toFixed(1);
        
        windSpeedElement.innerHTML = `Wind speed: ${milesh} <span>mi/h</span>`;
        weather.windspeed.unit = "miles/h";
    }else{
        windSpeedElement.innerHTML = `Wind speed: ${weather.windspeed.value.toFixed(1)} <span>m/s</span>`;
        weather.windspeed.unit = "m/s";
    }
});
//km to miles
visibilityElement.addEventListener('click', function(){
    if(weather.visibility.value === undefined) return;
    
    if(weather.visibility.unit == "km"){
        let mile = kmToMiles(weather.visibility.value);
        mile = mile.toFixed(1);
        
        visibilityElement.innerHTML = `Visibility: ${mile} <span>mi</span>`;
        weather.visibility.unit = "miles";
    }else{
        visibilityElement.innerHTML = `Visibility: ${weather.visibility.value.toFixed(1)} <span>km</span>`;
        weather.visibility.unit = "km";
    }
});

//tips
tips.addEventListener('click', function(){
    overlay.style.height = '100vh'
})
close.addEventListener('click', function(){
    overlay.style.height = '0'
})