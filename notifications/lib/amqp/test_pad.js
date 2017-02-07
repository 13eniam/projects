var APPROOT = require('app-root-path');
var TopicExchange =  require(`${APPROOT}/lib/amqp/TopicExchange`);

var topicExchange = new TopicExchange(
    {
          host:'rabbitmq.acme.com',
          name:'topic_logs',
          callback: function(raw_message){
               var msg = raw_message.content.toString();
               console.log(msg);
               if( msg === 'close')
                    console.log('test_pad:','Closing connection...');
                   this.closeConnection(function(){
                        console.log(`Closing connection to ${topicExchange.host}`);
                   });
          }
    }
);

topicExchange.bindTo('acme.error', 'web.info', 'app.debug').then(function(){
     console.log(`======+ ${topicExchange} +=======`);
});


