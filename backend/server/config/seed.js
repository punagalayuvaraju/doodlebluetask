/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Task = require('../api/task/task.model');

var User = require('../api/user/user.model');

// Insert seed data below
var taskSeed = require('../api/task/task.seed.json');


// Thing.find({}).remove(function() {
//   Thing.create(thingSeed);
// });