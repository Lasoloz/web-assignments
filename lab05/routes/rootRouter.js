"use strict";
const { Router } = require("express");
const Flight = require("../src/flight");

// Sub-routers:
const flightRouter = require("./flightRouter");


let router = new Router();


// Add root:
router.get('/', function (req, res) {
    Flight.find({}).then(function rootFindAllThen(flights) {
        res.render("index", {
            success: true,
            fromAirports: [... new Set(flights.map(
                flight => flight.fromAirport
            ))],
            toAirports: [... new Set(flights.map(flight => flight.toAirport))]
        });
    }).catch(function findAllCatch(err) {
        res.render("index", { success: false });
    });
});


router.use("/flight", flightRouter);



router.get("/alive", function (req, res) {
    res.status(200).send({ alive: true });
});


module.exports = router;
