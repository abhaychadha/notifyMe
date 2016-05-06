var express = require('express');
var gcm = require('node-gcm');
var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(3000, function(){

 console.log('server is running');

});

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var device_token;

app.post('/registerDevice', function(req, res){
    console.log(JSON.stringify(req.body, null, 2));
    device_token = JSON.stringify(req.body.device_token);
    //device_token = 'APA91bEUsXQqo2SMAONY48bue_2_PxRZqWkRR0RxGFDIfIYlnZTXuJgflDTEMdiHJzptHYjAxMxfGFCVnqI3HqSdBaRO13J76uGvqQy3bKuH-i_-bDjwh7TedlTr-rc_4tEawE0MENxWYpQ5Y99g3QOi2JpG_iBpNg';
    console.log(device_token)
    console.log('device token received');
    
    /*YOUR TODO: save the device_token into your database*/
    res.send('ok');
});

app.get('/push', function(req, res){

    var device_tokens = []; //create array for storing device tokens
    var retry_times = 4; //the number of times to retry sending the message if it fails

    var sender = new gcm.Sender('AIzaSyAGa1fMRWswzBhvqm3DwbiBpNPAE8qXbHU'); //create a new sender
    var message = new gcm.Message(); //create a new message

    message.addData('title', 'Notification');
    message.addData('message', 'Hello this is a push notification');
    message.addData('sound', 'notification');
    message.addData('appId', 'pm');
    message.addData('notificationEventType', 'Product_Update');
    message.addData('notificationCategory', 'ALERT');
    

    message.collapseKey = 'NotifyMe'; //grouping messages
    message.delayWhileIdle = true; //delay sending while receiving device is offline
    message.timeToLive = 10; //the number of seconds to keep the message on the server if the device is offline

    /*
    YOUR TODO: add code for fetching device_token from the database
    */    
    device_tokens.push('APA91bFnd79EU0f6gkWTB1_GYO3FGfHwljDMnKwAwRbobmE1sUp5mgavodlWlVbF3wGJyEWkhpVTBu6CbVF_6vIZiFcFfffjmzo276GpYCOUQMDGYD1OAbv1lRavuuY3x41VPVRaXYxQ2q_pH8QK6ue5GjrODn5cng');

    sender.send(message, device_tokens, retry_times, function(result,error){
        
        console.log('result:'+JSON.stringify(result, null, 2));
        console.log('error:'+JSON.stringify(error, null, 2));
        console.log('push sent to: ' + device_token);
    });

    res.send('ok');
});

app.post('/notifyme/user/register', function(req, res){    
   device_token = req.body.device_token;
    console.log(JSON.stringify(req.body, null, 2));
    console.log("register");
    var response = {    
        success: true,
        tokenId: '1223'    
    }
    
    /*YOUR TODO: save the device_token into your database*/
    res.send(response);
});

app.post('/notifyme/user/signin', function(req, res){
    console.log(JSON.stringify(req.body, null, 2));
    device_token = req.body.device_token;
    console.log("signing in");
    console.log(req.body);
    var response = {    
        success: true,
        authenticated: true,
        tokenId: '1223'    
    }
    
    /*YOUR TODO: save the device_token into your database*/
    res.send(response);
});

app.post('/notifyme/user/update', function(req, res){
    console.log(JSON.stringify(req.body, null, 2));
    device_token = req.body.device_token;
    console.log("update");
    console.log(req.body);    
    var response = {    
        success: true,
        tokenId: '1223'    
    }
    
    /*YOUR TODO: save the device_token into your database*/
    res.send(response);
});