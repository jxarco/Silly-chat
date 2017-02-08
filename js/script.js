
// SCRIPT FOR U TALK CHAT


/* IMPORTANTE: *****************************************************************
 * Necesitamos abrir el chat desde el host de github para hacer funcionar las  *
 * notificaciones. Disponible aquí:  https://jxarco.github.io/ECV1/            *
 * Si no es así, evitaremos preguntar por permisos.                            *
 *******************************************************************************/

var url = window.location.href;

// ask for notifications permission
// Determine the correct object to use
var notification = window.Notification || window.mozNotification || window.webkitNotification;

// The user needs to allow this
if ('undefined' === typeof notification)
  alert('Web notification not supported');
else{ // en caso de estar en modo local y no usar el host
  if(!url.includes("index.html")) notification.requestPermission(function(permission){});
  if(url.includes("localhost")) notification.requestPermission(function(permission){});
}

// INICIO

var random, guestname, avatarPath, num_rand_avatar;
var room_bool = false;
var list;
var color;
window.player = new THREE.Group();
window.server_on = false;

init();

function init(){

  // cambiar el zoom del perfil
  var intro_logo = document.querySelector("#image_avatar img");
  intro_logo.src = "assets/favicon.png";

  var label_name = document.querySelector("#contact_name");
  label_name.innerHTML = "Create or join a room to begin:";

  var roominput = document.querySelector("#roominput");

  // show all
  document.getElementById("opacitypanel").style.display = "block";
  document.getElementById("opacitypanel").style.zIndex = "20";

  roominput.focus();

  document.getElementById("roominput").addEventListener("keyup", function(event){
  event.preventDefault();
    if(event.keyCode == 13)
    {
      init_server();
    }
  });

  // al entrar, asignar nombre de usuario aleatorio
  random = Math.floor((Math.random() * 999) + 1);
  guestname = "Guest" + random;

  // asignamos también un avatar por defecto 
  num_rand_avatar = Math.floor((Math.random() * 21) + 1);
  num_rand_avatar = 1; // esto podemos quitarlo despues
  avatarPath = "assets/avatar" + num_rand_avatar +".png";
  list = [2 + (Math.random() * 3 + 1), 4 + (Math.random() * 3 + 1), 10]; // posicion de nuestra luz canvas 3d 
  color = "#" + ((1<<24) * Math.random() | 0).toString(16);

  // actualizamos los datos en la página
  update();

  // estados inicials de ciertos elementos visuales
  document.getElementById("opacitypanel").style.display = "block";
  document.getElementById("opacitypanel").style.zIndex = "20";
}

function hideIntro(){
  document.getElementById("hideMe").style.display = "none";  
}

// ****************************************************************************
// PEOPLE ********
// aparecer en la lista de conectados
// PD: Solo cuando estemos conectados al servidor

function appear_connected(){
  var conectados = document.createElement("div");
  conectados.innerHTML = "<div class='user'>" +
              "<div class='avatar mycon'><img src='" + avatarPath + "''></div>" +
              "<p class='userme mycon'>" + guestname + "</p>" +
              "</div>";
  var people = document.querySelector("#pp"); // cogemos el sitio donde iran los conectados
  people.appendChild(conectados);

  createNewLight(list, color, "player", avatarPath);  
}

function new_connection(user_id){

  var objectToSend = {}; // nuestro objeto a enviar

  objectToSend.name = guestname;
  objectToSend.avatar = avatarPath;
  objectToSend.info = 1;
  objectToSend.hex_color = color; // color de la luz
  objectToSend.l_list = list; // posicion de la luz
  objectToSend.ring = getRingColor();

  // esto podria ser un array
  var send_to = user_id;

  server.sendMessage(objectToSend, send_to); // empezamos el handshaking
}

