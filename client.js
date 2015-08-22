var net = require('net');
var url = require('url');

var PORT = 80;
var HOST = '';
var URI = '';

for (var i = 2; i < process.argv.length; i++){
  var currentURL = process.argv[i];
  var checkProtocol = currentURL.split(/(\/\/)(?=\w)/g);
  // console.log(checkProtocol);
  if (!checkProtocol[1]){
    currentURL = 'http://' + process.argv[i];
  }

  console.log('URL is', currentURL);

  currentURLobj = url.parse(currentURL, true, true);
  console.log(currentURLobj);
  HOST = currentURLobj.host;
  URI = currentURLobj.pathname;

  if (HOST === 'localhost'){
    PORT = 8080;
  }
}

var client = net.createConnection({port: PORT, host: HOST}, function (){
  console.log('connecting to server');
  client.write(headReq(HOST, URI));
});

client.setEncoding('utf8');

client.on('data', function (data){
  console.log('RECEIVING THE DATA');
  // console.log(data);
  client.end();
});

client.on('error', function (){
  console.log('ERROR! Closing Connection');
  client.end();
});

client.on('end', function (){
  console.log('Disconnected from server');
});


function headReq (host, uri){
  console.log('this is the uri entered', uri);
  var response = '';
  response += 'GET ' + uri + '\n';
  response += 'Host: ' + host + '\n';
  response += 'Date: ' + new Date() + '\n';
  response += 'Accept: text/html' + '\n';
  response += 'Accept-Language: en-US' + '\n';
  response += 'Connection: keep-alive';
  return response;
}