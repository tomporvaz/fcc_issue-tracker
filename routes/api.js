/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
//from quick start guide in mongoose docs
let db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once('open', function (){
  console.log("DB sucess using mongoose!")
});
module.exports = function (app) {

/*   MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if(err){console.error(`DB failed because.... ${err}`)}
    else {console.log(`DB sucess!!!!!`)};
  }); */

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};
