// HanboZhang
// 138092234

const fs = require('fs');
const path = require('path');

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../data/students.json'), 'utf8', (err, studentData) => {
            if (err) {
                reject("unable to read students.json");
                return;
            }
            
            let students = JSON.parse(studentData);
            
            fs.readFile(path.join(__dirname, '../data/courses.json'), 'utf8', (err, courseData) => {
                if (err) {
                    reject("unable to read courses.json");
                    return;
                }
                
                let courses = JSON.parse(courseData);
                
                dataCollection = new Data(students, courses);
                
                resolve();
            });
        });
    });
}


function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("no results returned");
        }
    });
}



function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("no results returned");
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        let filteredStudentsbycourse = dataCollection.students.filter(student => student.course === Number(course));
        if (filteredStudentsbycourse.length > 0) {
            resolve(filteredStudentsbycourse);
        } else {
            reject("no results returned");
        }
    });
}

function getCourseById(id) {
    return new Promise((resolve, reject) => {
        const course = dataCollection.courses.find((c) => c.courseId === Number(id));
        if (course) {
            resolve(course);
        } else {
            reject("Course not found."); 
        }
    });
}

function getStudentsByNum(num) {
    return new Promise((resolve, reject) => {       
        let filteredStudentsbyNum = dataCollection.students.find(student => student.studentNum === Number(num));
        if (filteredStudentsbyNum) {
            resolve(filteredStudentsbyNum);
        } else {
            reject("no results returned");
        }
    });
}

function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        try {
            
            studentData.TA = studentData.TA === undefined ? false : true;

            studentData.studentNum = dataCollection.students.length + 1; 
          
            dataCollection.students.push(studentData);

            resolve();
        } catch (error) {
            reject(error); 
        }
    });
}

function updateStudent(studentData) {
    return new Promise((resolve, reject) => {
        console.log("Received studentData for update:", studentData);

        let studentIndex = dataCollection.students.findIndex(
            (s) => s.studentNum == studentData.studentNum
        );

        if (studentIndex === -1) {
            console.error("Student not found with studentNum:", studentData.studentNum);
            reject("Student not found");
        } else {
            try {
                studentData.studentNum = Number(studentData.studentNum);

                studentData.TA = studentData.TA === "on";

                console.log("Before Update:", dataCollection.students[studentIndex]);

                dataCollection.students[studentIndex] = {
                    ...dataCollection.students[studentIndex], 
                    ...studentData, 
                };

                console.log("After Update:", dataCollection.students[studentIndex]);

                resolve();
            } catch (error) {
                console.error("Error during student update:", error);
                reject(error);
            }
        }
    });
}

module.exports = {
    initialize, 
    getAllStudents, 
    getCourses, 
    getStudentsByCourse, 
    getStudentsByNum,
    addStudent,
    getCourseById,
    updateStudent,
};
