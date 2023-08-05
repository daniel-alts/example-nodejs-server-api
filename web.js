const http = require('http');
const fs = require('fs');

const port = 3001 // port

const handleRequest = (req, res) => { // handles request
    if (req.url === '/') { // check url 
            const file = fs.readFileSync('./index.html')
            res.setHeader('content-type', 'text/html') // sets content type header
            res.writeHead(200) // sets http status code
            res.write(file) // sets data to be returned
            res.end() // ends the request cycle
    }

    if (req.url.endsWith('.html') && req.method === 'GET') { // checks the url and method of the request

        try {
            const splitUrl = req.url.split('/') // splits by '/'
            const filename = splitUrl[1] // gets file name eg: index.html
            const fileLocation = `./${filename}` // gets file location eg './index.html'
    
            const file = fs.readFileSync(fileLocation) // reads the file synchronously
            res.setHeader('content-type', 'text/html') // sets content type header
            res.writeHead(200) // sets http status code
            res.write(file) // sets data to be returned
            res.end()  // ends the request cycle
        } catch (error) {
            const file = fs.readFileSync('./404.html') // reads the 404 file
            res.setHeader('content-type', 'text/html') // sets content type header
            res.writeHead(500) // sets http status code
            res.write(file) // sets data to be returned
            res.end() // ends the request cycle
        }
    }
}

const server = http.createServer(handleRequest)  // create server, handle request


server.listen(port, () => { // start server, listen for connections
    console.log(`Listening on port: ${port}`)
})
