const axios = require('axios')

const launchesDatabase = require('../routes/launches/launches.mongo')
const planets = require('../routes/planets/planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27 , 2030'),
    target: 'Kepler-442 b',
    customers: ['ztm' , 'nasa'],
    upcoming: true,
    success: true
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
async function loadLaunchData() {
    console.log('Downlaoding launches data');

    // first is url second is body
    const response = await axios.post(SPACEX_API_URL , {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1,
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customer: 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;

    for(const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers:  customers
        }

        console.log(`${launch.flightNumber} ${launch.mission}`)
    }
}

async function existsLaunchWithId(launchId){
    return await launchesDatabase.find({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne() 
        .sort('-flightNumber')
    
    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

    return latestLaunch.flightNumber;
}

async function getAllLaunches() {
    return await launchesDatabase.find({} , {'_id': 0 , '__v':0 });
}

async function saveLaunch(launch) {
    const planet = await planets.findOne({ keplerName: launch.target })

    if(!planet) {
        throw new Error('Planet was not found in the database')
    }

    return await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch , {
        upsert: true
    })
}

saveLaunch(launch);

async function scheduleNewLaunch(launch) {

    const newFlightNumber = await getLatestFlightNumber() +1;

    const newLaunch = Object.assign(launch , {
        success: true,
        upcoming: true,
        customer: ['ZTM' , 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}


async function abortLaunchById(launchId){

    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch
}