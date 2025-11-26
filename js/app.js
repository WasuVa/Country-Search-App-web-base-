console.log("App is running");

let timeIntervalId = null;

// ==================== THEME TOGGLE FUNCTIONALITY ====================
function initTheme() {
    // Prevent transitions on page load
    document.body.classList.add('preload');

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    // Remove preload class after a brief delay
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');

    body.classList.toggle('dark-theme');

    // Update icon
    if (body.classList.contains('dark-theme')) {
        if (themeIcon) themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');

        // Add pulse animation
        themeToggle?.classList.add('pulse');
        setTimeout(() => themeToggle?.classList.remove('pulse'), 300);
    } else {
        if (themeIcon) themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');

        // Add pulse animation
        themeToggle?.classList.add('pulse');
        setTimeout(() => themeToggle?.classList.remove('pulse'), 300);
    }
}

// ==================== NAVIGATION FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const themeToggle = document.getElementById('theme-toggle');

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('mobile-active');
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('mobile-active');

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Country input event listener
    const countryInput = document.getElementById('country-input');
    if (countryInput) {
        countryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchcon();
        });
    }

    // Weather input event listener
    const weatherInput = document.getElementById('weather-input');
    if (weatherInput) {
        weatherInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchWeather();
        });
    }
});

// ==================== COUNTRY SEARCH FUNCTION ====================
function searchcon() {
    const countryInput = document.getElementById('country-input').value;

    if (!countryInput.trim()) {
        alert("Please enter a country name!");
        return;
    }

    fetch(`http://api.weatherapi.com/v1/current.json?key=24636336a68e4f859fa90222251211&q=${encodeURIComponent(countryInput)}`)
        .then(response => response.json())
        .then(weatherData => {
            fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(weatherData.location.country)}`)
                .then(response => response.json())
                .then(restData => {
                    const country = restData[0];

                    // Update country information
                    document.getElementById('country-name').innerText = country.name.common;
                    document.getElementById('country-info').innerText = country.region || 'N/A';
                    document.getElementById('country-population').innerText = country.population.toLocaleString();
                    document.getElementById('country-capital').innerText = country.capital ? country.capital[0] : 'N/A';

                    // Update flags and coat of arms
                    document.getElementById('country-flag').innerHTML = `<img src="${country.flags.png}" alt="Flag of ${country.name.common}">`;

                    if (country.coatOfArms && country.coatOfArms.png) {
                        document.getElementById('coat').innerHTML = `<img height="210px" src="${country.coatOfArms.png}" alt="Coat of Arms of ${country.name.common}">`;
                    } else {
                        document.getElementById('coat').innerHTML = '<p style="color:#bbb">-</p>';
                    }

                    document.getElementById('country-currency').innerHTML = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A';
                    document.getElementById('country-languages').innerText = country.languages ? Object.values(country.languages).join(', ') : 'N/A';

                    // Update map
                    const lat = country.latlng[0];
                    const lng = country.latlng[1];
                    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 5},${lat - 5},${lng + 5},${lat + 5}&layer=mapnik&marker=${lat},${lng}`;

                    const mapContainer = document.getElementById('mapVIEW');
                    if (mapContainer) {
                        mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border-radius: 12px; border: none;" src="${mapUrl}"></iframe>`;
                    }

                    // Update timezone and time
                    let tzSource = null;
                    if (weatherData && weatherData.location && weatherData.location.tz_id) {
                        tzSource = weatherData.location.tz_id;
                    } else if (country.timezones && country.timezones.length > 0) {
                        tzSource = country.timezones[0];
                    }

                    if (timeIntervalId) {
                        clearInterval(timeIntervalId);
                        timeIntervalId = null;
                    }

                    if (tzSource) {
                        updateAndStartClock(tzSource);
                    } else {
                        const timeEl = document.getElementById('country-timezone');
                        if (timeEl) timeEl.innerText = 'N/A';
                    }
                })
                .catch(err => {
                    console.error('Error fetching country data:', err);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Country data not found.",
                        // footer: '<a href="#">Why do I have this issue?</a>'
                    });
                });
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Location not found or weather API error.",
                // footer: '<a href="#">Why do I have this issue?</a>'
            });
        });
}

