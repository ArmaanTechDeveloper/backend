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

app.get('/messages' , (req , res) => {
    res.send('<ul><li> My profile is a great looking profile </li></ul>')
})

app.post('/messages' , (req , res) => {
    console.log('updating messages ...')
})

app.listen(PORT , () => {
    console.log(`Server is now listening on ${PORT}`)
})