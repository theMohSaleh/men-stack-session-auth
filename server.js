const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require('express-session');
require("dotenv").config();
require('./config/database')

// Controllers 

const authController = require("./controllers/auth.js");

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

// MIDDLEWARE

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use("/auth", authController);

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});

// ROUTES

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs", { user: req.session.user });
});
