var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({

  time: String,
  avg: Number,
  curr: Number
});
var Log = mongoose.model('Log', logSchema);
module.exports = Log;
