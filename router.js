var express = require("express");
var router = express.Router();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var allUser = [];



module.exports = router;