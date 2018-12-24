// This code is based on https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
//
// server.js

// BASE SETUP
// =============================================================================

// load the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();                 // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 5555);        // set our port

// MIDDLEWARE for accessing the server from other servers
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// set up the data to be used in the API:

const n5tag = "jlptn5";
const n4tag = "jlptn4";
const n3tag = "jlptn3";
const n2tag = "jlptn2";
const n1tag = "jlptn1";

const levelMap = {};

var JLPTN5 = path.join(__dirname, 'n5-vocab-kanji-hiragana.txt');
var JLPTN4 = path.join(__dirname, 'n4-vocab-kanji-hiragana.txt');
var JLPTN3 = path.join(__dirname, 'n3-vocab-kanji-hiragana.txt');
var JLPTN2 = path.join(__dirname, 'n2-vocab-kanji-hiragana.txt');
var JLPTN1 = path.join(__dirname, 'n1-vocab-kanji-hiragana.txt');

function insertData(file, levelTag) {
    var fileContents = fs.readFileSync(file, {encoding: "utf8"});
    fileContents.split("\n").forEach(row => {
        const word = row.split("\t");
        levelMap[word[0] + " " + word[1]] = levelTag;
        console.log(word[0] + " " + word[1] + " " + n5tag);
    });
}

insertData(JLPTN5, n5tag);
insertData(JLPTN4, n4tag);
insertData(JLPTN3, n3tag);
insertData(JLPTN2, n2tag);
insertData(JLPTN1, n1tag);

router.get('/:kanji/:kana1/:kana2/:kana3', function(req, res, next) {
    let level = levelMap[req.params.kanji + " " + req.params.kana1];
    if(level === undefined) {
        level = levelMap[req.params.kanji + " " + req.params.kana2];
    }
    if(level === undefined) {
        level = levelMap[req.params.kanji + " " + req.params.kana3];
    }
    res.send(level || "nojlpt");
});

router.get('/:kanji/:kana1/:kana2', function(req, res, next) {
    let level = levelMap[req.params.kanji + " " + req.params.kana1];
    if(level === undefined) {
        level = levelMap[req.params.kanji + " " + req.params.kana2];
    }
    res.send(level || "nojlpt");
});

router.get('/:kanji/:kana', function(req, res, next) {
    const level = levelMap[req.params.kanji + " " + req.params.kana];
    res.send(level || "nojlpt");
});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function () {
  console.log('Connect to the server via http://localhost:' + app.get('port'));
});