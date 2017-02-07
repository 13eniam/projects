var timeoutId = setInterval( function(){
	console.log("Hello");
}, 1000);

setTimeout( function(){
	clearInterval(timeoutId);
},10000);