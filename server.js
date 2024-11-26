/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hanbo Zhang Student ID: 138092234 Date: 11/21/2024
*
********************************************************************************/

// server.js

var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");

var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
var HTTP_PORT = process.env.PORT || 8082;

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute =
        "/" +
        (isNaN(route.split("/")[1])
            ? route.replace(/\/(?!.*)/, "")
            : route.replace(/\/(.*)/, ""));
    next();
});

app.locals.navLink = function (url, options) {
    return (
        '<li' +
        (url == app.locals.activeRoute ? ' class="nav-item active" ' : ' class="nav-item" ') +
        '><a class="nav-link" href="' +
        url +
        '">' +
        options.fn(this) +
        "</a></li>"
    );
};

app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("EJS Helper 'equal' needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
};

collegeData.initialize()
    .then(() => {
        //server start
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize data:", err);
    });

app.get("/students", (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(course)
            .then(students => res.render("layouts/main", { body: "../students", students }))
            .catch(() => res.render("layouts/main", { body: "students", message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(students => res.render("layouts/main", { body: "../students", students }))
            .catch(() => res.render("layouts/main", { body: "students", message: "no results" }));
    }
});


app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.render("layouts/main", { body: "../courses", courses }))
        .catch(() => res.render("layouts/main", { body: "../courses", courses: [], message: "No courses available." }));
});



app.get("/student/:num", (req, res) => {
    collegeData.getStudentsByNum(req.params.num)
        .then(student => res.render("layouts/main", { body: "../student", student }))
        .catch(() => res.render("layouts/main", { body: "../student", message: "Student not found" }));
});



app.get("/course/:id", (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then(course => res.render("layouts/main", { body: "../course", course }))
        .catch(() => res.render("layouts/main", { body: "../course", message: "Course not found" }));
});


app.get("/", (req, res) => {
    res.render("layouts/main", { body: "../home" }); 
});


app.get("/about", (req, res) => {
    res.render("layouts/main", { body: "../about" }); 
});

app.get("/htmlDemo", (req, res) => {
    res.render("layouts/main", { body: "../htmlDemo" }); 
});

app.get("/students/add", (req, res) => {
    res.render("layouts/main", { body: "../addStudent" }); 
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); 
        })
        .catch(err => {
            console.error("Error adding student:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body) 
        .then(() => {
            console.log("Student updated successfully.");
            res.redirect("/students"); 
        })
        .catch((err) => {
            console.error("Error updating student:", err);
            res.status(500).send("Internal Server Error"); 
        });
});


app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found</h1><a href='/'>Go to Home</a>");
});

