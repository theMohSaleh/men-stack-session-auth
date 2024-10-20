const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const AddUserToViews = require('./middleware/addUserToViews.js');
const isSignedIn = require("./middleware/is-signed-in.js");
require("dotenv").config();
require('./config/database')

// Controllers 

const authController = require("./controllers/auth.js");

const app = express();

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});

// Middleware

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
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

app.use("/auth", authController);

app.use(AddUserToViews);


// Public Routes

// GET /
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// Protected Routes

app.use(isSignedIn);

app.get("/vip-lounge", (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`);
    } else {
        res.sendStatus(404);
        // res.send("Sorry, no guests allowed.");
    }
});