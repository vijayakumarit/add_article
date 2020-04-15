const express = require('express'); 
var dateFormat = require('dateformat');
const router = express.Router();

// employee Model
let Employee = require('../models/employee');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    name:'Add Employee'
  });
});

// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('name','Name is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();

  req.checkBody('designation','Designation is required').notEmpty();

  req.checkBody('salary','Salary is required').notEmpty();
  

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_article', {
      name:'Add Employee',
      errors:errors
    });
  } else {

    let employee = new Employee();
    employee.name = req.body.name;
    employee.author = req.user._id;
    employee.designation = req.body.designation;
    employee.salary = req.body.salary;
    
    var now = new Date();
    employee.lastmodifiedtime = dateFormat(now, "yyyy-mm-dd h:MM:ss");

    employee.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Employee Added');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Employee.findById(req.params.id, function(err, employee){
    if(employee.author != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_article', {
      title:'Edit Employee',
      employee:employee
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let employee = {};
  employee.name = req.body.name;
  employee.designation = req.body.designation;
  employee.salary = req.body.salary;
  var now = new Date();
  employee.lastmodifiedtime = dateFormat(now, "yyyy-mm-dd h:MM:ss");

  let query = {_id:req.params.id}

  Employee.update(query, employee, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Employee Updated');
      res.redirect('/');
    }
  });
});

// Delete Employee
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Employee.findById(req.params.id, function(err, employee){
    if(employee.author != req.user._id){
      res.status(500).send();
    } else {
      Employee.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// Get Single Employee
router.get('/:id', function(req, res){
  Employee.findById(req.params.id, function(err, employee){
    User.findById(employee.author, function(err, user){
      res.render('article', {
        employee:employee,
        author: user.name


      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
