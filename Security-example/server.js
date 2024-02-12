const path = require('path')
const https = require('https')
const fs = require('fs')

const express = require('express')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const cookieSession = require('cookie-session')
require('dotenv').config()

const logger = require('./utils/logger')
const app = express();

const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    cookieKey: process.env.COOKIE_KEY
}

const authOptions = {
    callbackURL: '/auth/google/callback',
    clientID: config.clientId,
    clientSecret: config.clientSecret
}

function verifyCallback(accessToken , refreshToken , profile , done) {
    // first argument is the error argument and then the profile 
    done(null , profile) // to let passport know that the user is now logged in 
}

passport.use(new Strategy(authOptions , verifyCallback))

// save the session to cookie
passport.serializeUser((user , done) => {
    done(null , user.id)
})
// puts the user into the req.user parameter
// Read the session from the cookie
passport.deserializeUser((id , done) => {
    // if you want to fetch the user details from the database you can do it here /
    // pass the updated user in place of id and it will be available in req.user
    done(null , id)
})

const PORT = 3000;

app.use(helmet())
app.use(cookieSession({
    name: 'session',
    maxAge:  20 * 1000,
    keys: [ config.cookieKey ] // session signed with this secret key
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(logger)

function checkLoggedIn(req , res , next) {
    console.log('Current user' , req.user)
    const isLoggedIn = req.isAuthenticated() && req.user;
    if(!isLoggedIn){
        return res.status(401).send('Error : You must login to see the secret')
    }
    next();
}

app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname , 'public' , 'index.html'))
})


app.get('/auth/google' , passport.authenticate('google' , {
    scope: ['email'],
}))

app.get('/auth/google/callback' , passport.authenticate('google' , {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true
}) , (req , res) => { console.log('Google called us back ') })


app.get('/failure' , (req , res) => {
    res.send('Failed to authenticate')
})

app.get('/auth/logout' , (req , res) => {
    req.logout() // removes req.user & terminates any logged in session
    return res.redirect('/')
})

app.get('/secret', checkLoggedIn , (req , res) => {
    return res.send('Your Secret code is 52 !')
})

https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
} , app).listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})