var path = require('path');
var express = require('express');
var config = require('../config/app.json');
var root = path.join(__dirname, '../', config.root);
var api = require('./api');
var app = express();

app.use('/api', api);
app.use('/static', express.static(root), function (req, res) {
  // if file doesn't exist
  res.status(404).end();
});
app.use(function (req, res) {
  res.sendFile(config.index, {root: root});
});

app.listen(config.port);
