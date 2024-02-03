const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');


const planets = require('../routes/planets/planets.mongo')

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

function loadAllPlanets() {
    return new Promise((resolve , reject) => {
    fs.createReadStream(path.join(__dirname , '..' , '..' , 'data' , 'kepler_data.csv'))
    .pipe(parse({
        comment: '#',
        columns: true,
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            savePlanets(data);
        }
    })
    .on('error', (err) => {
        console.log(err);
        reject();
    })
    .on('end', async() => {
        const countPlanets = (await getAllPlanets()).length;
        console.log(`${countPlanets} habitable planets found!`);
        resolve();
    });
    })
}

async function getAllPlanets() {
    // first object finds the matching thing in the database
    // 0 and 1 in second object denotes the exclude or include of property in the document
    return await planets.find({},{
        '_id':0,
        '__v':0
    });
}

async function savePlanets(planet) {
    // first object find the data in the database 
    // if not found then second object creates it in the database
    try{
        await planets.updateOne({
            keplerName: planet.kepler_name,
        },
        {
            keplerName: planet.kepler_name
        },
        {
            upsert: true
        })
    }catch(err) {
        console.log(`Cannot save a planet ${err}`)
    }
    
}

module.exports = {
    getAllPlanets,
    loadAllPlanets
}