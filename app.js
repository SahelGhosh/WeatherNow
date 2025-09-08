let city_name = "";
let main = document.querySelector('.mb-3');
let card = document.querySelector(".weather_card");
card.style.display = "none"; // hide card initially
let btn = document.querySelector(".custom-btn"); // fixed selector
let inp = document.querySelector('#search'); // target input by id
let loader = document.querySelector('svg');
let outer = document.querySelector("#outer");
let social = document.querySelector('.social') //social media bar
let facebook = document.querySelector('.fa-facebook');
let instagram = document.querySelector('.fa-instagram');
let linkedin = document.querySelector('.fa-linkedin');
let sahel = document.querySelector('.sahel');

// Select all detail items
let detailItems = {
    city_name: document.querySelector('.city_name'),
    weather_icon: document.querySelector('.weather_icon'),
    weather_desc: document.querySelector('.weather_desc'),
    temp: document.querySelector('.data_1'),
    feels_like: document.querySelector(".feels_like"),
    temp_max: document.querySelector(".temp_max"),
    temp_min: document.querySelector(".temp_min"),
    humidity: document.querySelector(".humidity"),
    pressure: document.querySelector(".pressure"),
    wind_speed: document.querySelector(".wind_speed"),
    wind_dir: document.querySelector(".wind_dir"),
    sunrise: document.querySelector(".sunrise"),
    sunset: document.querySelector(".sunset")
};

// Convert wind degrees to cardinal direction
function degToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[val % 16];
}


function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}


async function getData() {
    let url_2 = `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&appid=8344c2804120b4cb6b03e5a6e1e76163`;
    const res = await fetch(url_2);
    const data = await res.json();
    if (data.length === 0) throw new Error("City not found");
    return { lat: data[0].lat, lon: data[0].lon };
}


async function getWeather(lat, lon) {
    let url_1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8344c2804120b4cb6b03e5a6e1e76163`;
    let res = await fetch(url_1);
    return await res.json();
}

function updateUI(finalData) {
    const weatherMain = finalData.weather[0].main.toLowerCase();
    const weatherIconCode = finalData.weather[0].icon;


    let newBackground;
    switch (weatherMain) {
        case 'clear': newBackground = "url('./sky/clear.jpg')"; break;
        case 'clouds': newBackground = "url('./sky/cloudy.jpg')"; break;
        case 'rain': newBackground = "url('./sky/rainy.jpg')"; break;
        case 'snow': newBackground = "url('./sky/snow.jpg')"; break;
        case 'thunderstorm': newBackground = "url('./sky/thunderstorm.jpg')"; break;
        case 'drizzle': newBackground = "url('./sky/clear.jpg')"; break;
        default: newBackground = "url('./sky/clear.jpg')";
    }
    document.body.style.backgroundImage = newBackground;
    document.body.style.backgroundSize = "cover";         // Ensures full coverage
    document.body.style.backgroundPosition = "center";    // Centers the image
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.background = newBackground;

    detailItems.city_name.innerText = finalData.name;
    detailItems.weather_icon.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
    detailItems.weather_desc.innerText = finalData.weather[0].description;

    detailItems.temp.innerText = `${Math.round(finalData.main.temp)}°C`;
    detailItems.feels_like.innerText = `Feels like: ${Math.round(finalData.main.feels_like)}°C`;
    detailItems.temp_max.innerText = `Max Temp: ${Math.round(finalData.main.temp_max)}°C`;
    detailItems.temp_min.innerText = `Min Temp: ${Math.round(finalData.main.temp_min)}°C`;
    detailItems.humidity.innerText = `Humidity: ${finalData.main.humidity}%`;
    detailItems.pressure.innerText = `Pressure: ${finalData.main.pressure} hPa`;
    detailItems.pressure.style.fontSize = "16px"; 
    detailItems.wind_speed.innerText = `Wind: ${finalData.wind.speed} m/s`;
    detailItems.wind_dir.innerText = `Direction: ${degToCompass(finalData.wind.deg)}`;

    detailItems.sunrise.innerText = `Sunrise: ${formatTime(finalData.sys.sunrise, finalData.timezone)}`;
    detailItems.sunset.innerText = `Sunset: ${formatTime(finalData.sys.sunset, finalData.timezone)}`;

    document.querySelector('.title').innerText = "Weather Status";
}

btn.addEventListener("click", async function () {
    social.style.display = "none";
    sahel.style.display = "none";
    if (inp.value === "") {
        alert("Please enter a city name.");
        return;
    }
    city_name = inp.value;
    loader.style.display = "block";
    card.style.opacity = 0;

    try {
        const { lat, lon } = await getData();
        const finalData = await getWeather(lat, lon);

        loader.style.display = "none";
        document.querySelector('.main').classList.add('moved');
        outer.classList.remove('outer');
        outer.classList.add('outer_moved');
        card.style.display = "flex";
        setTimeout(() => { card.style.opacity = 1; }, 100);

        updateUI(finalData);

    } catch (err) {
        loader.style.display = "none";
        main.style.display = "block";
        document.querySelector('.main').classList.remove('moved');
        outer.classList.remove('outer_moved');
        outer.classList.add('outer');
        alert(`Error: ${err.message}`);
        console.error(err);
    }
});

facebook.addEventListener("click", () => {
    window.location.href = "https://www.facebook.com/Sahel.Ghosh";
})
instagram.addEventListener("click", () => {
    window.location.href = "https://www.instagram.com/sahelghosh7/";
})
linkedin.addEventListener("click", () => {
    window.location.href = "https://www.linkedin.com/in/sahel-ghosh/";
})

