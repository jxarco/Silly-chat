var server = new SillyClient(); //create our class
server.connect("84.89.136.194:9000","alexroom");

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

	if(objectReceived.info > 0){
		var conectados = document.createElement("div");
		conectados.innerHTML = "<div class='user user_conn_"+user_id+"'>" +
              "<div class='avatar avatar_c_"+user_id+"'><img src='" + pathBueno + "''></div>" +
              "<p class='userme userme_"+user_id+"'>" + guest_sending + "</p>" +
              "</div>";
        
		var people = document.querySelector("#pp"); // cogemos el sitio donde iran los conectados
		people.appendChild(conectados);
		
		// una vez el nuevo recibe la información de cada uno, 
		// devuelve su información para que los demás completen
		// su registro:

		if(objectReceived.info == 1) accept_handshaking(user_id);

		// añadir posibilidad de chat privado para cada
		// uno de los chats
		add_privateChat_event(user_id, guest_sending); 

		return;
	}

	console.log( "User " + user_id + " said " + objectReceived.message );

	var msg = document.createElement("div"); // creamos un div para el mensaje

	// habremos pasado un string "yes" si el mensaje proviene de la función
	// sendTo. En ese caso, modificamos el mensaje para que lo contenga otra
	// clase y se le pueda dar un estilo distinto

	var msg_type = "msg received";
	var display_msg_type = guest_sending + ": $";
	if(objectReceived.private == "yes") {
		msg_type = "msg private";
		display_msg_type = "[" + guest_sending + "] whispers: $";
	}

	// el resto es igual, la unica diferencia es la clase del div principal
	// la clase que especifica "msg_type"

    msg.innerHTML = "<div class='" + msg_type + "'>"+
    "<p class='guest_console guest_console_rec_"+user_id+"'>" + display_msg_type +"</p>" +
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
    changeSuInfo(pathBueno, user_id, guest_sending);

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

	var user_disc = document.querySelector(".user_conn_" + user_id);
	var div_container = user_disc.parentNode;
	var parent = div_container.parentNode;

	parent.removeChild(div_container);
}

server.on_close = function(){  
	console.log("Server closed the connection" );
}
