const inputEl = document.getElementById('country-input');
if (!inputEl) return; t.getElementById(id);
const formatNumber = n => (typeof n === 'number' ? n.toLocaleString() : 'N/A');
const joinObjectValues = obj => obj && typeof obj === 'object' ? Object.values(obj).join(', ') : 'N/A';
const formatCurrencies = curObj => {
    if (!curObj) return 'N/A';
    return Object.entries(curObj).map(([code, v]) => `${v.name} (${code}${v.symbol ? `, ${v.symbol}` : ''})`).join('; ');
};
const input = inputEl.value.trim();
if (!input) return;

fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(input)}`)
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        if (!data || data.length === 0) {
            throw new Error('No country found');
        }
        const country = data[0];
        const el = id => documen
        const formatCalling = idd => {
            if (!idd) return 'N/A';
            const root = idd.root || '';
            const suffixes = idd.suffixes || [];
            return suffixes.length ? suffixes.map(s => `${root}${s}`).join(', ') : (root || 'N/A');
        };

        el('country-name').innerText = `${country.name?.common || 'N/A'}`;
        el('country-info').innerText = country.region || 'N/A';
        el('country-subregion').innerText = country.subregion || 'N/A';
        el('country-capital').innerText = country.capital?.[0] || 'N/A';
        el('country-population').innerText = formatNumber(country.population);
        el('country-area').innerText = country.area ? `${formatNumber(country.area)} km²` : 'N/A';
        el('country-languages').innerText = joinObjectValues(country.languages) || 'N/A';
        el('country-currencies').innerText = formatCurrencies(country.currencies);
        el('country-timezones').innerText = (country.timezones || []).join(', ') || 'N/A';
        el('country-tld').innerText = (country.tld || []).join(', ') || 'N/A';
        el('country-calling').innerText = formatCalling(country.idd);
        el('country-independent').innerText = (typeof country.independent === 'boolean') ? (country.independent ? 'Yes' : 'No') : 'Unknown';
        el('country-un').innerText = (typeof country.unMember === 'boolean') ? (country.unMember ? 'Yes' : 'No') : 'Unknown';

        // Flag
        el('country-flag').innerHTML = country.flags?.png ? `<img src="${country.flags.png}" alt="Flag of ${country.name?.common || ''}">` : 'No flag';

        // Coat of arms
        const coatEl = el('country-coat');
        if (country.coatOfArms?.png) {
            coatEl.innerHTML = `<img src="${country.coatOfArms.png}" alt="Coat of arms of ${country.name?.common || ''}">`;
        } else if (country.coatOfArms?.svg) {
            coatEl.innerHTML = `<img src="${country.coatOfArms.svg}" alt="Coat of arms of ${country.name?.common || ''}">`;
        } else {
            coatEl.innerText = 'No coat of arms available';
        }

        // Links
        const wikiEl = el('country-wiki');
        const mapsEl = el('country-maps');
        if (country.maps?.openStreetMaps) {
            mapsEl.href = country.maps.openStreetMaps;
            mapsEl.style.display = 'inline-block';
        } else if (typeof lat === 'number' && typeof lng === 'number') {
            mapsEl.href = `https://www.openstreetmap.org/#map=5/${lat}/${lng}`;
            mapsEl.style.display = 'inline-block';
        } else {
            mapsEl.href = '#';
            mapsEl.style.display = 'none';
        }

        if (country.name?.common) {
            // try to link to Wikipedia (simple heuristic)
            const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common.replace(/\s+/g, '_'))}`;
            wikiEl.href = wikiUrl;
            wikiEl.style.display = 'inline-block';
        } else {
            wikiEl.style.display = 'none';
        }

        // Map iframe
        const lat = country.latlng?.[0];
        const lng = country.latlng?.[1];
        const mapEl = document.querySelector('.google-map');
        if (typeof lat === 'number' && typeof lng === 'number') {
            const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 5},${lat - 5},${lng + 5},${lat + 5}&layer=mapnik&marker=${lat},${lng}`;
            if (mapEl) mapEl.innerHTML = `<iframe src="${mapUrl}" allowfullscreen></iframe>`;
        } else {
            if (mapEl) mapEl.innerHTML = 'Map not available';
        }

        // Live local time for the country's primary timezone
        const localTimeEl = el('Time');
        // clear any previous interval
        if (_countryTimeInterval) {
            clearInterval(_countryTimeInterval);
            _countryTimeInterval = null;
        }

        const startLiveTime = tzString => {
            if (!localTimeEl) return;
            // choose formatter depending on availability
            const fmtOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

            // If tzString looks like an IANA timezone (contains '/'), use Intl with timeZone
            if (typeof tzString === 'string' && tzString.includes('/')) {
                try {
                    const formatter = new Intl.DateTimeFormat(undefined, { ...fmtOptions, timeZone: tzString });
                    localTimeEl.innerText = formatter.format(new Date());
                    _countryTimeInterval = setInterval(() => {
                        localTimeEl.innerText = formatter.format(new Date());
                    }, 1000);
                    return;
                } catch (e) {
                    // fall back to offset parsing below
                    console.warn('Invalid IANA timezone, falling back to offset parse:', tzString, e);
                }
            }

            // Parse 'UTC±HH:MM' style strings (allow both ASCII '-' and unicode '−')
            const parseUTCOffset = s => {
                if (!s || typeof s !== 'string') return null;
                const cleaned = s.replace('\u2212', '-'); // replace unicode minus if present
                const m = cleaned.match(/UTC\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i);
                if (!m) return null;
                const sign = m[1] === '-' ? -1 : 1;
                const hours = parseInt(m[2], 10) || 0;
                const minutes = parseInt(m[3] || '0', 10) || 0;
                return sign * (hours * 60 + minutes);
            };

            const offsetMinutes = parseUTCOffset(tzString);
            if (offsetMinutes == null) {
                // if no parse possible, show the raw timezone string
                localTimeEl.innerText = tzString || 'N/A';
                return;
            }

            // show live time based on offset from UTC
            const updateByOffset = () => {
                const now = new Date();
                const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
                const localMs = utcMs + offsetMinutes * 60000;
                localTimeEl.innerText = new Date(localMs).toLocaleString(undefined, fmtOptions);
            };

            updateByOffset();
            _countryTimeInterval = setInterval(updateByOffset, 1000);
        };

        // Use the first timezone listed (if any)
        const primaryTz = (country.timezones && country.timezones[0]) || null;
        if (primaryTz) {
            startLiveTime(primaryTz);
        } else if (localTimeEl) {
            localTimeEl.innerText = 'N/A';
        }

        // Last updated
        const updatedEl = el('last-updated');
        if (updatedEl) updatedEl.innerText = `Last updated: ${new Date().toLocaleString()}`;
    })
    .catch(err => {
        console.error('Error fetching country data:', err);
        alert('Error fetching country data: ' + err.message);
    });
