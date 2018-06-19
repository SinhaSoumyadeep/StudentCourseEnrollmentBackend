var mongoose = require('mongoose');
var sectionSchema = require('./section.schema.server');
var sectionModel = mongoose.model('SectionModel', sectionSchema);

function deleteSection(sectionId) {
    console.log(sectionId)
    sectionModel.findByIdAndRemove(sectionId,function (err,deleteSection) {
        if(err)
        {

        }
        else
        {

        }
    });
}


function updateSection(section) {

    console.log(section)
    sectionModel.findByIdAndUpdate(section._id,
        {
            $set: {name: section.name, seats: section.seats}
        },
        {
            new: true
        },
        function (err,updatedSection) {
            if(err)
            {

            }
            else
            {

            }
        }


    );

}

function createSection(section) {
  return sectionModel.create(section);
}

function findSectionsForCourse(courseId) {
  return sectionModel.find({courseId: courseId});
}

function decrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: -1}
  });
}


function addStudentInSection(sectionId,studentId) {

  return sectionModel.update(
      {
          _id: sectionId
      },
      {
        $push: {students: studentId}
      }


  );

}

function deleteStudentInSection(sectionId,studentId) {

    sectionModel.findByIdAndUpdate(sectionId,
        {$pull: {students: studentId}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                console.log(err);
            }else{
                //do stuff
            }
        }
    );

}


function incrementSectionSeats(sectionId) {
  return sectionModel.update({
    _id: sectionId
  }, {
    $inc: {seats: +1}
  });
}

module.exports = {
  createSection: createSection,
  findSectionsForCourse: findSectionsForCourse,
  decrementSectionSeats: decrementSectionSeats,
  incrementSectionSeats: incrementSectionSeats,
    addStudentInSection: addStudentInSection,
    updateSection: updateSection,
    deleteSection: deleteSection,
    deleteStudentInSection: deleteStudentInSection
};