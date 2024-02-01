const api_url = 'http://localhost:8000'

async function httpGetPlanets() {
  const response = await fetch(`${api_url}/planets`)
  return await response.json();
}

// TODO: Once API is ready.
// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${api_url}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a , b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${api_url}/launches` , {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch)
    }) 
  } catch(err) {
    return {
      ok: false
    }
  }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${api_url}/launches/${id}` , {
      method: "delete"
    });
  }catch(error){
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};