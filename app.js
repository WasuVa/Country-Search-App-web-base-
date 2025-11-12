console.log("App is running");
 
function searchcon() {
    fetch(`https://restcountries.com/v3.1/name/${document.getElementById('country-input').value}`)
    .then(response => response.json())
    .then(data => {
        const country = data[0];
        document.getElementById('country-name').innerText = `Name: ${country.name.common}`;
        document.getElementById('country-info').innerText = `Region: ${country.region}`;
        document.getElementById('country-population').innerText = `Population: ${country.population}`;
        document.getElementById('country-flag').innerHTML = `<img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="100"></img>`;
        document.getElementById('country-capital').innerText = `Capital: ${country.capital[0]}`;
        
        const lat = country.latlng[0];
        const lng = country.latlng[1];
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-5},${lat-5},${lng+5},${lat+5}&layer=mapnik&marker=${lat},${lng}`;
        
        document.querySelector('.google-map').innerHTML = `<iframe width="600px" height="400px" frameborder="0" src="${mapUrl}"></iframe>`;
    })
}

