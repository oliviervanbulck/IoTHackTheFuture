/**
 * Created by olivier on 8/12/16.
 */
var NaturalLanguageClassifierV1 = require('watson-developer-cloud/natural-language-classifier/v1');
var Client = require('ibmiotf');
var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser')
var app = express();
var fs = require('fs');

app.use(bodyParser.json());
app.use(fileUpload());

var appClientConfig = {
    "org" : "5q3wxj",
    "id" : "e3dd3522-e94e-4e49-9d44-a8391f6fe2cb",
    "domain": "internetofthings.ibmcloud.com",
    "auth-key" : "a-5q3wxj-ug8zacltpu",
    "auth-token" : "jBbao6tI?L*vp23XAH"
};

var appClient = new Client.IotfApplication(appClientConfig);

appClient.connect();

appClient.on("connect", function () {

//Add your code here
    console.log("Connection succeeded!");
    var myData={'direction' : 'right'};
    myData = JSON.stringify(myData);
    appClient.publishDeviceCommand("craftworkz-platform","craftworkz123", "command", "json", myData);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/api/command', function (req, res) {
    //console.log(req.body);
    var myData={'direction' : req.body.command};
    myData = JSON.stringify(myData);
    appClient.publishDeviceCommand("craftworkz-platform","craftworkz123", "command", "json", myData);
    res.sendStatus(200);
});

app.post('/api/tts', function(req, res) {
    //console.log(req.body, req.files);
    var file;

    if(!req.files)
    {
        res.send("File was not found");
        return;
    }

    file = req.files.sound;  // here is the field name of the form
    //console.log(req.files);

    file.mv("./uploads/file.wav", function(err)  //Obvious Move function
    {
        // log your error
    });

    var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
    var fs = require('fs');

    var speech_to_text = new SpeechToTextV1({
        username: 'a19c0feb-6802-4c57-bd2d-c5621e9f020a',
        password: 'kSJ53LzoItHi'
    });

    var params = {
        // From file
        audio: fs.createReadStream('./uploads/file.wav'),
        content_type: 'audio/wav; rate=44100'
    };

    speech_to_text.recognize(params, function(err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else
            res.send(result.results[0].alternatives[0].transcript);
            //console.log(JSON.stringify(res, null, 2));
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

/*var config = {
    "org" : "5q3wxj",
    "id" : "e3dd3522-e94e-4e49-9d44-a8391f6fe2cb",
    "domain": "internetofthings.ibmcloud.com",
    "auth-token" : "(TnBVvxa?!rD5E)-4z",
    "auth-key" : "a-5q3wxj-wlwf5ibu38"//,
    /*"type": "craftworkz-platform",
    "auth-method" : "token",
    "deviceId": "craftworkz123"
};

var deviceClient = new Client.IotfDevice(config);

deviceClient.connect();

deviceClient.on('connect', function () {
    console.log('YES!');
});

deviceClient.on("error", function (err) {
    console.log("Error : "+err);
});*/

