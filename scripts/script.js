
// SCRIPT FOR U TALK CHAT

// ask for notifications permission

// Determine the correct object to use
var notification = window.Notification || window.mozNotification || window.webkitNotification;

// The user needs to allow this
if ('undefined' === typeof notification)
    alert('Web notification not supported');
else
    notification.requestPermission(function(permission){});

/*Notification.requestPermission().then(function(result) {
  console.log(result);
});*/

// al entrar, asignar nombre de usuario aleatorio
var random = Math.floor((Math.random() * 999) + 1);
var guestname = "Guest" + random;

// asignamos también un avatar por defecto 
var avatarPath = "assets/avatar5.png";

// actualizamos los datos en la página
update();


// estados inicials de ciertos elementos visuales
document.getElementById("chatBox").style.display = "block";
document.getElementById("opacitypanel").style.display = "none";
document.getElementById("contentpiano").style.display = "none";


// característica mayúsculas en el chat ***************************************
// inicialmente desactivado
var checked = false;

// activamos la mayúscula inicial
function validateBox(){
  checked = document.getElementById("check1").checked;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// My profile *****************************************************************

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

function changeSuPic(path, id){

  var img_usuarios = document.querySelectorAll(".avatar_" + id + " img");
  for(var i = 0; i < img_usuarios.length; ++i){
    img_usuarios[i].src = path;
    //img_usuarios[i].addEventListener("click", showProfile(path)); // click zoom perfil
  }
}

// cambia el nombre de usuario
function modifyName(){
  var input = document.querySelector("#uinput");
  if(input.value != "") guestname = input.value;
  input.value = "";
  document.getElementById("uaccept").style.display = "none";
  document.getElementById("uinput").style.display = "none";
  update();
}

// añadir funcionalidad: boton USERNAME cambia el nombre de usuario
var ubutton = document.querySelector("#ubutton");
ubutton.addEventListener("click", changeUsername);

// añadir funcionalidad: boton accept modifica el nombre de usuario
var accept = document.querySelector("#uaccept");
accept.addEventListener("click", modifyName);

// tecla ENTER modifica el nombre de usuario
document.getElementById("uinput").addEventListener("keyup", function(event){
  event.preventDefault();
  if(event.keyCode == 13)
  {
    modifyName();
  }
});

function privateInfo() {
  update();
  document.getElementById("persInfoBox").style.display = "block";
  closeNav();
}

//actualizar información del usuario
function update(){
  document.querySelector("#gn").innerHTML = guestname;
  document.getElementById("myPic").src = avatarPath;

  var my_avatar_conn = document.getElementsByClassName("avatar mycon");
  for (var i = 0; i < my_avatar_conn.length; i++) {
    var childNodes = my_avatar_conn[i].childNodes;
    for (var j = 0; j < childNodes.length; j++) {
      childNodes[j].src = avatarPath;
    }
  }

  var my_name_conn = document.getElementsByClassName("userme mycon");
  for (var i = 0; i < my_name_conn.length; i++) {
    my_name_conn[i].innerHTML = guestname;
  }
}

// mostrar coleccion de avatares
function showAvatars() {
  document.getElementById("uaccept").style.display = "none"; 
  document.getElementById("uinput").style.display = "none";
  document.getElementById("avatarslist").style.display = "block";
}


// CHAT BOX *******************************************************************

// enviar nuestros mensajes al chat
function send(){

  var input = document.querySelector("#textinput");

  var objectToSend = {}; // nuestro objeto a enviar

  objectToSend.message = input.value;
  objectToSend.avatar = avatarPath;

  server.sendMessage(objectToSend);

  input.value = input.value.substring(0, input.value.length - 1);

  if(input.value != ""){

    var msg = document.createElement("div"); // creamos un div para el mensaje

    if(checked){
      input.value = input.value.capitalize(); // si la casilla está marcada, se pone mayus
    } 

    msg.innerHTML = "<div class='msg sent'>"+
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

// boton SEND "envia" el mensaje que hay en el input
var button = document.querySelector("#sendbutton");
button.addEventListener("click", send);

// tecla ENTER hace que boton SEND se active
document.getElementById("textinput").addEventListener("keyup", function(event){
  event.preventDefault();
  if(event.keyCode == 13)
  {
    send();
  }
});

function deleteChat(){

  var div = document.getElementById('log');
    while(div.firstChild){
      div.removeChild(div.firstChild);
    }
  closeNav();
}

// mostrar perfil del usuario
function showProfile(path) {

  // cambiar el zoom del perfil
  //var profile_zoom = document.querySelector("#image_avatar img");
  //profile_zoom.src = path;

  // show all
  document.getElementById("opacitypanel").style.display = "block";
}

//abrir o cerrar chat
function openChat() {
  if (document.getElementById("chatBox").style.display == "block"){
    document.getElementById("chatBox").style.display = "none";
    closeNav();
  }else {
    document.getElementById("chatBox").style.display = "block";
    closeNav();
  }
}

// ****************************************************************************
// PEOPLE ********
// aparecer en la lista de conectados
var conectados = document.createElement("div");
conectados.innerHTML = "<div class='user'>" +
              "<div class='avatar mycon'><img src='" + avatarPath + "''></div>" +
              "<p class='userme mycon'>" + guestname + "</p>" +
              "</div>";
var people = document.querySelector("#pp"); // cogemos el sitio donde iran los conectados
people.appendChild(conectados);


// ****************************************************************************
// **** MENU  ****


// menu desplegable al hacer click
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}

// tecla ESC cierra el menú
document.addEventListener("keydown", keyListener, false);
function keyListener(event){
  var keyCode = event.keyCode;
  if(keyCode == 27){
    closeNav();
  }
}

// ****************************************************************************

// si hacemos click fuera del menu, deberia desaparecer
window.onclick = function(event) {

  // si clicamos en cualquier sitio que no sea el perfil de la otra persona, se cerrará
  if (!event.target.matches('.profilebutton')) {
    document.getElementById("opacitypanel").style.display = "none";
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

// NOTIFICACIONES *************************************************************

  function notifyMe(theBody, theIcon, theTitle) {
    
    var options = {
      body: theBody,
      icon: theIcon
    }
    
    var n = new Notification(theTitle, options);
    setTimeout(n.close.bind(n), 4000);
  }

// ?????????????
// PIANO **********************************************************************

//abrir piano
function openPiano() {
  if (document.getElementById("contentpiano").style.display == "none"){
    document.getElementById("contentpiano").style.display = "block";
  }else {
    document.getElementById("contentpiano").style.display = "none";
  }
}
