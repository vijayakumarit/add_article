let mongoose = require('mongoose');

// Article Schema 
let employeeSchema = mongoose.Schema({
  name:{
    type: String, 
    maxlength: 20,
   
    required: true
  },
  designation:{
    type: String,
    required: true
  },
  salary:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  lastmodifiedtime:{
    type: String,
  }
});

let Employee = module.exports = mongoose.model('Employee', employeeSchema);


