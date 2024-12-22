function extractAndSearch() {
    const inputText = document.getElementById('inputText').value;

    // find the word "Google"
    const googleIndex = inputText.indexOf("Google");
    const resultElement = document.getElementById('result');
    const mapsLinkElement = document.getElementById('mapsLink');

    if (googleIndex === -1) {
        resultElement.innerHTML = "<p>The word 'Google' was not found.</p>";
        mapsLinkElement.innerHTML = "<p>No links available.</p>";
        return;
    }

    const textUpToGoogle = inputText.substring(0, googleIndex);
    const textAfterGoogle = inputText.substring(googleIndex);

    let locationMapsUrl = null;
    let coordinatesMapsUrl = null;
    let latitude = null;
    let longitude = null;

    // process arrays with words for location-based search
    const matches = textUpToGoogle.match(/\[\s*\"[^\]]*\"\s*,\s*\"[^\]]*\"\s*\]/g);
    if (matches && matches.length > 0) {
        const processedLocations = matches.map(match => {
            const elements = match.match(/\"([^\"]+)\"/g).map(item => item.replace(/\"/g, ''));
            elements.pop(); // remove the last element (language)
            return elements.join(', ');
        });

        let combinedLocation = "";
        if (processedLocations.length > 1) {
            combinedLocation = `${processedLocations[1]}, ${processedLocations[0]}`;
        } else {
            combinedLocation = processedLocations[0];
        }

        // generate Google Maps link for location-name-based search
        locationMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(combinedLocation)}`;

        resultElement.innerHTML = "<strong>Found Arrays:</strong><br>" + matches.join('<br>');
    } else {
        resultElement.innerHTML = "<p>No valid location-based arrays found.</p>";
    }

    // extract latitude and longitude for coordinates-based search
    const latLongMatch = textAfterGoogle.match(/null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (latLongMatch) {
        latitude = latLongMatch[1];
        longitude = latLongMatch[2];

        // generate Google Maps link for coordinates-based search
        coordinatesMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        // append coordinates to the results
        resultElement.innerHTML += `<br><br><strong>Extracted Coordinates:</strong><br>Latitude: ${latitude}<br>Longitude: ${longitude}`;
    }

    // display the Google Maps links
    mapsLinkElement.innerHTML = ""; 

    if (coordinatesMapsUrl) {
        mapsLinkElement.innerHTML += `<p><strong>Google Maps Link for Coordinates-Based Search:</strong><br><a href="${coordinatesMapsUrl}" target="_blank">${coordinatesMapsUrl}</a></p>`;
    } else {
        mapsLinkElement.innerHTML += "<p>No valid coordinates found.</p>";
    }

    if (locationMapsUrl) {
        mapsLinkElement.innerHTML += `<p><strong>Google Maps Link for Location-Based Search:</strong><br><a href="${locationMapsUrl}" target="_blank">${locationMapsUrl}</a></p>`;
        mapsLinkElement.innerHTML += `<p class="warning">Warning: Location-Name-based searches might not always provide accurate results. Please verify the address.</p>`;
    } else {
        mapsLinkElement.innerHTML += "<p>No valid location-based arrays found.</p>";
    }
}
