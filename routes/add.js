var express = require('express');
var router = express.Router();
var User = require('../app/model/user');

router.get('/', function(req,res){
  res.render('add', {title:"Add user"});
});

router.post('/',function(req,res){
  var userName = req.body.username;
  var userNumber = req.body.number;
  var newUser = User({
    name: userName,
    number: userNumber
  });
  console.log(newUser);
  newUser.save(function(err){
    if(err) throw err;
    console.log("User added");
    res.redirect('/add');

  });

});
module.exports = router;
