const express = require('express')

const friendsRouter = require('./routes/friends.route')

const app = express();

const PORT = 3000;

app.use((req , res , next) => {
    const start = Date.now()
    next()
    const delta = Date.now() - start
    console.log(`${req.method}  ${req.baseUrl}${req.url}  ${delta}ms`)
})

app.use(express.json())

app.use('/friends' , friendsRouter)

app.listen(PORT , () => {
    console.log(`Server is now listening on ${PORT}`)
})