var express = require('express');
var router = express.Router();
//Cron schedule
var cron = require('node-cron');
// Get json
var getJSON = require('get-json');

// Load the twilio module
var twilio = require('twilio');

// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient('ACa57bd2a6cc2a50aa56ed4b2bd1e0577b','4f5eb4902f73d4aceab63f61918a66d2');

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.

//Getting the bitcoin price


//This is where i get the json file from

var link="http://api.coindesk.com/v1/bpi/currentprice.json"
var datg="";

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







/* GET home page. */
cron.schedule('*/10 * * * * *', function(){
  console.log("This is test for cron");

  client.sms.messages.create({
      to:'9562223307',
      from:'9563771377',
      body:'Current price of bitcoin '+datg
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
      } else {
          console.log('Oops! There was an error.');
          console.log(error);
      }
  });

})
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
