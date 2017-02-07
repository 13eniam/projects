var amqplib = require('amqplib');
var Promise = require('bluebird');
var _ = require('underscore');


class TopicExchange {
    constructor (options){
        var {host, name, callback} = options;
        this.host = host;
        this.name = name;
        this.callback = callback;
        this.connection = null;
    }

    bindTo(){
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        console.log(args);

        if (args.length == 0) {
            console.log("Usage: bindTo bindKey[,bindKey,...]");
            process.exit(1);
        }

        return amqplib.connect(`amqp://${self.host}`).then(function(conn){
            self.connection = conn;
            return conn.createChannel();
        }).then( function(ch){
            var ex = self.name;
            return ch.assertExchange(ex, 'topic', {durable:false}).then(function(){
                return ch.assertQueue('', {exclusive: true}).then(function(q){
                    var bindQueue = Promise.map(args, function(bind_key){
                        return ch.bindQueue(q.queue, ex, bind_key);
                    });

                    return bindQueue.then( function(){
                        return ch.consume(q.queue, function(message){
                            self.callback(message);
                        }, {noAck: true});
                    });
                });
            });
        });
    }

    closeConnection(callback){
        console.log('TopicExchange.closeConnection:','Closing connection...');
        var promise = Promise.resolve();
        if( this.connection && _.isFunction(this.connection.close) ){
            if( callback )
                promise = this.connection.close().then( callback );
            else
                promise = this.connection.close();
        }
        return promise;
    }

    toString(){
        var topicExchange = `rabbitmq host:${this.host} | exchange name:${this.name}`;
        return topicExchange;
    }

};


module.exports = TopicExchange;