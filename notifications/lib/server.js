var http = require('http');
var WebSocketServer = require('websocket').server;
var fs = require('fs');
var Promise = require('bluebird');

var openFile = Promise.promisify( fs.open );
var readFile = Promise.promisify( fs.readFile );
var APPROOT = require('app-root-path');

var TopicExchange =  require(`${APPROOT}/lib/amqp/TopicExchange`);

const http_port = 8000;

//Helper function to create server
var create_server = function(landing_page){

    // Create an http server
    var httpserver = new http.Server();

    console.log("Starting server on port %d",http_port);
    httpserver.listen(http_port, function(){
        console.log("Server started on port %d",http_port);
    });


    //Create WebSocketServer
    var ws = new WebSocketServer({
        httpServer: httpserver,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    //Function to check and if a specified origin is allowed to connect
    function originIsAllowed(origin) {
        // put logic here to detect whether the specified origin is allowed.
        console.log(`ws: request.origin:${origin} should be processed as websocket response`);
        return true;
    }

    //Create the web socket connection
    ws.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');

        //Send acknowledgement back to the client
        connection.sendUTF("Established connection with Server!");

        //Create connection to RabbitMQ topic exchange
        var topicExchange = new TopicExchange(
            {host:'rabbitmq.acme.com',
                name:'topic_logs',
                callback: function(raw_message){
                    var message = raw_message.content.toString();
                    console.log(`Received: ${message}`);
                    //Send to client
                    connection.sendUTF(message);

                }
            }
        );
        //bind to channels and listen for messages
        topicExchange.bindTo('acme.error', 'web.info', 'app.debug');

        //Listen for messages from the client
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                //connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                //connection.sendBytes(message.binaryData);
            }
        });

        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            topicExchange.closeConnection(function(){
               console.log(`Closing connection to ${topicExchange.host}`);
            });
        });
    });

    //Serve up the landing page
    httpserver.on("request", function(request, response){
        if(request.url === "/notifications"){
            response.writeHead(200, {"Content-Type":"text/html"});
            response.write(landing_page);
            response.end();
        }
        else if( request.url === "/websocket"){
            console.log(`http: request.url:${request.url} should be processed as a websocket response.`);
        }
        else{
            response.writeHead(404);
            response.end();
        }
    });
};







//Main Logic
openFile('notification.html','r').then( function(fd){
	readFile(fd).then( function(notification_page){
        create_server(notification_page);
	}).catch(function(err){
		console.log('Error reading file...');
		console.log( err );
	});
}).catch( function(err){
	console.log('Error opening file...');
	console.log( err );
});


