var server = new SillyClient(); //create our class
server.connect("84.89.136.194:9000","alexisroom");

server.on_connect = function(){  
	console.log("Connected to server! :)");  
}

server.on_message = function( user_id, message){

	var objectReceived = JSON.parse(message);

	var pathBueno = objectReceived.avatar.split("/");
	pathBueno = "assets/" + pathBueno[pathBueno.length - 1];
	var path = "'" + pathBueno + "'";

	console.log( "User " + user_id + " said " + objectReceived.message );

	var msg = document.createElement("div"); // creamos un div para el mensaje

    msg.innerHTML = "<div class='msg received'>"+
    "<div class='avatar avatar_"+user_id+"'><img class='profilebutton' src='" + pathBueno + "'>" +
    "</div>"+
    "<p class='message'>" + objectReceived.message + "</p>"+
    "</div>"; // escribimos el codigo del mensaje a enviar en el div

    notifyMe(objectReceived.message, pathBueno, 'U TALK says')

    console.log(msg.innerHTML)

    var msgs = document.querySelector("#log"); // cogemos el sitio donde iran los mensajes
    msgs.appendChild(msg); // añadir el parrafo MSG al div de los mensajes

    changeSuPic(pathBueno, user_id);

    msgs.scrollTop = msgs.scrollHeight; // conseguimos que se haga scroll automatico 
                                         // al enviar más mensajes
}

server.on_user_connected = function(user_id){  
	console.log("Somebody has connected to the room");

	// FALTA!!
	// enviar al q se ha conectado mis datos para que sepa quien
	// hay en la sala
}

server.on_user_disconnected = function(user_id){  
	console.log("Somebody has disconnected from the room");
}

server.on_close = function(){  
	console.log("Server closed the connection" );
}
