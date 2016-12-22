var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

  name: String,
  number:{type: Number, required:true, unique: true}
});
var User = mongoose.model('User', userSchema);
module.exports = User;
