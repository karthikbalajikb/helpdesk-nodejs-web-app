app = require('express.io')();
app.http().io();

app.listen(4545);

var express = require('express');
var mongoose = require('mongoose');
var db = mongoose.connection;
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var fs = require('fs'); 
var application_root = __dirname;
path = require( 'path' );
//require the Twilio module and create a REST client 
var accountSid = 'your-sid'; 
var authToken = 'your-token'; 
var client = require('twilio')(accountSid, authToken); 

 


console.log('Express server started on port 9999');

//Where to serve static content
    app.use( express.static( path.join( application_root, 'site') ) );
	
app.io.route('ready', function(req) {
    req.io.join(req.data.email);
	console.log('announce1');
    app.io.room(req.data.email).broadcast('announce1', {
        name: req.data.email,
		message: req.data.message
    })
	
	req.io.join('adminkb');
	console.log('announce2');
    req.io.room('adminkb').broadcast('announce2', {
        name: req.data.email ,
		message: req.data.message
    })
	 
 
client.messages.create({ 
	to: "", 
	from: "", 
	body: 'client enquiry name:'+req.data.email+ ' ..message:   '+req.data.message+'',   
}, function(err, message) { 
	console.log(message.sid); 
});

client.calls.create({ 
	to: "", 
	from: "", 
	url: "http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%3Ehello+karthik+balaji+alert+message+you+have+an+client+enquiry+please+check+your+dashboard%3C%2FSay%3E%3C%2FResponse%3E",  
	method: "GET",  
	fallbackMethod: "GET",  
	statusCallbackMethod: "GET",    
	record: "false" 
}, function(err, call) { 
	console.log(call.sid); 
});

})	

app.io.route('sendquery', function(req){
	req.io.join(req.data.name);
	app.io.room(req.data.name).broadcast('announce3', {
		message: req.data.query
    })
	
	 req.io.room('adminkb').broadcast('announce4', {
        name: req.data.name ,
		message: req.data.query
    })
});

app.io.route('replyQuery', function(req){
		req.io.join(req.data.name);
		app.io.room(req.data.name).broadcast('announce5', {
		name: req.data.name ,
		message: req.data.reply
    })
});

app.io.route('connectadmin', function(req) {
    req.io.join('adminkb');
	console.log('connectadmin');
	req.io.emit('yourconnected');
	});


	
