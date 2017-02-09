/**
 * Created by olivier on 8/12/16.
 */
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

speech_to_text.recognize(params, function(err, res) {
    if (err)
        console.log(err);
    else
        console.log(JSON.stringify(res, null, 2));
});

// or streaming
/*fs.createReadStream('./resources/end.wav')
    .pipe(speech_to_text.createRecognizeStream({ content_type: 'audio/l16; rate=44100' }))
    .pipe(fs.createWriteStream('./transcription.txt'));*/