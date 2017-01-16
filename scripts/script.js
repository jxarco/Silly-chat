
// SCRIPT FOR U TALK CHAT

// asignar nombre de usuario aleatorio
var random = Math.floor((Math.random() * 999) + 1);
var guestname = "Guest" + random;
var avatarPath = "assets/avatar5.png";
update();

console.log(guestname);

// estado inicial de los elementos visuales
document.getElementById("chatBox").style.display = "block";
document.getElementById("rprofile").style.display = "none";
document.getElementById("contentpiano").style.display = "none";

// tema de las mayúsculas en el chat
var checked = false;

function validateBox(){
  checked = document.getElementById("check1").checked;
}

// primera letra mayúscula
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// aparecer en la lista de conectados
var conectados = document.createElement("div");
conectados.innerHTML = "<div class='user'>" +
              "<div class='avatar mycon'><img src='" + avatarPath + "''></div>" +
              "<p class='userme mycon'>" + guestname + "</p>" +
              "</div>";
var people = document.querySelector("#pp"); // cogemos el sitio donde iran los conectados
people.appendChild(conectados);


// recibimos un guest name como mensaje
document.getElementById("fmessage").innerHTML = "Hi " + guestname + "!";


// boton SEND "envia" el mensaje que hay en el input
var button = document.querySelector("#sendbutton");
button.addEventListener("click", send);

// boton USERNAME cambia el nombre de usuario
var ubutton = document.querySelector("#ubutton");
ubutton.addEventListener("click", changeUsername);

// tecla ENTER hace que boton SEND se active
document.getElementById("textinput").addEventListener("keyup", function(event){
	event.preventDefault();
	if(event.keyCode == 13)
	{
		document.getElementById("sendbutton").click()
	}
});

// tecla ENTER hace que boton accept (cambiar nombre) se active
document.getElementById("uinput").addEventListener("keyup", function(event){
  event.preventDefault();
  if(event.keyCode == 13)
  {
    document.getElementById("uaccept").click()
  }
});

// boton accept modifica el nombre de usuario
var accept = document.querySelector("#uaccept");
accept.addEventListener("click", modifyName);


// enviar nuestros mensajes al chat
function send(){

	var input = document.querySelector("#textinput");

	if(input.value != ""){
		var msg = document.createElement("div"); // creamos un div para el mensaje

    if(checked){
      input.value = input.value.capitalize(); // si la casilla está marcada, se pone mayus
    } 

		msg.innerHTML =	"<div class='msg sent'>"+
		"<div class='myavatar'><img src='" + avatarPath + "'></div>"+
		"<p class='message'>" + input.value + "</p>"+
		"</div>"; // escribimos el codigo del mensaje a enviar en el div

		input.value = "" // reiniciamos el input 
		var msgs = document.querySelector("#log"); // cogemos el sitio donde iran los mensajes
		msgs.appendChild(msg); // añadir el parrafo MSG al div de los mensajes

		msgs.scrollTop = msgs.scrollHeight; // conseguimos que se haga scroll automatico 
              	                         // al enviar más mensajes
	}
}

function deleteChat(){

  var div = document.getElementById('log');
    while(div.firstChild){
      div.removeChild(div.firstChild);
    }

}

// menu desplegable al hacer click
function showMenu(){
  document.getElementById("menu").style.display = "block";
}

// si hacemos click fuera del menu, deberia desaparecer
window.onclick = function(event) {

  // si clicamos en cualquier sitio que no sea el boton del menu, se cierra
  if (!event.target.matches('.showbutton')) {
    document.getElementById("menu").style.display = "none";
  }

  // si clicamos en cualquier sitio que no sea el perfil de la otra persona, se cerrará
  if (!event.target.matches('.profilebutton')) {
    if(document.getElementById("rprofile") != null)
      document.getElementById("rprofile").style.display = "none";
  }

  // si clicamos en hide profile, el perfil se esconderá
  if (event.target.matches('.hideProfile')) {
    document.getElementById("persInfoBox").style.display = "none";
  }

  // si clicamos en aceptar, el boton y el input desapareceran
  if(event.target.matches('.accept')) {
    document.getElementById("uaccept").style.display = "none";
    document.getElementById("uinput").style.display = "none";
  }

  // si clicamos fuera de los avatares, la lista se esconderá
  if ((!event.target.matches('.showAva')) && (!event.target.matches('.avatartype'))) {
    document.getElementById("avatarslist").style.display = "none";
  }
}

// cambiar nombre de usuario
function changeUsername(){
  document.getElementById("uaccept").style.display = "block"; // el input y el boton de aceptar se quitan cuando damos a aceptar
  document.getElementById("uinput").style.display = "block";
}

// esta funcion cambia el avatar en el perfil y en el chat
function changeMyPic(path){
  avatarPath = path; // aqui solo damos valor a la variable 
  update(); // esta cambia el nombre y la foto

  // -> coge las cosas que son de la clase myavatar
  var x = document.getElementsByClassName("myavatar");

  // este for cambia nuestros avatares n el chat 
  // coge los hijos de cada cosa que tenia clase avatar
  // despues cambia el src de todos los hijos (en este caso solo hay una imagen en cada hijo)
  for (var i = 0; i < x.length; i++) {
    var y = x[i].childNodes;
    for (var j = 0; j < y.length; j++) {
      y[j].src = avatarPath;
    }
  }

  document.getElementById("avatarslist").style.display = "none";
}

// cambia el nombre de usuario
function modifyName(){
  var input = document.querySelector("#uinput");
  if(input.value != "") guestname = input.value;
  input.value = "";
  update();
}

// mostrar perfil del usuario
function showProfile() {
  document.getElementById("rprofile").style.display = "block";
}

// mostrar coleccion de avatares
function showAvatars() {
  document.getElementById("avatarslist").style.display = "block";
}

//abrir o cerrar chat
function openChat() {
  if (document.getElementById("chatBox").style.display == "block"){
    document.getElementById("chatBox").style.display = "none";
  }else {
    document.getElementById("chatBox").style.display = "block";
  }
}

//abrir piano
function openPiano() {
  if (document.getElementById("contentpiano").style.display == "none"){
    document.getElementById("contentpiano").style.display = "block";
  }else {
    document.getElementById("contentpiano").style.display = "none";
  }
}

//ver información propia
function update(){
  document.querySelector("#gn").innerHTML = guestname;
  document.getElementById("myPic").src = avatarPath;

  var x = document.getElementsByClassName("avatar mycon");
  for (var i = 0; i < x.length; i++) {
    var y = x[i].childNodes;
    for (var j = 0; j < y.length; j++) {
      y[j].src = avatarPath;
    }
  }

  var x = document.getElementsByClassName("userme mycon");
  for (var i = 0; i < x.length; i++) {
    x[i].innerHTML = guestname;
  }
}

function privateInfo() {
  
  update();
  document.getElementById("persInfoBox").style.display = "block";
}







