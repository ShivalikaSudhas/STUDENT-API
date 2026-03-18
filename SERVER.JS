
const http = require('http');
const url = require('url');

const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require('./controller.JS');

const server = http.createServer(async (req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    const parts = path.split('/');
    const id = parts[2];

    // ROUTES

    if (method === 'GET' && path === '/students') {
        return getStudents(req, res);
    }

    if (method === 'GET' && parts[1] === 'students' && id) {
        return getStudent(req, res, id);
    }
     
    if (method === 'PUT' && parts[1] === 'students' && id) {
    return updateStudent(req, res, id);
    }
    
    if (method === 'POST' && path === '/students') {
        return createStudent(req, res);
    }

    if (method === 'DELETE' && parts[1] === 'students' && id) {
        return deleteStudent(req, res, id);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        success: false,
        message: "Route not found"
    }));

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});