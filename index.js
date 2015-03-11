
var express = require('express');
var pg = require('pg');
var pg_config = require('./config/pg.json');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

// var server = app.listen(3000, function () {
// });

pg.connect(pg_config, function(err, conn, done) {
  conn.query('SELECT u.id, u.username FROM users AS u;', function(err, result) {
    console.log(result.rows);
    done();
  });
});

pg.end();
