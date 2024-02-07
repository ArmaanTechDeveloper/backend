const path = require('path')
const https = require('https')
const fs = require('fs')
const express = require('express')

const app = express();

const PORT = 3000;


app.get('/' , (req , res) => {
    res.sendFile(path.join(__dirname , 'public' , 'index.html'))
})
app.get('/secret' , (req , res) => {
    return res.send('Your Secret code is 52 !')
})

https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
}).listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})