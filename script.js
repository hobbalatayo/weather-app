const cityInput = document.querySelector("#cityInput");

const errorMessage = document.querySelector("#errorMessage");

const form = document.querySelector("form");

const button = form.querySelector("button");

const forecastList = document.querySelector("#forecastList");

const buttonText = button.querySelector(".button-text");

const spinner = button.querySelector(".spinner");

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snowfall",
  73: "Moderate snowfall",
  75: "Heavy snowfall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  97: "Heavy thunderstorm",
  99: "Thunderstorm with heavy hail",
};

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌧️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  77: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  85: "🌨️",
  86: "❄️",
  95: "⛈️",
  96: "⛈️",
  97: "⛈️",
  99: "⛈️",
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorMessage.textContent = "";

  try {
    button.disabled = true;
    buttonText.textContent = "Loading...";
    spinner.style.display = "inline-block";

    const city = cityInput.value;

    if (city.trim() === "") {
      alert("Please enter a city");
      return;
    }

    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    const geocodingResponse = await fetch(geocodingUrl);

    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.results?.[0]) {
      errorMessage.textContent = "City not found.";
      return;
    }

    const latitude = geocodingData.results[0].latitude;
    const longitude = geocodingData.results[0].longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`;

    const weatherResponse = await fetch(weatherUrl);

    const data = await weatherResponse.json();

    const daily = data.daily;

    forecastList.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
      const date = daily.time[i];

      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const weatherCode = daily.weather_code[i];
      const maxTemperature = daily.temperature_2m_max[i];
      const minTemperature = daily.temperature_2m_min[i];
      const forecastCard = document.createElement("div");
      forecastCard.classList.add("forecast-card");

      forecastCard.innerHTML = `
<p>${formattedDate}</p>
  <div>${weatherIcons[weatherCode]}</div>
  <p>${weatherDescriptions[weatherCode]}</p>
  <p>${maxTemperature} °C / ${minTemperature} °C</p>
`;
      forecastList.appendChild(forecastCard);
    }

    const temperature = data.current.temperature_2m;
    const windSpeed = data.current.wind_speed_10m;
    const humidity = data.current.relative_humidity_2m;
    const feelsLike = data.current.apparent_temperature;

    const weatherCode = data.current.weather_code;

    const description = weatherDescriptions[weatherCode];
    const icon = weatherIcons[weatherCode];

    const temperatureElement = document.querySelector("#temperature");
    temperatureElement.textContent = temperature + " °C";

    const locationElement = document.querySelector("#location");
    locationElement.textContent = city;

    const descriptionElement = document.querySelector("#description");
    descriptionElement.textContent = description;

    const weatherIconElement = document.querySelector("#weatherIcon");
    weatherIconElement.textContent = icon;

    const windSpeedElement = document.querySelector("#windSpeed");
    windSpeedElement.textContent = windSpeed + " km/h";

    const humidityElement = document.querySelector("#humidity");
    humidityElement.textContent = humidity + " %";

    const feelsLikeElement = document.querySelector("#feelsLike");
    feelsLikeElement.textContent = feelsLike + " °C";
  } catch (error) {
    console.error("Error:", error);

    alert("Something went wrong. Please try again.");
  } finally {
    button.disabled = false;
    buttonText.textContent = "Search";
    spinner.style.display = "none";
  }
});
