define( function(require){
    console.log('notification_app!');
    var jquery = require("jquery");
    console.log("using the object returned through require; jquery version:", jquery.fn.jquery);
    console.log("using the global $ object; jquery version:", $.fn.jquery);

    var socket = new WebSocket("ws://" + location.host + "/websocket/","echo-protocol");

    socket.onmessage = function(event){
        var msg = event.data;
        console.log("========= %s =========", msg);
        $('div#notifications').append(`${msg}<br/>`);
    };

    //What gets returned from this module
    return {
        a: 1,
        b: 2
    }
});
