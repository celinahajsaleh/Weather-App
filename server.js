

// Express to run server and routes
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';


// Start up an instance of app
const app = express();

const serverPort = 3011;

// Setup empty JS object to act as endpoint for all routes
let projectData = {};

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.static('client'));

// Spin up the server
// app.listen(serverPort, () => {
//     console.log(`Application running on: http://localhost:${serverPort}`);
// });

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

// Route to fetch weather data
app.get('/getWeather', async (req, res) => {
    const { zipCode } = req.query;
    console.log('Fetching weather for zip code:', zipCode);

    const apiEndpoint = `http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}&units=imperial`;

    try {
        console.log('Making request to OpenWeatherMap API:', apiEndpoint);
        const apiResponse = await fetch(apiEndpoint);
        const weatherInfo = await apiResponse.json();


        if (!apiResponse.ok) {
            console.error('OpenWeatherMap API Error:', apiResponse.status, apiResponse.statusText);
            throw new Error(`OpenWeatherMap API Error: ${apiResponse.status} ${apiResponse.statusText}`);
        }


        // const weatherInfo = await apiResponse.json();
        console.log('Weather data received from OpenWeatherMap:', weatherInfo);

        res.json(weatherInfo);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error fetching weather data', details: error.message }); // Return JSON error
    }
});

// Route to save data
app.post('/saveData', (req, res) => {
    projectData = req.body;
    res.json({ message: 'Data successfully saved!', projectData });
});

// Route to get stored data
app.get('/getData', (req, res) => {
    res.json(projectData);
});


// Start server
app.listen(serverPort, () => {
  console.log(`Application running on: http://localhost:${serverPort}`);
});