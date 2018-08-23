
var util = require('util');
var Bing = require('node-bing-api')({accKey: '8id3'});

Bing.images("Filet Mignon", {count: 10}, function(error, res, body){
    console.log(body.value[0].contentUrl);
}); 
