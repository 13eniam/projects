var amqplib = require('amqplib');
var Promise = require('bluebird');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_topic.js <facility>.<severity>");
    process.exit(1);
}

amqplib.connect('amqp://rabbitmq.acme.com').then(function(conn){
    return conn.createChannel();
}).then( function(ch){
    var ex = 'topic_logs';
    return ch.assertExchange(ex, 'topic', {durable:false}).then(function(){
        return ch.assertQueue('', {exclusive: true}).then(function(q){
            var bindQueue = Promise.map(args, function(bind_key){
                return ch.bindQueue(q.queue, ex, bind_key);
            });

            return bindQueue.then( function(){
                return ch.consume(q.queue, function(message){
                    console.log(message.content.toString());
                }, {noAck: true});
            });
        });
    });
});