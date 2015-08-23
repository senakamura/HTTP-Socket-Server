var net = require('net');
var url = require('url');

var PORT = 80;
var HOST = '';
var URI = '';

var getReq;
var portReq; //checks if Port is requested or defaults to 80;

// node client.js GET -p 80 www.link.com

// Takes in arguments and processes them accordingly to variables
for (var i = 2; i < process.argv.length; i++){
  getReq = process.argv[2];
  portReq = process.argv[3];

  if (portReq === '-p'){
    PORT = process.argv[4];
    HOST = process.argv[5];
  } else if (Number(process.argv[3])){
    HOST = process.argv[4];
  } else {
    HOST = process.argv[3];
  }
}

// User warning if not used the -p flag
if (Number(process.argv[3])){
  console.log("Please use the '-p' flag before Port number");
}

// Checks HOST string and changes accordingly
var currentURL = HOST;
var checkProtocol = currentURL.split(/(\/\/)(?=\w)/g);
// console.log(checkProtocol);
if (!checkProtocol[1]){
  currentURL = 'http://' + HOST;
}

console.log('URL is', currentURL);

currentURLobj = url.parse(currentURL, true, true);
// console.log(currentURLobj);
HOST = currentURLobj.host;
URI = currentURLobj.pathname;

//Start Client Connection
var client = net.createConnection({port: PORT, host: HOST}, function (){
  console.log('connecting to server');
  client.write(headReq(getReq, HOST, URI));
});

client.setEncoding('utf8');

client.on('data', function (data){
  console.log('RECEIVING THE DATA');
  console.log(data);
  client.end();
});

client.on('error', function (){
  console.log('ERROR! Closing Connection');
  client.end();
});

client.on('end', function (){
  console.log('Disconnected from server');
});


function headReq (req, host, uri){
  console.log('this is the uri entered', uri);
  var response = '';
  response += req + ' ' + uri + '\n';
  response += 'Host: ' + host + '\n';
  response += 'Date: ' + new Date() + '\n';
  response += 'Accept: text/html' + '\n';
  response += 'Accept-Language: en-US' + '\n';
  response += 'Connection: keep-alive';
  return response;
}