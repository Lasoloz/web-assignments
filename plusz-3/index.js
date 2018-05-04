"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");


const userRouter = require("./routes/user");



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
    res.redirect("/public/");
});


app.use("/user", userRouter);



// Listen:
app.listen(3001, function (err) {
    if (err) {
        return console.error("Failed to start listening!");
    }
    console.log("Listening on 3001...");
});
