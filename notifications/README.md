# Notifications
Notifications App for demonstrating messaging through RabbitMQ and Websockets. 

Overview
=======================

There is an Nginx server that is set up to proxy requests for dynamic and static pages as well as websocket requests.

If the URL is of the form /notifications then the Nginx server proxies the request to the node server listening on port 8000

If the request has a ws protocol and is of the form /websocket then the Nginx server proxies the request to the node server but it first upgrades the http protocol to ws before passing it through. For this upgrade to be successful, pass the "echo-protocol" when creating the WebSocket in notifications_app.js.

For any other requests the Nginx server will try to serve the static file from it's root directory.

[Network Diagram](https://github.mandiant.com/raw/bhaile1/notifications/master/Notifications_App.png?token=AAADUtFQ059c-TWS2J2n-JU7wiBuVFxXks5Yk6iSwA%3D%3D)

Sequence of events that take place when a user requests /notifications
----------------------------------------------------------------------

When the app-server starts, it loads server.js which creates an http server that is capable of listening to both http and ws protocol requests. This is made possible by wrapping the httpserver by a WebSocketServer.

The httpserver has a request handler which serves the notifications landing page for all /notifications requests and rejects any others.

The WebSocketServer has a request handler which takes care of requests coming to the app-server that have a ws protocol. When such a request comes in, the request handler checks if the request is coming from a trusted origin and if so, sends back an acknowledgement message to the client and then establishes a connection to the rabbitmq-server and binds to acme.error, web.info and app.debug topic queues and starts listening to messages on these queues. The WebSocketServer also creates a handler for handling new web socket messages coming from the client and also attaches a handler for the websocket on close event. The handler for the websocket on close event performs an important task of discarding the queues that were bound to the acme.error, web.info and app.debug topics when the client first requests the /notifications resource.

Now the application is ready to handle messages coming to the acme.error, web.info and app.debug topic queues. To send a message to the topic queues, log in to the app-server and run `/lib/amqp/emmitter.js <topic>[ <topic> <topic> ...] <message>`

When a message comes in, you will be able to see it being printed out in the Notifications landing page notifications.html and in the console log of the browser when the app-server sends a websocket message to the client, and in the app-server logs, when a client sends back a message to the app-server.


For instructions on how to build and run the project please see [Running the Notifications App.](https://github.mandiant.com/bhaile1/notifications/wiki)