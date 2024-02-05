const http = require('http');
const mongoose = require('mongoose')
const dotenv = require("dotenv")

const app = require('./app');
const { loadAllPlanets } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')

dotenv.config();
const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://nasa-api:${process.env.MONGO_PASSWORD}@nasacluster.f8dfdfu.mongodb.net/nasa?retryWrites=true&w=majority`

const server = http.createServer(app);

mongoose.connection.once('open' , () => {
    console.log(`mongoDB connection ready`);
})

mongoose.connection.once('error' , (err) => {
    console.error(err);
})

async function startServer() {
    await mongoose.connect(MONGO_URL);
    await loadAllPlanets();
    await loadLaunchData();

    server.listen(PORT , () => {
        console.log(`Listening on PORT ${PORT} ... `)
    })
}
startServer();