// ==================== WEATHER SEARCH FUNCTION ====================
function searchWeather() {
    const weatherInput = document.getElementById('weather-input').value;

    if (!weatherInput.trim()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter a city or country name!!",
            // footer: '<a href="#">Why do I have this issue?</a>'
        });
        return;
    }

    fetch(`http://api.weatherapi.com/v1/current.json?key=24636336a68e4f859fa90222251211&q=${encodeURIComponent(weatherInput)}&aqi=yes`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data); // Debug log

            // Location
            document.getElementById('weather-location').innerText = `${data.location.name}, ${data.location.country}`;
            document.getElementById('weather-updated').innerText = `Last updated: ${formatDateTime(data.current.last_updated)}`;

            // Main temperature display
            document.getElementById('weather-temp').innerText = `${Math.round(data.current.temp_c)}°`;

            // Weather condition and icon
            document.getElementById('weather-condition').innerText = data.current.condition.text;
            const iconElement = document.getElementById('weather-icon');
            iconElement.innerHTML = `<img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">`;

            // Feels like temperature - fix the duplicate ID issue
            const feelsLikeElement = document.getElementById('weather-feels');
            if (feelsLikeElement) {
                feelsLikeElement.innerHTML = `<p>Feels like</p><h3>${Math.round(data.current.feelslike_c)}°</h3>`;
            }

            // Weather details
            document.getElementById('weather-humidity').innerText = `${data.current.humidity}%`;
            document.getElementById('weather-wind').innerText = `${data.current.wind_kph} km/h`;
            document.getElementById('weather-pressure').innerText = `${data.current.pressure_mb} mb`;
            document.getElementById('weather-uv').innerText = `${data.current.uv} ${getUVLevel(data.current.uv)}`;
            document.getElementById('weather-visibility').innerText = `${data.current.vis_km} km`;
            document.getElementById('weather-cloud').innerText = `${data.current.cloud}%`;

            // Air Quality Index
            const aqiElement = document.getElementById('weather-air-quality');
            if (data.current.air_quality && data.current.air_quality['us-epa-index']) {
                const aqi = data.current.air_quality['us-epa-index'];
                aqiElement.innerText = `${getAQILevel(aqi)}`;
            } else {
                aqiElement.innerText = 'Not available';
            }

            // Local time
            const sunTimesElement = document.getElementById('weather-sun-times');
            sunTimesElement.innerText = formatTime(data.location.localtime);

            // Add success animation
            const weatherResults = document.getElementById('weather-results');
            if (weatherResults) {
                weatherResults.classList.add('fade-in');
                setTimeout(() => {
                    weatherResults.classList.remove('fade-in');
                }, 500);
            }
        })
        .catch(error => {
            console.error('Weather Error:', error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Weather data not found! Please check the location and try again.",
                // footer: '<a href="#">Why do I have this issue?</a>'
            });
            resetWeatherDisplay();
        });
}

// ==================== WEATHER BACKGROUND FUNCTION ====================
function changeWeatherBackground(condition, isDay) {
    const weatherSection = document.getElementById('weather-section');

    // Remove all weather background classes
    const weatherClasses = [
        'weather-bg-clear',
        'weather-bg-clouds',
        'weather-bg-rain',
        'weather-bg-snow',
        'weather-bg-thunderstorm',
        'weather-bg-mist',
        'weather-bg-night-clear',
        'weather-bg-night-clouds'
    ];

    weatherClasses.forEach(cls => weatherSection.classList.remove(cls));

    const conditionLower = condition.toLowerCase();

    // Determine background based on condition and time of day
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        weatherSection.classList.add('weather-bg-thunderstorm');
    }
    else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
        weatherSection.classList.add('weather-bg-rain');
    }
    else if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('blizzard') || conditionLower.includes('ice')) {
        weatherSection.classList.add('weather-bg-snow');
    }
    else if (conditionLower.includes('mist') || conditionLower.includes('fog') || conditionLower.includes('haze') || conditionLower.includes('smoke')) {
        weatherSection.classList.add('weather-bg-mist');
    }
    else if (conditionLower.includes('cloud') || conditionLower.includes('overcast') || conditionLower.includes('partly')) {
        if (isDay === 0) {
            weatherSection.classList.add('weather-bg-night-clouds');
        } else {
            weatherSection.classList.add('weather-bg-clouds');
        }
    }
    else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        if (isDay === 0) {
            weatherSection.classList.add('weather-bg-night-clear');
        } else {
            weatherSection.classList.add('weather-bg-clear');
        }
    }
    else {
        // Default background based on time of day
        if (isDay === 0) {
            weatherSection.classList.add('weather-bg-night-clear');
        } else {
            weatherSection.classList.add('weather-bg-clear');
        }
    }
}

