//weather CLI tool

const axios = require('axios');
const { Command } = require('commander');
const program = new Command();

program
    .version('1.0.0')
    .description('CLI tool to get temperature of a city')
    .option('-c, --city <name>', 'name of the city')
    .parse(process.argv);

const options = program.opts();

if (!options.city) {
    console.error('City name is required.');
    process.exit(1);
}

const getWeather = async (city) => {
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`);
        const temperature = response.data.main.temp;
        console.log(`The temperature in ${city} is ${temperature}°C.`);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('City not found.');
        } else {
            console.error('An error occurred while fetching the weather data.');
        }
    }
};

getWeather(options.city);
//consoleshi gasatestad:
// node weather.js --city London