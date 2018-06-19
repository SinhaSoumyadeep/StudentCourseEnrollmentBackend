module.exports = function (app) {

  app.post('/api/course/:courseId/section', createSection);
  app.get('/api/course/:courseId/section', findSectionsForCourse);
  app.get('/api/section/:sectionId/enrollment', enrollStudentInSection);
  app.get('/api/student/section', findSectionsForStudent);
  app.get('/api/section/:sectionId/findenrollment', findEnrollmentForSection);
  app.put('/api/updatesection', updateSection);
  app.delete('/api/delete/:sectionId', deleteSection);
  app.get('/api/section/:sectionId/unenrollment', unenrollStudentInSection);

  var userModel = require('../models/user/user.model.server');
  var sectionModel = require('../models/section/section.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

    function deleteSection(req, res) {
        var sectionId = req.params.sectionId;
        console.log(sectionId)
        sectionModel.deleteSection(sectionId)
        res.send(sectionId)
    }

    function updateSection(req, res) {

        var section = req.body;
        console.log(section)
        sectionModel.updateSection(section)
        res.send(section);
    }

  function findSectionsForStudent(req, res) {
    var currentUser = req.session.currentUser;
    if(currentUser != undefined){
        var studentId = currentUser._id;
        enrollmentModel
            .findSectionsForStudent(studentId)
            .then(function(enrollments) {
                res.json(enrollments);
            });
    }

  }


    function findEnrollmentForSection(req, res) {

        console.log("inside ********** enrollment for a section")
        var sectionId = req.params.sectionId;
        enrollmentModel
            .findEnrollmentForSection(sectionId)
            .then(function(enrollments) {
                res.json(enrollments);
            });
    }



  function enrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    var enrollment = {
      student: studentId,
      section: sectionId,
        grade: "78"
    };

    sectionModel
      .decrementSectionSeats(sectionId).then(
        function () {
            return userModel.addSectionForStudent(sectionId, studentId)

        }

    ).then(
          function () {
              return sectionModel.addStudentInSection(sectionId, studentId)

          }

    ).then(function () {
        return enrollmentModel
          .enrollStudentInSection(enrollment)
      })
      .then(function (enrollment) {
        res.json(enrollment);
      })
  }

    function unenrollStudentInSection(req, res) {
        var sectionId = req.params.sectionId;
        var currentUser = req.session.currentUser;
        var studentId = currentUser._id;

        console.log("inside unenroll service....")
        sectionModel
            .incrementSectionSeats(sectionId).then(
            function () {
                return userModel.deleteSectionForStudent(sectionId, studentId)

            }

        ).then(
            function () {
                return sectionModel.deleteStudentInSection(sectionId, studentId)

            }

        ).then(

            enrollmentModel
                .findSectionsForStudent(studentId).then(function(enrollments) {


                    enrollments.map((enrollment) => {

                        if(enrollment.section != null)
                        {
                            console.log(enrollment.section)
                            if(enrollment.section._id == sectionId)
                            {
                                console.log(enrollment._id)
                                enrollmentModel.deleteEnrollment(enrollment._id);
                            }
                        }


                })

            })

        ).then(()=>{res.send("unenrolled");}

        )
    }

  function findSectionsForCourse(req, res) {
    var courseId = req.params['courseId'];
    sectionModel
      .findSectionsForCourse(courseId)
      .then(function (sections) {
        res.json(sections);
      })
  }

  function createSection(req, res) {
    var section = req.body;
    sectionModel
      .createSection(section)
      .then(function (section) {
        res.json(section);
      })
  }
};