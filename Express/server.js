const express = require('express')

const app = express();

const PORT = 3000;

const friends = [
    {
        id: 0,
        name: "Nolan Romero"
    },
    {
        id: 1,
        name: "Laurel Gibbs"
    }
]

app.use((req , res , next) => {
    const start = Date.now()
    next()
    const delta = Date.now() - start
    console.log(`${req.method}  ${req.url}  ${delta}ms`)
})

app.use(express.json())

app.get('/friends' , (req , res) => {
    res.send(friends)
})

app.get('/friends/:friendId' , (req , res) => {
    const friendId = Number(req.params.friendId)
    const friend = friends[friendId]

    if(friend){
        res.status(200).json(friend)
    }
    else{
        res.status(404).json({
            error: "Friend does not exist"
        })
    }
})

app.post('/friends' , (req , res) => {
    if(!req.body.name){
        return res.status(400).json({
            error: "Name does not exist"
        })
    }

    const newFriend = {
        name: req.body.name,
        id: friends.length
    }

    friends.push(newFriend)
    res.json(newFriend)
})

app.listen(PORT , () => {
    console.log(`Server is now listening on ${PORT}`)
})