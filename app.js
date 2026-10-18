// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const initialState = document.getElementById('initial-state');
const loadingEl = document.getElementById('loading');
const errorMsg = document.getElementById('error-msg');
const errorText = document.getElementById('error-text');

const cityNameEl = document.getElementById('city-name');
const dateTimeEl = document.getElementById('date-time');
const weatherIcon = document.getElementById('weather-icon');
const tempEl = document.getElementById('temp');
const weatherDescEl = document.getElementById('weather-desc');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');

// Apni OpenWeatherMap API key yahan daalein
const API_KEY = 'b130a60d5600116c314230d7282c8c19'; 

// Search Event Listeners
searchBtn.addEventListener('click', () => {
  const cityName = cityInput.value.trim();
  if (cityName) {
    fetchWeatherData(cityName);
  } else {
    showError('Please enter a city name.');
  }
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cityName = cityInput.value.trim();
    if (cityName) {
      fetchWeatherData(cityName);
    } else {
      showError('Please enter a city name.');
    }
  }
});

// Async Function to Fetch Weather Data (Standard 2.5 API)
async function fetchWeatherData(city) {
  showLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized (401): API key ghalat hai ya abhi active nahi hui.');
      } else if (response.status === 404) {
        throw new Error('City nahi mili. Bara-e-mehrbani sahi naam likhein.');
      } else {
        throw new Error('Kuch ghalat ho gaya. Dobara koshish karein.');
      }
    }

    const data = await response.json();
    displayWeatherData(data);

  } catch (error) {
    showError(error.message);
  }
}

// Display Data Dynamically
function displayWeatherData(data) {
  hideLoading();
  hideError();
  initialState.classList.add('hidden');
  weatherCard.classList.remove('hidden');

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  dateTimeEl.textContent = formatDate(new Date());
  
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescEl.textContent = data.weather[0].description;
  feelsLikeEl.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidityEl.textContent = `${data.main.humidity}%`;
  windSpeedEl.textContent = `${data.wind.speed} km/h`;
  pressureEl.textContent = `${data.main.pressure} hPa`;
}

// Helper Functions for UI States
function showLoading() {
  loadingEl.classList.remove('hidden');
  weatherCard.classList.add('hidden');
  errorMsg.classList.add('hidden');
  initialState.classList.add('hidden');
}

function hideLoading() {
  loadingEl.classList.add('hidden');
}

function showError(message) {
  loadingEl.classList.add('hidden');
  weatherCard.classList.add('hidden');
  initialState.classList.add('hidden');
  errorText.textContent = message;
  errorMsg.classList.remove('hidden');
}

function hideError() {
  errorMsg.classList.add('hidden');
}

function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}