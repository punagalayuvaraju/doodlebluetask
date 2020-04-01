'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  Tname: {type: String,index:{unique:true}},
  created_By: {type: Schema.Types.ObjectId,ref:'User'},
  status: {type: String,enum:['Pending','Completed','Expired'],default:'Pending'},
  expires_At:{type:Date}
},{timestamps:true});

module.exports = mongoose.model('Task', TaskSchema);