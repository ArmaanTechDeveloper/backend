const path = require('path')
const https = require('https')
const fs = require('fs')

const express = require('express')
const helmet = require('helmet')
const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
require('dotenv').config()

const logger = require('./utils/logger')
const app = express();

const config = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
}

const authOptions = {
    callbackURL: '/auth/google/callback',
    clientID: config.clientId,
    clientSecret: config.clientSecret
}

function verifyCallback(accessToken , refreshToken , profile , done) {
    console.log('Google profie' , profile)
    // first argument is the error argument and then the profile 
    done(null , profile) // to let passport know that the user is now logged in 
}

passport.use(new Strategy(authOptions , verifyCallback))

const PORT = 3000;

app.use(helmet())
app.use(passport.initialize())
app.use(logger)

function checkLoggedIn(req , res , next) {
    const isLoggedIn = false;
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
    session: false
}) , (req , res) => { console.log('Google called us back ') })
app.get('/failure' , (req , res) => {
    res.send('Failed to authenticate')
})
app.get('/auth/logout' , (req , res) => {})

app.get('/secret', checkLoggedIn , (req , res) => {
    return res.send('Your Secret code is 52 !')
})

https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
} , app).listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})