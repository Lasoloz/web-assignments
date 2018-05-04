"use strict";

const mongoose = require("mongoose");

let dbObj = mongoose.createConnection("mongodb://localhost/lab05");

dbObj.on("error", function (err) {
    console.error("Failed to connect:", err.message);
});

module.exports = dbObj;
