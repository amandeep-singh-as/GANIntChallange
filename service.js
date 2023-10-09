const CITIES = require("./addresses.json");
const EARTH_RADIUS = 6371;
const TASKID = "2152f96f-50c7-4d76-9e18-f7033bd14428";

const DISTANCE_RESULTS = {}

const getCityByGUID = (guid) => {
    const city = CITIES.filter(city => {
        return city.guid === guid
    });

    return city[0];
};

const getCitiesByTag = (isActive = true, tag) => {
    const filteredCities = CITIES.filter(city => {
        return city.isActive === isActive && city.tags.includes(tag);
    });

    return filteredCities;
};

const calculateDistance = (from, to) => {
    fromCity = getCityByGUID(from);
    toCity = getCityByGUID(to);

    const dLat = (toCity.latitude - fromCity.latitude) * (Math.PI / 180);
    const dLong = (toCity.longitude - fromCity.longitude) * (Math.PI / 180);

    const toLat = toCity.latitude * (Math.PI / 180);
    const fromLat = fromCity.latitude * (Math.PI / 180);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLong / 2) * Math.sin(dLong / 2) * Math.cos(toLat) * Math.cos(fromLat);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = EARTH_RADIUS * c;

    return Math.round((distance + Number.EPSILON) * 100) / 100;

};

const calculateArea = async (from, distance) => {
    const fromCity = getCityByGUID(from);
    const resultCities = [];

    for (const city of CITIES) {
        if (city.guid !== from) {
            const { latitude, longitude } = city;
            const dLat = (latitude - fromCity.latitude) * (Math.PI / 180);
            const dLong = (longitude - fromCity.longitude) * (Math.PI / 180);

            const centerLat = fromCity.latitude * (Math.PI / 180);
            const cityLat = latitude * (Math.PI / 180);

            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLong / 2) * Math.sin(dLong / 2) * Math.cos(centerLat) * Math.cos(cityLat);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            const cityDistance = EARTH_RADIUS * c;

            Math.round((cityDistance + Number.EPSILON) * 100) / 100;
            if (cityDistance <= distance) {
                resultCities.push(city);
            }
        }
    }
    DISTANCE_RESULTS[TASKID] = resultCities;
};


const getAreaResult = (taskId) => {
    return DISTANCE_RESULTS[taskId];
}

module.exports = {
    getCitiesByTag, calculateDistance, calculateArea, getAreaResult
}