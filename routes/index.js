var express = require('express');
var router = express.Router();
//Cron schedule
var cron = require('node-cron');
// Get json
var getJSON = require('get-json');

// Load the twilio module
var twilio = require('twilio');
var User = require('../app/model/user');
var Log = require('../app/model/log');
var Ath = require('../app/model/ath');



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
  if(v2>v1+onep||v2<v1-onep){
    return true;
  }
  else{
    return false;
  }
}
// Money formatting function
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//Get original value for bitcoin as datg
    getJSON(link, function (error,data) {
      if(error){
        console.log(error);
      }
      if(!data){
        console.log(error);
      }
      var datc,datf;
      datc = data.bpi;
      datf = datc.USD;
      datg = datf.rate;
      datg= datg.split(',').join('');
      //datg=datg.toFixed(2);
      console.log(datg);
    })
    //Check for fluctuation
cron.schedule('*/10 * * * * *', function (){
  //Create time stamp
  var d = new Date;
// Get current value of bitcoin

  getJSON(link, function (error,data) {

    if(error||!data||!data.bpi){
      console.log(error);
      console.log("Attempting to recover....");
      console.log("");
    }else{
    var datc,datf;
    datc = data.bpi;
    datf = datc.USD;
    datx =datf.rate;
    datx= datx.split(',').join('');
    //datx=datx.toFixed(2);
  }

  })
  //Formating number with comas
  var avg, curr;
  avg= datg;
  curr = datx;
  //Print 2 console
    //Get all time high

    Ath.findOne({code:1}, function(err, value){

      console.log("ATH: " + value.value+ " Date: " +value.time);

  console.log("Time stamp: "+d.toString());
  console.log("Fluc status: "+bool);
  console.log("Bitcoin AVG price: $" + avg);
  console.log("Bitcoin current price: $"+ curr);

  var t1,t2;
  t1=Math.floor(datg);
  t2=Math.floor(datx);
  console.log("Evaluating fluctuation .... ( "+t1,t2+" ) ....");
  //Test for fluctuation
  bool=fluc(t1,t2);
  console.log("Fluc status: " + bool);


//Declare test
  var test ="";
  //Test ATH

  if(datx>value.value&&bool){
    athOld=Math.floor(value.value);
    athNew=Math.floor(datx);
    test="ATH "+athOld+ " BROKE by "+ athNew;
    //Add all time high
    var newAth = Ath({
      time: d.toString(),
      value: datx,
      code: 1
    });


    Ath.findById("58b34c51c83844ac8f7db8dc",function(err,todo){
      //Handle error
      if(err) throw err;
      //Update each attribute
      else{
        todo.value= datx;
        todo.time= d.toString();
        todo.code= 1;
        //Save updated document
        todo.save(function(err,todo){
          if(err) throw err;
          console.log("New ATH updated in Mongodb , new value: "+ todo.value);
        });
      }
    });

    console.log("New Ath generated: "+datx);

      console.log(test);



   }


  if(bool&&datx>0){


    //ATH test




    console.log("Condtitions meet preparing sms");
    console.log("Time stamp: "+d.toString());
    //Add log to DB

      var newLog = Log({
        time: d.toString(),
        avg: avg,
        curr: curr
      });
      console.log("New log generated"+newLog);
      newLog.save(function(err){
        if(err) throw err;
        console.log("Log added");


      });

    //Lokking for all numbers in the list
    User.find().cursor().on('data',function(doc){
      if(datx<1){
        test=" This is a test";
      }



      //Check for users
      console.log("Sending sms to: "+doc.name);
      if(doc.name=="Rigoberto"){
        doc.number="01152"+doc.number;
      }


    client.sms.messages.create({
        to:doc.number,
        from:'9563771377',
        body:'Hey '+doc.name+', there was a 1% bitcoin fluctuation from: $'+avg + ' to $' +curr+ test ,
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

  //Update value of datg
  datg=datx;
}
  else{
    console.log("No fluctuation");
    console.log("");
    console.log("/*******************NEW ITERATION**********************/")
    console.log("");

  }
  });


})







/* GET home page. */



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
