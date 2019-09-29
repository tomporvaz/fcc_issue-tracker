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

module.exports = function (app) {
  const Schema = mongoose.Schema;
  mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
  //from quick start guide in mongoose docs
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error'));
  db.once('open', function (){
    console.log("DB sucess using mongoose!")
  });
  /*   MongoClient.connect(CONNECTION_STRING, function(err, db) {
    if(err){console.error(`DB failed because.... ${err}`)}
    else {console.log(`DB sucess!!!!!`)};
  }); */
  
  
  //issue schema and model
  const issueSchema = new Schema({
    projectname: {type: String, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date},
    created_by: {type: String, required: true},
    assigned_to: {type: String, required: false},
    status_text: {type: String, required: false},
    open: Boolean
  })
  
  const Issue = mongoose.model('Issue', issueSchema);
  
  app.route('/api/issues/:project')
  
  .get(function (req, res){
    var project = req.params.project;

    console.log(req.query);

    Issue.find(
      {projectname: project
        (req.query.issue_title ? ', issue_title: req.query.issue_title' : '')
        (req.query.created_by ? ', created_by: req.query.created_by' : '')
        }, function(err, issues){
      if(err){
        return(console.error(`Error in mongoose find query: ${err}`))
      } else {
        res.json(issues);
      }
    })
    
  })
  
  .post(function (req, res){
    var project = req.params.project;
    const now = new Date();
    const issue = new Issue({
      projectname: project,
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_on: now,
      updated_on: now,
      created_by: req.body.created_by,
      assigned_to: '',
      status_text: '',
      open: true
    })
    
    //handle optional input if they are not empty
    if(typeof req.body.assigned_to === 'string'){
      issue.assigned_to = req.body.assigned_to
    }
    
    if(typeof req.body.status_text === 'string'){
      issue.status_text = req.body.status_text
    }
    
    if (!req.body.issue_title
      || !req.body.issue_text
      || !req.body.created_by){
        console.log("Should return 'missing inputs'")
        return res.send('missing inputs').end();
      };
    
    issue.save(function(err, issueObj){
      if(err){
        console.error(`Error saving issue: ${err}`);
      } else {
        return res.json({
          _id: issueObj._id,
          issue_title: issueObj.issue_title,
          issue_text: issueObj.issue_text,
          created_on: issueObj.created_on,
          updated_on: issueObj.updated_on,
          created_by: issueObj.created_by,
          assigned_to: issueObj.assigned_to,
          status_text: issueObj.status_text,
          open: issueObj.open
        });
      }
    })
    
  })
  
  .put(function (req, res){
    var project = req.params.project;
    
  })
  
  .delete(function (req, res){
    var project = req.params.project;
    
  });
  
};
