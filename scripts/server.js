var server = new SillyClient(); //create our class
server.connect("84.89.136.194:9000","alexisroom");

server.on_connect = function(){  
	console.log("Connected to server! :)");  
}

server.on_message = function( user_id, message){

	var objectReceived = JSON.parse(message);

	var guest_sending = objectReceived.name;
	var pathBueno = objectReceived.avatar.split("/");
	pathBueno = "assets/" + pathBueno[pathBueno.length - 1];

	// si info=1 el mensaje solo sirve para indicar que
	// esa persona esta conectada
	
	if(objectReceived.info == 1){
		var conectados = document.createElement("div");
		conectados.innerHTML = "<div class='user'>" +
              "<div class='avatar'><img src='" + pathBueno + "''></div>" +
              "<p class='userme'>" + guest_sending + "</p>" +
              "</div>";
		var people = document.querySelector("#pp"); // cogemos el sitio donde iran los conectados
		people.appendChild(conectados);
		return;
	}

	console.log( "User " + user_id + " said " + objectReceived.message );

	var msg = document.createElement("div"); // creamos un div para el mensaje

    msg.innerHTML = "<div class='msg received'>"+
    "<div class='avatar avatar_"+user_id+"'>" +
    "<img class='profilebutton' src='" + pathBueno + "'>" +
    "</div>"+
    "<p class='message'>" + objectReceived.message + "</p>"+
    "</div>"; // escribimos el codigo del mensaje a enviar en el div

    notifyMe(objectReceived.message, pathBueno, guest_sending +' says:');

    var msgs = document.querySelector("#log"); // cogemos el sitio donde iran los mensajes
    msgs.appendChild(msg); // añadir el parrafo MSG al div de los mensajes

    // esto cambiara la imagen en el chat de ese usuario
    // además de el zoom en caso de clicar y el nombre
    changeSuPic(pathBueno, user_id, guest_sending);

    msgs.scrollTop = msgs.scrollHeight; // conseguimos que se haga scroll automatico 
                                         // al enviar más mensajes
}

server.on_user_connected = function(user_id){  
	console.log("Somebody has connected to the room");

	var path = "assets/connected.png";
	var message = "Auto-message: User " + user_id + " has entered the conversation!";

	var msg = document.createElement("div"); // creamos un div para el mensaje

    msg.innerHTML = "<div class='msg received'>"+
    "<div class='avatar avatar_connected'>" +
    "<img class='profilebutton' src='" + path + "'>" +
    "</div>"+
    "<p class='message'>" + message + "</p>"+
    "</div>"; // escribimos el codigo del mensaje a enviar en el div

    var msgs = document.querySelector("#log"); // cogemos el sitio donde iran los mensajes
    msgs.appendChild(msg); // añadir el parrafo MSG al div de los mensajes

    msgs.scrollTop = msgs.scrollHeight; // conseguimos que se haga scroll automatico 
                                         // al enviar más mensajes

    // ********************************************************************************
	// FALTA!!
	// enviar al q se ha conectado mis datos para que sepa quien
	// hay en la sala
	// ********************************************************************************
	new_connection(user_id);

}

server.on_user_disconnected = function(user_id){  
	console.log("Somebody has disconnected from the room");
}

server.on_close = function(){  
	console.log("Server closed the connection" );
}
