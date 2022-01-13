
'use strict'
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const url = require("url");

const app = express();
app.use('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})
app.use(cors());

const fields = [
    "humidity",
    "pressureSeaLevel",
    "uvIndex",
    "precipitationProbability",
    "sunriseTime",
    "sunsetTime",
    "visibility",
    "moonPhase",
    "precipitationIntensity",
    "precipitationType",
    "windSpeed",
    "windGust",
    "windDirection",
    "temperature",
    "temperatureApparent",
    "cloudCover",
    "cloudBase",
    "cloudCeiling",
    "weatherCode",
    "temperatureMax",
    "temperatureMin"
]

// weather call
app.get('/api', async (request, response) => {
    try {
        const obj = url.parse(request.url, true).query;
        let location = obj.id;
        const params = {
            "fields": fields,
            "location": location,
            "apikey": "i70rNDdv7PMnZ8q9AgBZLjWWG5rwC95L",
            "timezone": "America/Los_Angeles",
            "units": "imperial",
            "timesteps": "1d"
        }
        const result = await axios.get("https://api.tomorrow.io/v4/timelines", {params});

        response.status(200).send(result.data)
    } catch (error) {
        response.status(404).send(error.message)
    }
    // return;

})

app.get('/api', (req, res) => {
    //d7hMqWpyCb4Fmqk0xgRm73jy6XeowrX8
   // const url = 'https://api.tomorrow.io/v4/timelines?location=-73.98529171943665,40.75872069597532&apikey=d7hMqWpyCb4Fmqk0xgRm73jy6XeowrX8&timezone=America/Los_Angeles&units=imperial&timesteps=1d&fields=' + fields;
   const url = 'https://api.tomorrow.io/v4/timelines?location=' + req.params.location + '&apikey=d7hMqWpyCb4Fmqk0xgRm73jy6XeowrX8&timezone=America/Los_Angeles&units=imperial&timesteps=1d&fields=' + fields;
   const options = {method: 'GET', headers: {Accept: 'application/json'}};
   fetch(url, options)
     .then(res => res.json())
     .then(json => {
       console.log(json);

       res.status(200).send(json).end();
     })
     .catch(err => console.error('error:' + err));
    // const data = '{"data":{"timelines":[{"timestep":"1d","startTime":"2021-12-07T19:00:00-08:00","endTime":"2021-12-21T19:00:00-08:00","intervals":[{"startTime":"2021-12-07T19:00:00-08:00","values":{"temperature":-15.03,"temperatureApparent":-40.54,"temperatureMin":-25.46,"temperatureMax":-15.03,"windSpeed":22.46,"windDirection":131.59,"humidity":71.65,"pressureSeaLevel":29.22,"weatherCode":1000,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":9.94,"moonPhase":1,"cloudCover":100,"uvIndex":6}},{"startTime":"2021-12-08T19:00:00-08:00","values":{"temperature":-18.96,"temperatureApparent":-42.3,"temperatureMin":-30.05,"temperatureMax":-18.96,"windSpeed":20.38,"windDirection":121.41,"humidity":72.83,"pressureSeaLevel":29.1,"weatherCode":1000,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":9.94,"moonPhase":1,"cloudCover":3.91,"uvIndex":6}},{"startTime":"2021-12-09T19:00:00-08:00","values":{"temperature":-20.06,"temperatureApparent":-38.63,"temperatureMin":-33.12,"temperatureMax":-20.06,"windSpeed":11.39,"windDirection":120.86,"humidity":72.41,"pressureSeaLevel":29.06,"weatherCode":1001,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":9.94,"moonPhase":2,"cloudCover":100,"uvIndex":6}},{"startTime":"2021-12-10T19:00:00-08:00","values":{"temperature":-21.64,"temperatureApparent":-37.5,"temperatureMin":-34.35,"temperatureMax":-21.64,"windSpeed":9.78,"windDirection":119.41,"humidity":73.95,"pressureSeaLevel":29.07,"weatherCode":1001,"precipitationProbability":5,"precipitationType":2,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":12.05,"moonPhase":2,"cloudCover":92.97,"uvIndex":6}},{"startTime":"2021-12-11T19:00:00-08:00","values":{"temperature":-10.57,"temperatureApparent":-29.7,"temperatureMin":-23.78,"temperatureMax":-10.57,"windSpeed":14.79,"windDirection":80.84,"humidity":75.29,"pressureSeaLevel":29.17,"weatherCode":2100,"precipitationProbability":5,"precipitationType":2,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":2,"cloudCover":100,"uvIndex":8}},{"startTime":"2021-12-12T19:00:00-08:00","values":{"temperature":-12.42,"temperatureApparent":-35.05,"temperatureMin":-27.89,"temperatureMax":-12.42,"windSpeed":16.64,"windDirection":87.28,"humidity":72.25,"pressureSeaLevel":29.43,"weatherCode":1001,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":2,"cloudCover":100}},{"startTime":"2021-12-13T19:00:00-08:00","values":{"temperature":-7.33,"temperatureApparent":-26.84,"temperatureMin":-22.16,"temperatureMax":-7.33,"windSpeed":14.85,"windDirection":101.02,"humidity":72.99,"pressureSeaLevel":29.57,"weatherCode":1001,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":3,"cloudCover":100}},{"startTime":"2021-12-14T19:00:00-08:00","values":{"temperature":-4.34,"temperatureApparent":-15.29,"temperatureMin":-23.04,"temperatureMax":-4.34,"windSpeed":14.88,"windDirection":140.33,"humidity":72.26,"pressureSeaLevel":29.81,"weatherCode":1001,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":3,"cloudCover":100}},{"startTime":"2021-12-15T19:00:00-08:00","values":{"temperature":-7.51,"temperatureApparent":-28.84,"temperatureMin":-21.15,"temperatureMax":-7.51,"windSpeed":24.5,"windDirection":149.75,"humidity":63.6,"pressureSeaLevel":30.01,"weatherCode":1000,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":3,"cloudCover":16.44}},{"startTime":"2021-12-16T19:00:00-08:00","values":{"temperature":-5.84,"temperatureApparent":-29.97,"temperatureMin":-23.04,"temperatureMax":-5.84,"windSpeed":24.5,"windDirection":136.36,"humidity":69.38,"pressureSeaLevel":29.76,"weatherCode":1100,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":3,"cloudCover":34.6}},{"startTime":"2021-12-17T19:00:00-08:00","values":{"temperature":-6.16,"temperatureApparent":-32.06,"temperatureMin":-18.33,"temperatureMax":-6.16,"windSpeed":25.35,"windDirection":124.25,"humidity":75.73,"pressureSeaLevel":29.26,"weatherCode":1001,"precipitationProbability":5,"precipitationType":2,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":4,"cloudCover":100}},{"startTime":"2021-12-18T19:00:00-08:00","values":{"temperature":1.11,"temperatureApparent":-20.22,"temperatureMin":-16.71,"temperatureMax":1.11,"windSpeed":23.49,"windDirection":112.14,"humidity":72.75,"pressureSeaLevel":29.03,"weatherCode":1001,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":4,"cloudCover":100}},{"startTime":"2021-12-19T19:00:00-08:00","values":{"temperature":-2.29,"temperatureApparent":-22.5,"temperatureMin":-24.21,"temperatureMax":-2.29,"windSpeed":17.02,"windDirection":128.04,"humidity":63.8,"pressureSeaLevel":29.12,"weatherCode":1101,"precipitationProbability":5,"precipitationType":2,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":4,"cloudCover":99.83}},{"startTime":"2021-12-20T19:00:00-08:00","values":{"temperature":-0.8,"temperatureApparent":-20.42,"temperatureMin":-23.55,"temperatureMax":-0.8,"windSpeed":17.54,"windDirection":112.02,"humidity":76.37,"pressureSeaLevel":29.05,"weatherCode":1000,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":4,"cloudCover":100}},{"startTime":"2021-12-21T19:00:00-08:00","values":{"temperature":-1.89,"temperatureApparent":-20.6,"temperatureMin":-20.97,"temperatureMax":-1.89,"windSpeed":15.01,"windDirection":109.2,"humidity":73.36,"pressureSeaLevel":28.91,"weatherCode":1000,"precipitationProbability":0,"precipitationType":0,"sunriseTime":"0001-12-31T16:37:02+8752:07","sunsetTime":"0001-12-31T16:37:02+8752:07","visibility":15,"moonPhase":5,"cloudCover":42.22}}]}]}}';
    res.status(200).send(JSON.parse(data)).end();
});


const fields2 = [
    "temperature",
    "humidity",
    "pressureSeaLevel",
    "windDirection",
    "windSpeed"
]

//meteogram api call
app.get("/chart", async (request, response) => {
    // return ;
    try {
        // let location = url.parse(request.url, true).query.id;
        const obj = url.parse(request.url, true).query;
        let location = obj.id;
        console.log(obj)
        const params = {
            "location": location,
            "fields": fields2,
            "timezone": "America/Los_Angeles",
            "timesteps": "1h,1d",
            "units": "imperial",
            'apikey': "i70rNDdv7PMnZ8q9AgBZLjWWG5rwC95L"
        }
        const result = await axios.get("https://api.tomorrow.io/v4/timelines", {params})

        response.status(200).send(result.data)
    } catch (error) {
        response.status(404).send(error.message)
    }
})

//get lat and lng call
app.get("/location",async (req, res) => {
    try {
        let location_detail = url.parse(req.url, true).query.id;
        let locationUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location_detail + "&key=AIzaSyBhurAdAyM56-tvBQikX8JnUE-c9cYr-b8"
        const result = await axios.get(locationUrl)
        res.status(200).send(result.data)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

//autocomplete api call
app.get("/auto", async (req, res) => {
    try{
        let cityLocation = url.parse(req.url, true).query.id
        let autoUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&input=` + cityLocation + `&key=AIzaSyBhurAdAyM56-tvBQikX8JnUE-c9cYr-b8`;
        const result = await axios.get(autoUrl)
        res.status(200).send(result.data)
    }catch(error) {
        res.status(400).send(error.message);
    }

})


app.get('/', (req, res) => {
    res.status(200).send('hello hw8 by fangyuanwng').end()
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    console.log('Press Ctrl+C to quit.')
})
// [END gae_node_request_example]

module.exports = app


