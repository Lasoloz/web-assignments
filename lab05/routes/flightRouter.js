"use strict";


const { Router } = require("express");
const Flight = require("../src/flight")


let router = new Router();



// Add flight requests:
router.get("/list/:fromAirport", function (req, res) {
    const fromAirport = req.params.fromAirport;

    if (fromAirport == undefined) {
        return res.send({ success: false });
    }

    Flight.find({ fromAirport }).then(function listFromToResolved(flights) {
        res.send({
            success: true,
            toAirports: [... new Set(flights.map(flight => flight.toAirport))]
        });
    }).catch(function (error) {
        res.send({ success: false });
    });
});


router.get("/:fromAirport/:toAirport", function (req, res) {
    const fromAirport = req.params.fromAirport;
    const toAirport = req.params.toAirport;

    if (!fromAirport || !toAirport) {
        return res.send({ success: false });
    }

    Flight.find({
        fromAirport, toAirport
    }).then(function listFlightsResolved(flights) {
        res.send({
            success: true,
            flights: flights.map(flight => flight.toObject())
        });
    }).catch(function listFlightsRejected(flights) {
        res.send({ success: true });
    });
});


// Module exports:
module.exports = router;
