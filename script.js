const btn = document.getElementById('btn');
const weatherImg = document.getElementById('img');
const api_Key = "646088f86c71404186e5befcd077abdb";
const input = document.getElementById("input");

btn.addEventListener("click", weatherapi);

window.onload = () => {
    navigator.geolocation?.getCurrentPosition(showPosition, (e) => console.log(e.message));
};

async function showPosition(pos) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${api_Key}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    displayWeather(data);
    fiveDayForecast(data.name);
}

async function weatherapi() {
    if (!input.value.trim()) return alert("Enter something!!!");

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${api_Key}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) return alert(`${data.cod}!!! ${data.message}`);

        displayWeather(data);
        fiveDayForecast(data.name);
    } catch {
        alert("Enter the City or Country Name");
    }
    input.value = "";
}

function displayWeather(data) {
    const { temp, humidity, pressure, feels_like } = data.main;
    const { speed } = data.wind;
    const { main: condition, icon } = data.weather[0];
    const { country } = data.sys;

    document.querySelector(".temperature").textContent = `${Math.round(temp)}°C`;
    document.querySelector(".weather-card h2").textContent = `${data.name}, ${getCountryName(country)}`;
    document.querySelector(".humidity").textContent = `${humidity}%`;
    document.querySelector(".wind-speed").textContent = `${speed} Km/h`;
    document.querySelector(".air-pressure").textContent = `${pressure} hPa`;
    document.querySelector(".feels-like").textContent = `${Math.round(feels_like)}°C`;

    weatherImg.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.querySelector(".condition").textContent = condition;
}

async function fiveDayForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_Key}&units=metric`;
    const res = await fetch(url);
    displayfiveDayForecast(await res.json());
}

function displayfiveDayForecast(forecast) {
    const today = new Date().toISOString().split("T")[0];
    const time = "3:00:00"

    const cards = forecast.list
        .filter(item => !item.dt_txt.includes(today) && item.dt_txt.includes(time))
        .map(item => {
            const date = new Date(item.dt_txt);
            const day = date.getDate();
            const month = date.toLocaleString("en-US", { month: "short" });
            const icon = item.weather[0].icon;
            const temp = Math.round(item.main.temp);
            return `
                <div class="forecast-card">
                    <p>${day} ${month}</p>
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png">
                    <p>${temp}°C</p>
                </div>`;
        })
        .join("");
    document.querySelector(".forecast").innerHTML = cards;
}

function getCountryName(code) {
    return new Intl.DisplayNames([code], { type: "region" }).of(code);
}