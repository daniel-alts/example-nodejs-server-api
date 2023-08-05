const http = require('http');

const port = 3001

const students = []; // students array

const handleResponse = (req, res) => ({ code = 200, error = null, data = null}) => { // modular way to handle response
    res.setHeader('content-type', 'application/json') // sets content type header
    res.writeHead(code) // sets http status code
    res.write(JSON.stringify({ data, error })) // sets data to be returned
    res.end() // ends the request cycle
}

const bodyParser = (req, res, callback) => { // parse body
    const body = []; // initialize empty array

    req.on('data', (chunk) => { // event listner checks if request has body
        body.push(chunk) // chunk is buffer and is added to the body array
    })

    req.on('end', () => { // event listner checks if request has ended
        if (body.length) { // checks if array items in it 
            const parsedBody = Buffer.concat(body).toString() // converts buffer to string
            req.body = JSON.parse(parsedBody); // converts string to JavaScript object
        }

        callback(req, res) // calls the callback function: handleRequest
    })
}

const handleRequest = (req, res) => { // handles all requests, routing and methods

    const response = handleResponse(req, res) // response handler

    if (req.url === '/v1/students' && req.method === 'POST') { // checks the url and method of the request

        students.push({ ...req.body, id: Math.floor(Math.random() * 500).toString()}) // adds student object from the body of request to the student array, id is to specify unique students

        return response({  data: students,  code: 201  }) // return response for the response handler
    }

    if (req.url === '/v1/students' && req.method === 'GET') { // checks the url and method of the request
        return response({ data: students, code: 200 }) // return response for the response handler
    }


    if (req.url.startsWith('/v1/students/') && req.method === 'GET') { // checks the url and method of the request
        const id = req.url.split('/')[3] // if req.url === /v1/students/123 this ensures id === 123

        const studentIndex = students.findIndex((student) => student.id === id) // find index of the student

        if (studentIndex === -1) { // checks if student is in the students array
            return response({ code: 404, error: 'Student not found' }) // return response when student is not found
        }

        const student = students[studentIndex] // point to the value of the student from the index

        return response({  data: student, code: 200 }) // return response

    }

    if (req.url.startsWith('/v1/students/') && req.method === 'PATCH') { // checks the url and method of the request
        const id = req.url.split('/')[3] // if req.url === /v1/students/123 this ensures id === 123

        const studentIndex = students.findIndex((student) => student.id === id) // find index of the student

        if (studentIndex === -1) { // checks if student is in the students array
            return response({ code: 404, error: 'Student not found' }) // return response when student is not found
        }


        const student = { ...students[studentIndex], ...req.body } // updates the student information

        return response({ data: student, code: 200 }) // return response

    }

    if (req.url.startsWith('/v1/students/') && req.method === 'DELETE') {  // checks the url and method of the request
        const id = req.url.split('/')[3] // if req.url === /v1/students/123 this ensures id === 123

        const studentIndex = students.findIndex((student) => student.id === id) // find index of the student

        if (studentIndex === -1) { // checks if student is in the students array
            return response({ code: 404, error: 'Student not found' }) // return response when student is not found
        }

        students.splice(studentIndex, 1) // deletes student from the students array

        return response({ data: students, code: 200 }) // return response
    }
}

const server = http.createServer((req, res) => bodyParser(req, res, handleRequest)) // create server, add body parser, add request handler

server.listen(port, () => {  // start server, listen for connections
    console.log(`Listening on port: ${port}`)
})
