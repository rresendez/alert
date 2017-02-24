var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var athSchema = new Schema({

  code: Number,
  value: Number,
  time: String,
});
var ath = mongoose.model('ath', athSchema);
module.exports = ath;
