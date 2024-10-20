const express = require("express");
const User = require('../models/user');
const authConfig = require('../config/auth');

const router = express.Router();

// Sign up page
router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs')
})

// Sign up POST
router.post('/sign-up', async (req, res) => {
    // get values from body
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // check if the user already exists
    const existingUser = await User.findOne({ username });
    console.log(existingUser);

    if (existingUser) {
        return res.send("Username is taken");
    }

    // verify confirm password
    if (password !== confirmPassword) {
        return res.send("Passwords don't match!");
    }

    // create user in database
    // -b make the password secure
    const hashPassword = authConfig.encryptPassword(password);
    const payload = { username, password: hashPassword }
    const newUser = await User.create(payload);

    // respond back to the browser with created user signed in
    req.session.user = {
        username: newUser.username,
    }

    // send user back to home page
    req.session.save(() => {
        res.redirect("/");
    });
})

// Sign in page
router.get('/sign-in', async (req, res) => {
    res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // find user from the username in DB
    const user = await User.findOne({ username });

    // if user does not exist send error message
    if (!user) {
        res.send('Login failed, please try again')
    }

    // hash password and compare it
    const validPassword = authConfig.comparePassword(password, user.password)

    // if password is incorrect, send error message
    if (!validPassword) {
        return res.send('Login failed, please try again');
    }
    // else sign them in
    // create a session cookie
    req.session.user = {
        username: user.username,
    }

    // send user back to home page
    req.session.save(() => {
        res.redirect("/");
    });
})

// Sign out 
router.get('/sign-out', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
})

module.exports = router;