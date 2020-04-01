'use strict';

var Task = require('./task.model');
var config = require('../../config/environment');
var socketio=require('socket.io-client')(config.backendurl)

// Get list of tasks
exports.index = function(req, res) {

  var query1 = {$or:[{status: 'Completed'},{$and:[{status: 'Pending'},{expires_At :{ $gte : new Date()}}]}]};

  Task.find(query1,{status:true,Tname:true,createdAt:true}).populate('created_By',{_id:0,firstname:1})
  .exec(function (err, tasks) {
    if(err) { 
      return res.status(400).send({message: 'Something Went Wrong While Getting All Tasks'}) 
    } else{
      return res.status(200).json(tasks);
    }
  });
};



// get list of user task
exports.userTasks = function(req,res) {
 
  if (req.params.id === 'userslist') {
  var query = {$or:[{$and:[{status: 'Completed'},{created_By : req.user._id}]},{$and:[{status: 'Pending'},
  {created_By : req.user._id},{expires_At :{ $gte : new Date()}}]}]};} 
  
  else if (req.params.id === 'expirylist') {
  var query = {$and:[{status:'Pending'},{created_By : req.user._id},{expires_At :{ $lte : new Date()}}]}}

  Task.find(query,{status:true,Tname:true,createdAt:true}).populate('created_By',{_id:1,firstname:1}).exec(function(err, tasks) {
    if (err) {
      console.log(err);
      return res.status(400).send({message: 'Something Went Wrong While Getting All Tasks'}) 
    } else {
      return res.status(200).json(tasks);
    }
  })
}

// Creates a new task in the DB.
exports.create = function(req, res) {
req.body.created_By = req.user._id;
var newTask = new Task(req.body);
newTask.save(function(err,response) {
  if(err) {
    console.log(err);
    if (err && err.code === 11000) {
      res.status(200).json({message: 'Task Name is already in use !!!'})
     } else {
       res.status(400).send({message:'Something Went Wrong !!!'});
     }  
  } else {
    const obj = {
      username:req.user.username,
      firstname:req.user.firstname
    }
    socketio.emit('task:save', obj)
    res.status(201).send({success: 'Task Created Successfully !!!'});
  }
});};

// Updates an existing task in the DB.
exports.taskupdate = function(req, res) {
  Task.findByIdAndUpdate(req.body.taskid,req.body,function(err,response) {
    if (err) {
      res.status(400).send({message:'Something Went Wrong while Updating !!!'});
    }  else if (!response) { 
      return res.status(404).send({message:"Record not Found !!!"});
   } else {
      res.status(200).send({success: "Updated Successfully !!!"})
    }
  })
};

// Deletes a task from the DB.
exports.destroy = function(req, res) {
 Task.findByIdAndDelete(req.params.id,function(err,response) {
   if (err) {
     res.status(400).send({message:'Something Went Wrong while Deleting !!!'});
   }  else if (!response) { 
     return res.status(404).send({message:"Record not Found !!!"});
  } else {
     res.status(200).send({success: "Deleted Successfully !!!"})
   }
 })
};

function handleError(res, err) {
  return res.status(500).send(err);
}