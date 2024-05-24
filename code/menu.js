document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map1').setView([39.8283, -98.5795], 4); // Centered on the USA

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    async function fetchBreweries(query = '') {
        const api_url = query ? `https://api.openbrewerydb.org/breweries?by_state=${query}` : 'https://api.openbrewerydb.org/breweries';

        try {
            const response = await fetch(api_url);
            const data = await response.json();
            data.forEach(brewery => {
                if (brewery.latitude && brewery.longitude) {
                    const marker = L.marker([brewery.latitude, brewery.longitude]).addTo(map);
                    marker.bindPopup(`<b>${brewery.name}</b><br>${brewery.street}<br>${brewery.city}, ${brewery.state}<br><a href="${brewery.website_url}" target="_blank">Website</a>`);
                }
            });
        } catch (error) {
            console.error('Error fetching brewery data:', error);
        }
    }

    document.querySelector('button[type="submit"]').addEventListener('click', function() {
        const searchBarValue = document.getElementById('searchbar').value.trim();
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        fetchBreweries(searchBarValue);
    });

    fetchBreweries(); // Fetch initial data without any query to show some breweries initially

    document.getElementById('btn').addEventListener("click", function() {
        const mybtn = document.getElementById('myList');
        mybtn.style.display = (mybtn.style.display !== 'block') ? 'block' : 'none';
    });
});

