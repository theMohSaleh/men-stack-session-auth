const express = require("express");
const User = require('../models/user');
const authConfig = require('../config/auth');

const router = express.Router();

router.get('/sign-up', async (req, res) => {
    res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
    // get values from body
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // check if the user already exists
    const existingUser = await User.findOne({username});
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
    const payload = {username, password: hashPassword}
    const newUser = await User.create(payload);

    // respond back to the browser
    res.send(`Thanks for signing up ${newUser.username}`);
})

module.exports = router;