const weatherApiKey = '20c2177e888a8475c2c3c8bc5aeb502c';

document.addEventListener('DOMContentLoaded', () => {
    // Function to update the UI with retrieved weather details
    function updateUI(weatherData) {
        console.log('Updating UI with:', weatherData); 

        const tempElement = document.querySelector('#temp');
        const dateElement = document.querySelector('#date');
        const contentElement = document.querySelector('#content');
        const userFeeling = document.querySelector('#feelings').value;

        if (weatherData.cod === '404') {
            tempElement.textContent = 'Location not found. Please enter a valid zip code.';
            dateElement.textContent = '';
            contentElement.textContent = '';
        } else if (weatherData.main?.temp) {
            dateElement.textContent = new Date().toLocaleDateString();
            tempElement.textContent = `Temp: ${Math.round(weatherData.main.temp)}°F`;
            contentElement.textContent = userFeeling ? `Feeling: ${userFeeling}` : 'No mood recorded.';
        } else {
            console.error('Unexpected API response:', weatherData);
            tempElement.textContent = 'Error: Unable to retrieve temperature data';
        }
    }

     // Function to GET Project Data from the server
     async function getStoredData() {
        try {
            const response = await fetch('/getData');
            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const storedData = await response.json();
            console.log('Stored data retrieved:', storedData);
            return storedData;
        } catch (error) {
            console.error('Error retrieving stored data:', error);
            return null;
        }
    }

    // Function to GET Web API Data
    async function getWeather(zipCode) {
        const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${weatherApiKey}&units=imperial`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`API response error: ${response.status}`);
            }
    
            const weatherData = await response.json();
            console.log('Weather data received:', weatherData);
            return weatherData;
        } catch (error) {
            console.error('Weather data fetch failed:', error);
            alert(`Failed to retrieve weather details: ${error.message}`);
            return null;
        }
    }
    // Update the UI using server data
async function updateFromServer() {
    const retrievedData = await getStoredData();
    if (retrievedData) {
        updateUI(retrievedData);
    }
}

    // Function to POST data to the server
    async function postData(url = '', data = {}) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            console.log('Data saved to server:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error while sending data to server:', error);
            return null;
        }
    }

     

    // Event listener for the "Generate" button
    document.querySelector('#generate').addEventListener('click', async () => {
        const zipCode = document.querySelector('#zip').value.trim();
        const userInput = document.querySelector('#feelings').value;

        if (zipCode && /^\d{5}(-\d{4})?$/.test(zipCode)) {
            console.log('Fetching weather for zip code:', zipCode);
            const weatherDetails = await getWeather(zipCode);
            if (weatherDetails) {
                console.log('Saving weather data to server...');
                await postData('/saveData', { ...weatherDetails, userFeeling: userInput });
                console.log('Updating UI with latest data...');
                updateFromServer();
            }
        } else {
            alert('Invalid zip code! Please enter a valid 5-digit zip code.');
        }
    });
});