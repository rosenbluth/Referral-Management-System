'use strict';

const express = require('express');
const app = express();
// require('dotenv').config()
const PORT = process.env.PORT || 3000;

const environment = process.env.NODE_ENV;
const cookieSession = require('cookie-session')

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

// Connection URL
var url = process.env.MONGODB_URI;
// var url = process.env.MONGOLAB_URI;
// var url = 'mongodb://admin:admin@ds111529.mlab.com:11529/heroku_4s7qc68b';

// var url = process.env.URL;
mongoose.connect(url);

mongoose.connection.once('open', () =>{
    console.log('working, yo');
})


//
// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');
//
// // Connection URL
// // var url = 'mongodb://localhost:27017/myproject';
//
// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");
//   db.close();
// });







// var MongoClient = mongodb.MongoClient,
//   assert = require('assert');
// // var url = 'mongodb://localhost:27017/sandboxreferrals';
// // var url = process.env.MONGOLAB_URI;
// MongoClient.connect(url, function (err, db) {
//  if (err) {
//    console.log('Unable to connect to the mongoDB server. Error:', err);
//  } else {
//    console.log('Connection established to', url);
//
//    // do some work here with the database.
//
//    //Close connection
//    db.close();
//  }
// });

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(cookieSession({
    secret: 'alfred',
}));
app.use(express.static(__dirname + '/public'));
const routes = require('./routes');
app.get('/', function(req, res) {
    res.render('./public/index');
});
app.use('/', routes);

app.listen(PORT, function() {
    console.log('Hello from port:', PORT);
});

module.exports = app;
