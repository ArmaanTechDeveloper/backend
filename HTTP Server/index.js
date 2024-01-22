const http = require('http');

const PORT = 3000;

const server = http.createServer((req , res) => {

    if(req.url === '/hello'){
        res.writeHead(200 , {
            'Content-Type' : 'application/json'
        });
    
        res.end(JSON.stringify({
            id: 1,
            message: 'Hello world'
        }))
    }
    else if (req.url === '/messages') {
        res.statusCode = 200; // optional to add it will be automatically 200 if nothing is supplied
        res.setHeader('Content-Type' , 'text/html');
        res.write('<html>')
        res.write('<body>')
        res.write('<ul>')
        res.write('<li> Hello this is a html file')
        res.write('<li> This is another mesage from html file')
        res.write('</ul>')
        res.write('</body>')
        res.write('</html>')
        res.end()
    }
    else{
        res.statusCode = 404;
        res.end();
    }

})

server.listen(PORT , () => {
    console.log(`listening on port ${PORT} ...`)
})