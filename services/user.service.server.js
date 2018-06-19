module.exports = function (app) {

  app.post('/api/login', login);
  app.get('/api/user', findAllUsers);
  app.get('/api/user/:userId', findUserById);
  app.post('/api/user', createUser);
  app.get('/api/profile', profile);
  app.post('/api/logout', logout);
  app.put('/api/updateuser', updateUser);

  var userModel = require('../models/user/user.model.server');


  function updateUser(req, res) {

      var user = req.body;
      console.log(user)
      userModel.updateUser(user)
      res.send(user);
  }

  function login(req, res) {
      var credentials = req.body;
      console.log(credentials)
      userModel
          .findUserByCredentials(credentials)
          .then(function(user) {
              req.session['currentUser'] = user;
              res.json(user);
              res.send(user);
          })
  }

  function logout(req, res) {
    req.session.destroy();
    res.send(200);
  }

  function findUserById(req, res) {
    var id = req.params['userId'];
    userModel.findUserById(id)
      .then(function (user) {
        res.json(user);
      })
  }

  function profile(req, res) {
    var user = req.session['currentUser'];
    console.log(user)
      if(user != undefined){
          userModel.findUserById(user._id)
              .then(function (user) {
                  res.json(user);
              })
      }

  }

  function createUser(req, res) {
    var user = req.body;
    userModel.createUser(user)
      .then(function (user) {
        req.session['currentUser'] = user;
        res.send(user);
      })
  }

  function findAllUsers(req, res) {
    userModel.findAllUsers()
      .then(function (users) {
        res.send(users);
      })
  }
}
