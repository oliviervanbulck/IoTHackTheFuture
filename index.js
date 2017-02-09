/**
 * Created by olivier on 8/12/16.
 */
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
var https = require('https');
var Twitter = require('twitter');

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

var twitterClient = new Twitter({
    consumer_key: 'JoFKaSzZLt4yM5NUfrQO74QmP',
    consumer_secret: 'Eylhyf6Rcn69wiALTUOxr0QbZQs4CLmEUMdSDgwjDHXq2aUkiG',
    access_token_key: '63752476-JwOSitrf3kkAFkx0d9PeDKYgCTnlQEYVUwNHp8hNy',
    access_token_secret: 'nYHgXg1EyXVOuRnmH5J8PIdZZAd1uft05ovrCzq0sFVLL'
});

var visual_recognition = new VisualRecognitionV3({
    api_key: '243ed19843348fcdb81d320897e742f027887ab3',
    version_date: '2016-05-19'
});

var options = {
    hostname: 'hackthefuture-api.eu-gb.mybluemix.net',
    port: 443,
    path: '/api/Images/all',
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
};

https.get(options, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var response = JSON.parse(body);
        //console.log(response.images[0]);
        if(res.statusCode == 200) {
            for(var i in response.images) {
                //console.log(response.images[i]);
                var params = {
                    //images_file: fs.createReadStream('./resources/image1.jpg'),
                    url: response.images[i],
                    classifier_ids: ['alien_630240897'],
                    threshold: 0.2
                };

                visual_recognition.classify(params, function(err, res) {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        console.log(JSON.stringify(res, null, 2));
                        if(res.images[0].classifiers.length > 0) {
                            console.log('TWITTER!');
                            twitterClient.post('statuses/update', {status: '@craftworkz_co #RunYouCleverCode #htf2016 Run, you clever boy! ' + getDateTime()}, function (error, tweet, response) {
                                if (error) console.log(error);
                                console.log(tweet);  // Tweet body.
                                //console.log(response);  // Raw response object.
                            });
                        }
                    }
                });
            }
        }
        else {
            console.log('Error: Connection not succeeded.');
        }
    });
}).on('error', function(e){
    console.log("Got an error: ", e);
});

/*visual_recognition.listClassifiers({}, function(err, res) {
    if (err)
        console.log(err);
    else
        console.log(JSON.stringify(res, null, 2));
});*/