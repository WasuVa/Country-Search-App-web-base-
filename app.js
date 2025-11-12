console.log("App is running");
 
function searchcon() {
    const countryInput = document.getElementById('country-input').value;
    
    if (!countryInput.trim()) {
        alert('Please enter a country name!');
        return;
    }
    
    fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
    .then(response => response.json())
    .then(data => {
        const country = data[0];
        document.getElementById('country-name').innerText = country.name.common;
        document.getElementById('country-info').innerText = country.region || 'N/A';
        document.getElementById('country-population').innerText = country.population.toLocaleString();
        document.getElementById('country-capital').innerText = country.capital ? country.capital[0] : 'N/A';
        
        document.getElementById('country-flag').innerHTML = `<img src="${country.flags.png}" alt="Flag of ${country.name.common}"></img>`;
        document.getElementById('coat').innerHTML =`<img width="210px" height="auto" src="${country.coatOfArms.png}" alt="Coat of Arms of ${country.name.common}"></img>`;
        
        const lat = country.latlng[0];
        const lng = country.latlng[1];
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-5},${lat-5},${lng+5},${lat+5}&layer=mapnik&marker=${lat},${lng}`;
        
        document.getElementById('mapVIEW').innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border-radius: 12px;" src="${mapUrl}"></iframe>`;
    })
}

