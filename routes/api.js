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
mongoose.set('useFindAndModify', false);

module.exports = function (app) {
  const Schema = mongoose.Schema;
  mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
  //from quick start guide in mongoose docs
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error'));
  db.once('open', function (){
    console.log("DB sucess using mongoose!")
  });
  
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
    
    //Create filterObj from project name and url query properties if they exist.
    const filterObj = {
      projectname: project
    }
    
    if(req.query._id){filterObj._id = req.query._id};
    if(req.query.issue_title){filterObj.issue_title = req.query.issue_title};
    if(req.query.issue_text){filterObj.issue_text = req.query.issue_text};
    if(req.query.created_on){filterObj.created_on = req.query.created_on};
    if(req.query.updated_on){filterObj.updated_on = req.query.updated_on};
    if(req.query.created_by){filterObj.created_by = req.query.created_by};
    if(req.query.assigned_to){filterObj.assigned_to = req.query.assigned_to};
    if(req.query.status_text){filterObj.status_text = req.query.status_text};
    if(req.query.open){filterObj.open = req.query.open};
    
    //search DB for issues using the filter object built from the url query.
    Issue.find(filterObj, function(err, issues){
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

      //create update object to pass to findAndUpdate method, adding only properties present from client
      let updateObj ={
        updated_on: new Date()
      }

      if(req.body.issue_title){updateObj.issue_title = req.body.issue_title};
      if(req.body.issue_text){updateObj.issue_text = req.body.issue_text};
      if(req.body.created_on){updateObj.created_on = req.body.created_on};
      if(req.body.created_by){updateObj.created_by = req.body.created_by};
      if(req.body.assigned_to){updateObj.assigned_to = req.body.assigned_to};
      if(req.body.status_text){updateObj.status_text = req.body.status_text};
      if(req.body.open){updateObj.open = req.body.open};

      //short circuit response if no body sent
      if(Object.keys(updateObj).length < 2){
        res.send('no updated field sent');
      }
      
      //findOne and update
      Issue.findByIdAndUpdate(req.body._id, updateObj, function(err, doc){
        if(err){
          res.send(`could not update ${req.body._id}`);
        } else {
          res.send(`successfully updated`);
        }
      })
    })
    
    .delete(function (req, res){
      var project = req.params.project;

      console.log(`delete from ${project}`);
      console.log(req.body);

      //return if no id sent
      if(req.body._id === undefined){
        res.send('_id error')
      };

      //find and remove in order to delete issue
      Issue.findByIdAndRemove(req.body._id, function(err, doc){
        if(err){
          res.send(`could not delete ${req.body._id}`)
        } else {
          res.send(`deleted ${req.body._id}`);
        }
      })
      
    });
    
  };
  