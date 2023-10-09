const express = require("express");
const service = require('./service');

const fs = require('fs-extra');


const TASKID = "2152f96f-50c7-4d76-9e18-f7033bd14428";


const TOKEN = "bearer dGhlc2VjcmV0dG9rZW4="
const PORT = '8080'
const app = express();

app.use((req, res, next) => {
    const header = req.header("Authorization");
    if (header === TOKEN) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
});

app.get('/cities-by-tag', (req, resp) => {
    const tag = req.query.tag;
    const isActive = JSON.parse(req.query.isActive);

    const filteredCities = service.getCitiesByTag(isActive, tag);

    resp.status(200).json({
        cities: filteredCities
    });
});

app.get('/distance', (req, resp) => {
    const from = req.query.from;
    const to = req.query.to;

    const distance = service.calculateDistance(from, to);
    resp.json({
        from: {
            guid: from
        }, to: {
            guid: to
        }, unit: 'km',
        distance: distance
    });
});

app.get('/area', async (req, resp) => {
    const from = req.query.from;
    const distance = req.query.distance;
    service.calculateArea(from, distance)
    const resultsUrl = `${req.protocol}://${req.get('host')}/area-result/${TASKID}`;
    resp.status(202).json({ resultsUrl });
});


app.get("/area-result/:resultId", async (req, resp) => {
    const resultId = req.params.resultId;

    const result = service.getAreaResult(resultId);
    resp.json({
        cities: result
    })
   
});

app.get("/all-cities", (req, resp) => {
    const fileStream = fs.createReadStream("./addresses.json");
    fileStream.pipe(resp);
})

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

module.exports = () => {
    return app;
}

