const http = require('http');

const PORT = 3000;

const server = http.createServer((req , res) => {
    res.writeHead(200 , {
        'Content-Type' : 'application/json'
    });

    res.end(JSON.stringify({
        id: 1,
        message: 'Hello world'
    }))

})

server.listen(PORT , () => {
    console.log(`listening on port ${PORT} ...`)
})