function resetWeatherBackground() {
    const weatherSection = document.getElementById('weather-section');
    const weatherClasses = [
        'weather-bg-clear',
        'weather-bg-clouds',
        'weather-bg-rain',
        'weather-bg-snow',
        'weather-bg-thunderstorm',
        'weather-bg-mist',
        'weather-bg-night-clear',
        'weather-bg-night-clouds'
    ];

    weatherClasses.forEach(cls => weatherSection.classList.remove(cls));
}

// ==================== HELPER FUNCTIONS ====================
function getUVLevel(uv) {
    if (uv <= 2) return '(Low)';
    if (uv <= 5) return '(Moderate)';
    if (uv <= 7) return '(High)';
    if (uv <= 10) return '(Very High)';
    return '(Extreme)';
}

function getAQILevel(aqi) {
    switch (aqi) {
        case 1: return 'Good';
        case 2: return 'Moderate';
        case 3: return 'Unhealthy for Sensitive';
        case 4: return 'Unhealthy';
        case 5: return 'Very Unhealthy';
        case 6: return 'Hazardous';
        default: return 'Unknown';
    }
}

function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function resetWeatherDisplay() {
    document.getElementById('weather-location').innerText = 'Search to begin...';
    document.getElementById('weather-updated').innerText = '-';
    document.getElementById('weather-temp').innerText = '-°';
    document.getElementById('weather-condition').innerText = '-';
    document.getElementById('weather-icon').innerHTML = '<span class="placeholder-icon" style="font-size: 6rem;">⛅</span>';

    const feelsLikeElement = document.getElementById('weather-feels');
    if (feelsLikeElement) {
        feelsLikeElement.innerHTML = '<p>Feels like</p><h3>-°</h3>';
    }

    document.getElementById('weather-humidity').innerText = '-';
    document.getElementById('weather-wind').innerText = '-';
    document.getElementById('weather-pressure').innerText = '-';
    document.getElementById('weather-uv').innerText = '-';
    document.getElementById('weather-visibility').innerText = '-';
    document.getElementById('weather-cloud').innerText = '-';
    document.getElementById('weather-air-quality').innerText = '-';
    document.getElementById('weather-sun-times').innerText = '-';
}

// ==================== TIME FUNCTIONS ====================
function updateAndStartClock(tzSource) {
    updateClock(tzSource);
    timeIntervalId = setInterval(() => {
        updateClock(tzSource);
    }, 1000);
}

function updateClock(tzSource) {
    const el = document.getElementById('country-timezone');
    if (!el) return;

    try {
        if (typeof tzSource === 'string' && tzSource.includes('/')) {
            const now = new Date();
            const timeString = new Intl.DateTimeFormat(undefined, {
                timeZone: tzSource,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            }).format(now);
            el.innerText = timeString;
            return;
        }

        if (typeof tzSource === 'string' && tzSource.toUpperCase().startsWith('UTC')) {
            const offsetStr = tzSource.replace('UTC', '').replace('−', '-').trim();

            if (offsetStr === '' || offsetStr === '0' || offsetStr === '+0' || offsetStr === '+00:00' || offsetStr === '-00:00') {
                const nowUtc = new Date();
                el.innerText = nowUtc.toUTCString().match(/\d{2}:\d{2}:\d{2}/)[0];
                return;
            }

            const m = offsetStr.match(/([+-])(\d{1,2})(?::?(\d{2}))?/);
            if (m) {
                const sign = m[1] === '+' ? 1 : -1;
                const hours = parseInt(m[2], 10) || 0;
                const minutes = parseInt(m[3] || '0', 10) || 0;
                const offsetMinutes = sign * (hours * 60 + minutes);

                const now = new Date();
                const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
                const targetMs = utcMs + offsetMinutes * 60000;
                const target = new Date(targetMs);

                el.innerText = target.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                });
                return;
            }
        }

        el.innerText = new Date().toLocaleTimeString();
    } catch (e) {
        console.error('Error updating clock:', e);
        el.innerText = 'N/A';
    }
}