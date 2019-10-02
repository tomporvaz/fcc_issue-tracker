/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const today = new Date();

chai.use(chaiHttp);

suite('Functional Tests', function() {
  let test_id = '';
  
  suite('POST /api/issues/{project} => object with issue data', function() {
    
    test('Every field filled in', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        test_id = res.body._id;

        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');

        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.body.issue_title, 'Title', "Title is not Title");
        assert.equal(res.body.issue_text, 'text', "text is not text");
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in', "created_by doesn't match");
        assert.equal(res.body.assigned_to, 'Chai and Mocha', "assigned_to doesn't match");
        assert.equal(res.body.status_text, 'In QA', "status_text doesn't match");
        /*
        Tests for created_on and updated_on using... 
        approximately +/- 2mins (120000ms), 
        or chai-datetime plugin
        */
        const created_on_date = new Date(res.body.created_on);
        assert.approximately(created_on_date.getTime(), today.getTime(), 120000, "created_on is not within 2mins of submission");
        const updated_on_date = new Date(res.body.updated_on); 
        assert.approximately(updated_on_date.getTime(), today.getTime(), 120000, "updated_on isn't within 2 mins of submission");
        
        assert.isTrue(res.body.open, "open is not true");
        assert.isOk(res.body._id, "doesn't have an _id");
        
        //fill me in too!
        
        done();
      });
    });
    
    test('Required fields filled in', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in'
      })
      .end(function(err, res){

        assert.property(res.body, '_id');
        assert.property(res.body, 'issue_title');
        assert.property(res.body, 'issue_text');
        assert.property(res.body, 'created_by');
        assert.property(res.body, 'assigned_to');
        assert.property(res.body, 'status_text');
        assert.property(res.body, 'created_on_date');
        assert.property(res.body, 'updated_on_date');
        assert.property(res.body, 'open');

        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.body.issue_title, 'Title', "Title is not Title");
        assert.equal(res.body.issue_text, 'text', "text is not text");
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in', "created_by doesn't match");
        assert.equal(res.body.assigned_to, '', "assigned_to doesn't match");
        assert.equal(res.body.status_text, '', "status_text doesn't match");
        
        /*Tests for created_on and updated_on */
        const created_on_date = new Date(res.body.created_on);
        assert.approximately(created_on_date.getTime(), today.getTime(), 120000, "created_on is not within 2mins of submission");
        const updated_on_date = new Date(res.body.updated_on); 
        assert.approximately(updated_on_date.getTime(), today.getTime(), 120000, "updated_on isn't within 2 mins of submission");
        
        assert.isTrue(res.body.open, "open is not true");
        assert.isOk(res.body._id, "doesn't have an _id");
        
        done();
      });
    });
    
    test('Missing required fields', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: '',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in'
      })
      .end(function(err, res){
        assert.isNotOk(res.body._id, "doesn't have an _id");
        
        done();
      });
      
    });
    
  });
  
  suite('PUT /api/issues/{project} => text', function() {
    
    //send a post and retain _id at test suite block level for use in PUT tests
    
    /*test('setup puts', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        putTestId = res.body._id;        
        done();
      });
    });
    */
    
    test('No body', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({
      })
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.text, 'no updated field sent');
        
        done();
      });
    });
    
    test('One field to update', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: test_id,
        assigned_to: 'Billy Bob'
      })
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.text, `successfully updated`);
        
        done();
      });
    });
    
    test('Multiple fields to update', function(done) {
      chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: test_id,
        assigned_to: 'Billy Bob',
        status_text: 'Mash fermenting'
      })
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.text, `successfully updated`);
        
        done();
      });
    });
    
  });
  
  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
    
    test('No filter', function(done) {
      chai.request(server)
      .get('/api/issues/test')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
    test('One filter', function(done) {
      chai.request(server)
      .get('/api/issues/test?issue_title=Title')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.equal(res.body[0].issue_title, 'Title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
      
    });
    
    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
      chai.request(server)
      .get('/api/issues/test?issue_title=Title&open=true')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.equal(res.body[0].issue_title, 'Title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.equal(res.body[0].open, true);
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
    
  });
  
  suite('DELETE /api/issues/{project} => text', function() {
    
    test('No _id', function(done) {
      chai.request(server)
      .delete('/api/issues/test')
      .send({
      })
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.text, '_id error');
        
        done();
      });
    });
    
    test('Valid _id', function(done) {
      chai.request(server)
      .delete('/api/issues/test')
      .send({
        _id: test_id
      })
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200, "response is not 200");
        assert.equal(res.text, `deleted ${test_id}`);
        
        done();
      });
    });
    
  });
  
});