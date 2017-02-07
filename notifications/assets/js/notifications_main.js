requirejs.config({
    //default url is in notification.html in the data-main attribute.
    //All paths in this file will be defined to the relative baserUrl
    baseUrl: "js",
    paths: {
        jquery: "vendor/jquery/dist/jquery"
    }
});

// require(["jquery"], function(){
//    console.log("jQuery version: ", $.fn.jquery);
// });

require(["notification_app"], function(app){
    console.dir(app);
});
