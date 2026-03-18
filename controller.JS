const students = require('./data');

// helper
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                reject("Invalid JSON");
            }
        });
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// -------- FUNCTIONS --------

// GET ALL
async function getStudents(req, res) {
    sendResponse(res, 200, { success: true, data: students });
}

// GET BY ID
async function getStudent(req, res, id) {
    const student = students.find(s => s.id === id);

    if (!student) {
        return sendResponse(res, 404, { success: false, message: "Not found" });
    }

    sendResponse(res, 200, { success: true, data: student });
}

// CREATE
async function createStudent(req, res) {

    try {
        const data = await parseBody(req);
        const { name, email, course, year } = data;

        if (!name || !email || !course || year === undefined) {
            return sendResponse(res, 400, { success: false, message: "All fields required" });
        }

        if (!isValidEmail(email)) {
            return sendResponse(res, 400, { success: false, message: "Invalid email" });
        }

        if (year < 1 || year > 4) {
            return sendResponse(res, 400, { success: false, message: "Invalid year" });
        }

        const student = {
            id: Date.now().toString(),
            name,
            email,
            course,
            year
        };

        students.push(student);

        sendResponse(res, 201, { success: true, data: student });

    } catch (err) {
        sendResponse(res, 400, { success: false, message: err });
    }
}

// DELETE
async function deleteStudent(req, res, id) {
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return sendResponse(res, 404, { success: false, message: "Not found" });
    }

    students.splice(index, 1);

    sendResponse(res, 200, { success: true, message: "Deleted" });
}
// UPDATE
async function updateStudent(req, res, id) {
    try {
        const index = students.findIndex(s => s.id === id);

        if (index === -1) {
            return sendResponse(res, 404, { success: false, message: "Not found" });
        }

        const data = await parseBody(req);
        const { name, email, course, year } = data;

        // validation
        if (!name || !email || !course || year === undefined) {
            return sendResponse(res, 400, { success: false, message: "All fields required" });
        }

        if (!isValidEmail(email)) {
            return sendResponse(res, 400, { success: false, message: "Invalid email" });
        }

        if (year < 1 || year > 4) {
            return sendResponse(res, 400, { success: false, message: "Invalid year" });
        }

        // update student
        students[index] = {
            id,
            name,
            email,
            course,
            year
        };

        sendResponse(res, 200, { success: true, data: students[index] });

    } catch (err) {
        sendResponse(res, 400, { success: false, message: err });
    }
}

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};