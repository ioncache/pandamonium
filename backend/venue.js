var http = require('https');
var Venue = null; 

function list(lat,lng) {
  var str = '';
  var options = {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/explore?' + 
      'client_id=&' +
      'client_secret=&' +
      'v=20131110&' +
      'll=' + lat + "," + lng 
  };
  res = this.res;
  res.writeHead(200, { 'Content-Type': 'application/json' })
  
  http.request(options, function(response) {
    response.on('data', function (chunk) {
      str += chunk;
    });
    
    response.on('end', function () {
      res.end(JSON.stringify(str));
    });
  }).end()
}

function get(id) {
  res = this.res;
  res.writeHead(200, { 'Content-Type': 'application/json' })
  Question.findById(id, function (err, questions) {
    if (err) // TODO handle err
    console.log('Getting question ' + id);
    res.end(JSON.stringify(questions));
  });
}

module.exports.list = list;

