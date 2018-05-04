"use strict";

const { Schema } = require("mongoose");
const database = require("./database");


let FlightSchema = new Schema({
    fromAirport: { type: String, required: true },
    toAirport: { type: String, required: true },
    airline: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    flightNumber: { type: Number, required: true }
});


FlightSchema.statics.findFromAirport = function (fromAirportName, cb) {
    return this.find({ fromAirport: fromAirportName }, cb);
}

FlightSchema.statics.findToAirport = function (toAirportName, cb) {
    return this.find({ toAirport: toAirportName }, cb);
}


module.exports = database.model("Flight", FlightSchema);
