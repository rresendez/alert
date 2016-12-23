var express = require('express');
var router = express.Router();
//Cron schedule
var cron = require('node-cron');
// Get json
var getJSON = require('get-json');

// Load the twilio module
var twilio = require('twilio');
var User = require('../app/model/user');



// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('ACa57bd2a6cc2a50aa56ed4b2bd1e0577b','4f5eb4902f73d4aceab63f61918a66d2');

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.

//Getting the bitcoin price


//This is where i get the json file from

var link="http://api.coindesk.com/v1/bpi/currentprice.json"
var datg,datx="";
var bool=false;
//One percent fluctuation function

function fluc (v1,v2){
  var onep = v1/100;
  var point = onep/2;
  if(v2>v1+point||v2<v1-point){
    return true;
  }
  else{
    return false;
  }
}

//Get original value for bitcoin as datg
    getJSON(link, function (error,data) {
      if(error){
        console.log(error);
      }
      var datc,datf;
      datc = data.bpi;
      datf = datc.USD;
      datg = Number(datf.rate);
      datg=datg.toFixed(2);
      console.log(datg);
    })
    //Check for fluctuation
cron.schedule('*/10 * * * * *', function (){
// Get current value of bitcoin

  getJSON(link, function (error,data) {
    if(error){
      console.log(error);
    }
    var datc,datf;
    datc = data.bpi;
    datf = datc.USD;
    datx = Number(datf.rate);
    datx=datx.toFixed(2);

  })
  console.log("Fluc status: "+bool);
  console.log("Bitcoin AVG price $" + datg);
  console.log("Bitcoin current price $"+ datx);

  var t1,t2;
  t1=Math.floor(datg);
  t2=Math.floor(datx);
  console.log("Evaluating fluctuation .... ( "+t1,t2+" ) ....");
  //Test for fluctuation
  bool=fluc(t1,t2);
  console.log("Fluc status: " + bool);

  if(bool && datx>1){
    console.log("Condtitions meet preparing sms");
    User.find().cursor().on('data',function(doc){

      //Check for users
      console.log("Sending sms to: "+doc.name);


    client.sms.messages.create({
        to:doc.number,
        from:'9563771377',
        body:'Hey '+doc.name+' There was a 0.5% bitcoin fluctuation from: '+datg + ' to ' +datx,
    }, function(error, message) {
        // The HTTP request to Twilio will run asynchronously. This callback
        // function will be called when a response is received from Twilio
        // The "error" variable will contain error information, if any.
        // If the request was successful, this value will be "falsy"
        if (!error) {
            // The second argument to the callback will contain the information
            // sent back by Twilio for the request. In this case, it is the
            // information about the text messsage you just sent:
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
            //Update value of datg
            datg=datx;
        } else {
            console.log('Oops! There was an error.');
            console.log(error);
        }
    });
  });

  }
  else{
    console.log("No fluctuation");
    console.log("");
    console.log("/*******************NEW ITERATION**********************/")
    console.log("");

  }


})







/* GET home page. */



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
