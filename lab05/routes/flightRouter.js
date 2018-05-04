"use strict";


const { Router } = require("express");
const Flight = require("../src/flight")


let router = new Router();



// Add flight requests:
router.get("/listFromTo/:flightName", function (req, res) {
    const fromAirport = req.params.flightName;

    if (fromAirport == undefined) {
        return res.send({ success: false });
    }

    Flight.find({ fromAirport }).then(function listFromToResolved(flights) {
        let toAirports = flights.map(flight => flight.toAirport);
        res.send({ success: true, toAirports });
    }).catch(function (error) {
        res.send({ success: false });
    });
});


// Module exports:
module.exports = router;
