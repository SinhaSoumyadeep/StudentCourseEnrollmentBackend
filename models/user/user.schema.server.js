var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
    phone: Number,
    address: String,
  sections: [String]
}, {collection: 'user'});

module.exports = userSchema;