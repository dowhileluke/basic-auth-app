var pg = require('pg');
var crypto = require('crypto');
var config = require('../../config/pg.json');

var fn = module.exports = {};
var db = new pg.Client(config);

db.connect();

(function registerAccountMethods() {
  // do not alter this function once users have been created
  function generateHash(password, salt) {
    var hash = crypto.createHash('sha256');

    hash.end(password + salt);

    return hash.read().toString('hex');
  };

  fn.getAuthenticatedUser = function (username, hash, cb) {
    db.query({
      name: 'getAuthenticatedUser',
      text: 'SELECT u.id FROM users AS u WHERE u.username = $1 AND u.password = $2;',
      values: [username, hash]
    }, function (err, result) {
      if (err) {
        return cb(err);
      } else if (result.rowCount) {
        var auth = Buffer(username + ':' + hash).toString('base64');

        return cb(null, {
          id: result.rows[0].id,
          username: username,
          auth: auth
        });
      } else {
        return cb(null, false);
      };
    });
  };

  function getSalt(username, cb) {
    db.query({
      name: 'getSalt',
      text: 'SELECT u.salt FROM users AS u WHERE u.username = $1;',
      values: [username]
    }, function (err, result) {
      if (err) {
        cb(err);
      } else if (result.rowCount) {
        cb(null, result.rows[0].salt);
      } else {
        cb(null, false);
      };
    });
  };

  fn.loginUser = function (username, password, cb) {
    getSalt(username, function (err, salt) {
      if (err) {
        return cb(err);
      } else if (salt) {
        var hash = generateHash(password, salt);

        fn.getAuthenticatedUser(username, hash, function (err, user) {
          if (err) {
            return cb(err);
          } else {
            return cb(null, user);
          };
        });
      } else {
        return cb(null, false);
      };
    });
  };

  fn.userExists = function (username, cb) {
    db.query({
      name: 'userExists',
      text: 'SELECT COUNT(*) FROM users AS u WHERE u.username = $1;',
      values: [username]
    }, function (err, result) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, !!Number(result.rows[0].count));
        };
    });
  };

  fn.createUser = function (username, password, cb) {
    var salt = crypto.randomBytes(16).toString('hex');
    var hash = generateHash(password, salt);

    if (username && username.length && password && password.length) {
      fn.userExists(username, function (err, exists) {

        if (err) {
          return cb(err);
        } else if (exists) {
          return cb(null, false);
        } else {
          // user doesn't exist; safe to create
          db.query({
            name: 'createUser',
            text: 'INSERT INTO users (username, password, salt, joindate) VALUES ($1, $2, $3, $4);',
            values: [username, hash, salt, new Date()]
          }, function (err, result) {
            if (err) {
              return cb(err);
            } else {
              // user created; return user object
              fn.getAuthenticatedUser(username, hash, function (err, user) {
                if (err) {
                  return cb(err);
                } else {
                  return cb(null, user);
                };
              });
            };
          });
        };
      });
    } else {
      cb(null, false);
    };
  };
})();
