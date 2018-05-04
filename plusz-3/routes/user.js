"use strict";


const { Router } = require("express");
const db = require("../db");

let router = new Router();



router.get("/list", function (req, res) {
    res.send({
        success: true,
        users: db.map(user => {
            return {
                id: user.id, firstName: user.firstName, lastName: user.lastName
            };
        })
    });
});


router.get("/find/:id", function (req, res) {
    const userId = req.params.id;

    if (!userId) {
        return res.send({ success: false });
    }

    const userIdNumber = parseInt(userId);

    res.send({
        success: true,
        user: db.find(element => element.id == userIdNumber)
    });
});


router.post("/call/:id/:value", function (req, res) {
    const userId = req.params.id;
    const callVal = req.params.value;

    if (!userId) {
        return res.send({ success: false });
    }

    if (!callVal) {
        return res.send({ success: false });
    }

    const userIdNumber = parseInt(userId);

    db.find(element => element.id == userId).telephone.units -= callVal;
    res.send({ success: true });
});


module.exports = router;
