var amqplib = require('amqplib');

amqplib.connect('amqp://rabbitmq.acme.com')
.then( function(conn) {
    return conn.createChannel().then(function (ch) {
        var ex = 'topic_logs';
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymous.info';
        var msg = args.slice(1).join(' ') || 'Hello World!';

        ch.assertExchange(ex, 'topic', {durable: false}).then(function () {
            ch.publish(ex, key, new Buffer(msg));
            console.log(" [x] Sent %s:'%s'", key, msg);

            setTimeout( function(){
                conn.close();
                process.exit(0);
            },500);
        });
    }).catch(function (err) {
        console.log(err);
    })
});
