var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserByCredentials(credentials) {
  return userModel.findOne(credentials, {username: 1});
}

function findUserById(userId) {
  return userModel.findById(userId);
}

function createUser(user) {
  return userModel.create(user);
}

function findAllUsers() {
  return userModel.find();
}

function addSectionForStudent(sectionId,studentId) {

    return userModel.update(
        {
            _id: studentId
        },
        {
            $push: {sections: sectionId}
        }


    );

}

function deleteSectionForStudent(sectionId,studentId) {

    console.log("inside the delete section for a student"+ sectionId+" "+studentId)
    userModel.findByIdAndUpdate(studentId,
        {$pull: {sections: sectionId}},
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


function updateUser(user) {

        console.log(user)
    userModel.findByIdAndUpdate(user._id,
        {
            $set: {firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone, address: user.address}
        },
        {
            new: true
        },
        function (err,updatedUser) {
            if(err)
            {

            }
            else
            {

            }
        }


    );

}
var api = {
  createUser: createUser,
  findAllUsers: findAllUsers,
  findUserById: findUserById,
  findUserByCredentials: findUserByCredentials,
    addSectionForStudent: addSectionForStudent,
    updateUser: updateUser,
    deleteSectionForStudent: deleteSectionForStudent
};

module.exports = api;