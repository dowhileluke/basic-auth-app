var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var db = require('../db-pg');

// configure authentication
passport.use(new BasicStrategy(db.getAuthenticatedUser));
var doBasicAuth = passport.authenticate('basic', {session: false});

// configure routes
var api = module.exports = express.Router();
var account = express.Router();

(function registerAccountRoutes() {
  account.post('/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    db.loginUser(username, password, function (err, user) {
      if (err) {
        console.error(err);
        res.json({error: 'Database error!'});
      } else if (user) {
        res.json(user);
      } else {
        res.json({message: 'Invalid username or password.'});
      };
    });
  });

  account.post('/register', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    db.createUser(username, password, function (err, user) {
      if (err) {
        console.error(err);
        res.json({error: 'Database error!'});
      } else if (user) {
        res.json(user);
      } else {
        res.json({message: 'Could not create user.'});
      };
    });
  });

  account.get('/exists/:username', function (req, res) {
    var username = req.params.username;

    db.userExists(username, function (err, exists) {
      if (err) {
        console.error(err);
        res.json({error: 'Database error!'});
      } else {
        res.json({
          username: username,
          exists: exists
        });
      };
    });
  });
})();

api.use(bodyParser.json());
api.use('/account', account);
api.use(passport.initialize(), doBasicAuth);

(function registerMiscellaneousRoutes () {
  api.use(function (req, res) {
    res.json({
      message: 'API endpoint!',
      username: req.user.username 
    });
  });
})();
