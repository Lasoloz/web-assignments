"use strict";

// Required modules:
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

// Router modules:
const rootRouter = require("./routes/rootRouter");


// Application:
let app = express();

// Application setup:
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


// Application router:
app.use(rootRouter);


// Application listen:
app.listen(3002, function (err) {
    if (err) {
        return console.error("Listen error: ", err);
    }

    console.log("Application listening on port 3002...");
});
