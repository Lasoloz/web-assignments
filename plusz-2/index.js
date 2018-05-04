"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const readForm = require("./fileRead");


let app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(new session({
    secret: "42-mestint-vagy-nem-mestint",
    resave: true,
    saveUninitialized: false
}));


// GET:
app.get('/', function (req, res) {
    const formData = readForm("form.json");
    res.render("index", { formData });
});

app.post('/', function (req, res) {
    const formData = readForm("form.json");
    if (req.session && req.session.data) {
        if (req.session.data.length == 5) {
            req.session.data = req.session.data.slice(1);
        }

        req.session.data.push(req.body);
    } else {
        req.session.data = [req.body];
    }
    res.render("index", { formData, saved: true });
});


app.get("/sessionData", function (req, res) {
    if (!req.session.data) {
        return res.send("Nincs session");
    }

    let sessionData = "";
    for (let elem of req.session.data) {
        for (let field in elem) {
            sessionData += field + ": " + elem[field] + ", ";
        }
        sessionData += ';\n';
    }
    res.send("Sessionbe mentett adatok: " + sessionData);
});



// Listen:
app.listen(3001, function (err) {
    if (err) {
        return console.error("Failed to start listening!");
    }
    console.log("Listening on 3001...");
});