function accept_handshaking(user_id){
  var objectToSend = {}; // nuestro objeto a enviar

  objectToSend.name = guestname;
  objectToSend.avatar = avatarPath;
  objectToSend.info = 2; // una vez se acaba el handshaking, no queremos volver a hacerlo
  objectToSend.hex_color = color;
  objectToSend.l_list = list;

  // esto podria ser un array
  var send_to = user_id;

  server.sendMessage(objectToSend, send_to);
}

// funcion para los chats privados
function sendTo(id, sendto_name){

  // Es EXACTAMENTE igual que send()
  // unica diferencia: clase del mensaje enviado:
  // send: message
  // sendTo: message_private
  // solo para el css

  var input = document.querySelector("#textinput");

  var objectToSend = {}; // nuestro objeto a enviar

  // SOLO BORRAMOS ULTIMO CARACTER SI ES POR ENTER
  // PQ SE AÑADE EL "\n"
  if(input.value.includes("\n")) input.value = input.value.substring(0, input.value.length - 1);

  if(input.value != ""){

    var msg = document.createElement("div"); // creamos un div para el mensaje

    if(checked){
      input.value = input.value.capitalize(); // si la casilla está marcada, se pone mayus
    }

    objectToSend.name = guestname;
    objectToSend.message = input.value;
    objectToSend.avatar = avatarPath;
    objectToSend.private = "yes";

    server.sendMessage(objectToSend, id);

    msg.innerHTML = "<div class='msg sent_private'>"+
    "<p class='guest_console guest_console_"+id+"'>To [" + sendto_name + "]: </p>" +
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

function update_privateChat_event(id, sendto_name){
  var p_connected_id = document.getElementById("console_change_" + id);
  p_connected_id.dataset['newname'] = sendto_name;
}

function add_privateChat_event(id, sendto_name){
  var avatar_with_event = document.querySelector(".avatar_c_" + id + " img");

  avatar_with_event.addEventListener("click", function(){
    var p_connected_id = document.getElementById("console_change_"+ id);
    sendTo(id, p_connected_id.dataset['newname']);
  });

}

// característica mayúsculas en el chat ***************************************
// inicialmente activado
var checked = true;
document.getElementById("check1").checked = true;

// activamos la mayúscula inicial
function validateBox(){
  if(checked) checked = false;
  else if(!checked) checked = true;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// My profile *****************************************************************

// esta funcion cambia el avatar en el perfil y en el chat
function changeMyPic(path){
  avatarPath = path; // aqui solo damos valor a la variable 
  update(); // esta cambia el nombre y la foto
  send_avatar_info(path);
  updateTexture("player_body", path);

  // -> coge las cosas que son de la clase myavatar
  var all_my_avatars = document.getElementsByClassName("myavatar");

  // este for cambia nuestros avatares n el chat 
  // coge los hijos de cada cosa que tenia clase avatar
  // despues cambia el src de todos los hijos (en este caso solo hay una imagen en cada hijo)
  for (var i = 0; i < all_my_avatars.length; i++) {
    var div_myavatar = all_my_avatars[i].childNodes;
    for (var j = 0; j < div_myavatar.length; j++) {
      div_myavatar[j].src = avatarPath;
    }
  }

  document.getElementById("avatarslist").style.display = "none";
}

// esta funcion notifica a los demas usuarios que me he cambiado
// el avatar !!!!

function send_avatar_info(newpath){

  var objectToSend = {}; // nuestro objeto a enviar
  var auto_message = "Auto-message: My avatar has changed!";

  objectToSend.name = guestname;
  objectToSend.message = auto_message;
  objectToSend.avatar = newpath;

  server.sendMessage(objectToSend);
}

function send_name_info(newname){

  var objectToSend = {}; // nuestro objeto a enviar
  var auto_message = "Auto-message: My nickname has changed!";

  objectToSend.name = newname;
  objectToSend.message = auto_message;
  objectToSend.avatar = avatarPath;

  server.sendMessage(objectToSend);
}

function changeSuInfo(path, id, name){

  // avatares de todos sus mensajes
  var img_usuarios = document.querySelectorAll(".avatar_" + id + " img");
  for(var i = 0; i < img_usuarios.length; ++i){
    img_usuarios[i].src = path;
    img_usuarios[i].addEventListener("click", function(){
      showProfile(path, name);
    });
  }

  // nombre de usuario de sus mensajes
  var text_usuarios_chats = document.querySelectorAll(".guest_console_rec_" + id);
  for (var i = 0; i < text_usuarios_chats.length; i++) {
    text_usuarios_chats[i].innerHTML = "[" + name + "] whispers: ";
  }

  // avatar en people
  var img_usuarios_people = document.querySelector(".avatar_c_" + id + " img");
  img_usuarios_people.src = path;

  // nombre de usuario en people
  var text_usuarios_people = document.querySelector(".userme_" + id);
  text_usuarios_people.innerHTML = name;

  // cambiar el nombre del privado 
  var my_priv_message_to = document.querySelectorAll(".guest_console_" + id);
  for (var i = 0; i < my_priv_message_to.length; i++) {
    my_priv_message_to[i].innerHTML = "To [" + name + "]: ";
  }

  // recargar nueva textura
  updateTexture(id + "_body", path);
}

// cambia el nombre de usuario
function modifyName(){
  var input = document.querySelector("#uinput");
  var aux = guestname;
  if(input.value != ""){
    guestname = input.value;
    if(guestname.length > 15){
      guestname = aux;
      alert("Choose shorter nickname! (<15)")
    }
    input.value = "";
    send_name_info(guestname); // Si esta vacio, no tenemos que avisar
  }
  
  hideDivs();
  update();
  
  var my_messages = document.querySelectorAll(".mine");
  for (var i = 0; i < my_messages.length; i++) {
    my_messages[i].innerHTML = guestname + ": ";
  }
}

function hideDivs(){
  document.getElementById("uaccept").style.display = "none"; 
  document.getElementById("uinput").style.display = "none";
  document.getElementById("change_id").style.display = "none";
}
  

// añadir funcionalidad: boton USERNAME cambia el nombre de usuario
var ubutton = document.querySelector("#ubutton");
ubutton.addEventListener("click", function(){

  // input and accept button have to appear
  document.getElementById("uaccept").style.display = "block";
  document.getElementById("uinput").style.display = "block";
  document.getElementById("change_id").style.display = "block";
  
  // scroll to view complete panel
  document.body.scrollTop = document.body.scrollHeight;

  // set focus to text area to write directly
  document.getElementById("uinput").focus();

});

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
  document.getElementById("right_info").style.display = "block";
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
  hideDivs();
  var avatar_list = document.getElementById("avatarslist");
  avatar_list.style.display = "block";
  document.body.scrollTop = document.body.scrollHeight;
}


// CHAT BOX *******************************************************************

function createMsg(guestname, avatarPath, argument){

  var msg = document.createElement("div"); // creamos un div para el mensaje

  msg.innerHTML = "<div class='msg sent'>"+
  "<p class='guest_console mine'>" + guestname + ": </p>" +
  "<div class='myavatar'><img src='" + avatarPath + "'></div>"+
  "<p class='message'>" + argument + "</p>"+
  "</div>"; // escribimos el codigo del mensaje a enviar en el div

  var msgs = document.querySelector("#log"); // cogemos el sitio donde iran los mensajes
  msgs.appendChild(msg); // añadir el parrafo MSG al div de los mensajes

  msgs.scrollTop = msgs.scrollHeight; // conseguimos que se haga scroll automatico 
                                       // al enviar más mensajes
}

// enviar nuestros mensajes al chat
function send(argument, hex_color, list){

  var objectToSend = {}; // nuestro objeto a enviar

  if(argument){
    objectToSend.name = guestname;
    objectToSend.message = argument;
    objectToSend.avatar = avatarPath;
    if(argument == "confeti"){
      objectToSend.info = 5;
    }else if(argument == "ring_hex"){
      objectToSend.info = 6;
      objectToSend.ring_hex = hex_color;
    }else if(argument == "newlight"){
      objectToSend.info = 7;
      objectToSend.l_list = list;
    }else if(argument == "rem_confeti"){
      objectToSend.info = 8;
    }else if (argument == "rem_popped"){
      objectToSend.info = 13;
    }

    server.sendMessage(objectToSend);
    
    return;
  }

  var input = document.querySelector("#textinput");

  // SOLO BORRAMOS ULTIMO CARACTER SI ES POR ENTER
  // PQ SE AÑADE EL "\n"
  if(input.value.includes("\n"))
    input.value = input.value.substring(0, input.value.length - 1);

  if(input.value != ""){

    if(checked){
      input.value = input.value.capitalize(); // si la casilla está marcada, se pone mayus
    }

    objectToSend.name = guestname;
    objectToSend.message = input.value;
    objectToSend.avatar = avatarPath;

    server.sendMessage(objectToSend);

    createMsg(guestname, avatarPath, input.value);

    input.value = "" // reiniciamos el input 
  }
}

// boton SEND "envia" el mensaje que hay en el input
var button = document.querySelector("#sendbutton");
button.addEventListener("click", function(){
  send();
  document.getElementById("textinput").focus();
});

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
function showProfile(path, name) {

  // cambiar el zoom del perfil
  var profile_zoom_img = document.querySelector("#image_avatar img");
  profile_zoom_img.src = path;

  var profile_zoom_name = document.querySelector("#contact_name");
  profile_zoom_name.innerHTML = name;

  // show all
  document.getElementById("opacitypanel").style.display = "block";
  document.getElementById("opacitypanel").style.zIndex = "20";
}

//abrir o cerrar chat
function openChat() {

  document.getElementById("chatBox").style.display = "block";
  document.getElementById("textinput").focus();
  closeNav();

}

function closeChat() {

  document.getElementById("chatBox").style.display = "none";

}

// ****************************************************************************
// **** MENU  ****


// menu desplegable al hacer click
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    hideDivs();
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.getElementById("stab").style.display = "none";
}

// tecla ESC cierra el menú
document.addEventListener("keydown", keyListener, false);
function keyListener(event){
  var keyCode = event.keyCode;
  if(keyCode == 27){
    closeNav();
    document.getElementById("avatarslist").style.display = "none";
    document.getElementById("right_info").style.display = "none";

    hideDivs();
    closeChat();

    var op_panel = document.getElementById("opacitypanel");
    if(op_panel.dataset['boolean'] == "true") hideOpPanel();
  }
}

// ****************************************************************************

// si hacemos click fuera del menu, deberia desaparecer
window.onclick = function(event) {

  // si clicamos en cualquier sitio que no sea el perfil de la otra persona, se cerrará
  if (!event.target.matches('.profilebutton') && !event.target.matches('.room')) {
    var op_panel = document.getElementById("opacitypanel");
    if(op_panel.dataset['boolean'] == "true") hideOpPanel();
  }

  // si clicamos en hide profile, el perfil se esconderá
  if (event.target.matches('.hideProfile')) {
    document.getElementById("right_info").style.display = "none";
    hideDivs();
  }

  // si clicamos en aceptar, el boton y el input desapareceran
  if(event.target.matches('.accept')) {
    hideDivs();
  }

  // si clicamos fuera de los avatares, la lista se esconderá
  if ((!event.target.matches('.showAva')) && (!event.target.matches('.avatartype'))) {
    document.getElementById("avatarslist").style.display = "none";
  }
}

function hideOpPanel(){
  document.getElementById("opacitypanel").style.display = "none";
  document.getElementById("opacitypanel").style.zIndex = "1";
}

// SKINS *************************************************************

function openSkinTab(){
  document.getElementById("stab").style.display = "block";
}

function applySkin(cssFile, cssLinkIndex) {

    var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

    var newlink = document.createElement("link");
    newlink.setAttribute("rel", "stylesheet");
    newlink.setAttribute("type", "text/css");
    newlink.setAttribute("href", cssFile);

    document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);

    closeNav();
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


