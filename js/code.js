var app = {

	start3D: function(){
		loadCube();
	}
}

// player move controls
var w = false, a = false, s = false, d = false, k = false, l = false;
// var space = false, begin = false;

var camera, scene, renderer, startTime;
var baseRing, ground;
var container = document.querySelector(".canvas_container");

var tam = container.getBoundingClientRect();

var confeti_list = [];
var pop_list = [];
var collidableMeshList = [];
var materials;

var audio = new Audio('assets/audio.mp3');;

function loadCube(){
	
	function init() {
		camera = new THREE.PerspectiveCamera(36, tam.width / tam.height, 1, 1000 );
		camera.position.set( 5, 10, 18 );
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x00032 );
		
		// Fog

		scene.fog = new THREE.Fog(0xffffff, 750);

		// Lights
		scene.add( new THREE.AmbientLight( 0x505050, 0.2 ) );

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.25 );
		directionalLight.position.set( 0, 3, 0 );
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 10;
		scene.add( directionalLight );

		// Objects

		var floorGeo = new THREE.PlaneGeometry( 30, 30, 1, 1 )
		var flootMat = new THREE.MeshPhongMaterial( { color: 0xf1f4f1, shininess: 5 } );

		// Ground
		ground = new THREE.Mesh(floorGeo, flootMat );
		ground.rotation.x = - Math.PI / 2;
		ground.receiveShadow = true;
		collidableMeshList.push(ground);
		scene.add( ground );

		// BaseRing
		var RingMat = new THREE.MeshPhongMaterial( {
				color: 0xffffff,
				shininess: 20,
				specular: 0xffffff,
				side: THREE.DoubleSide
			} );
		var baseRingGeo = new THREE.BoxGeometry( 10, 1, 10 );

		baseRing = new THREE.Mesh( baseRingGeo, RingMat );
		baseRing.castShadow = true;
		baseRing.receiveShadow = true;
		baseRing.position.x = 0;
		baseRing.position.y = 1;
		scene.add( baseRing );
		collidableMeshList.push(baseRing);

		// 4 corners

		var cornerRingGeo = new THREE.CylinderGeometry(0.25, 0.25, 3, 32, 32, false);

		var cornerRing;

		for(var i = -5; i <= 5; i += 10){
			for(var j = -5; j <= 5; j += 10){
				cornerRing  = new THREE.Mesh( cornerRingGeo, RingMat );
				cornerRing.castShadow = true;
				cornerRing.receiveShadow = true;
				cornerRing.position.x = i;
				cornerRing.position.y = 2;
				cornerRing.position.z = j;
				scene.add( cornerRing );
			}
		}

		// 8 cuerdas

		var ropeRingGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 32, 32, false);

		var ropeRing;

		for(var i = -5; i <= 10; i += 10){
			for(var j = 2; j <= 3; j += 1){
				ropeRing  = new THREE.Mesh( ropeRingGeo, RingMat );
				ropeRing.castShadow = true;
				ropeRing.receiveShadow = true;
				ropeRing.position.x = i;
				ropeRing.position.y = j;
				ropeRing.position.z = 0;
				ropeRing.rotation.x = - Math.PI / 2;
				scene.add( ropeRing );
			}
		}

		for(var i = -5; i <= 10; i += 10){
			for(var j = 2; j <= 3; j += 1){
				ropeRing  = new THREE.Mesh( ropeRingGeo, RingMat );
				ropeRing.castShadow = true;
				ropeRing.receiveShadow = true;
				ropeRing.position.x = 0;
				ropeRing.position.y = j;
				ropeRing.position.z = i;
				ropeRing.rotation.x = - Math.PI/2;
				ropeRing.rotation.z = - Math.PI/2;
				scene.add( ropeRing );
			}
		}

		createChairs();

		// Renderer
		renderer = new THREE.WebGLRenderer();
		renderer.domElement.id = "my_canvas";
		renderer.shadowMap.enabled = true;
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( tam.width, tam.height );
		window.addEventListener( 'resize', onWindowResize, false );
		container.appendChild( renderer.domElement );		

		// Controls
		var controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.target.set( 0, 1, 0 );
		controls.update();

		// GUI

		var gui = new dat.GUI();
		container.appendChild(gui.domElement);
		gui.domElement.id = "gui_id";
	
		var parameters = 
		{
			a: function(){ confetiExplosion(); send("confeti") },
			b: function(){ removeConfeti(); send("rem_confeti") },
			c: 100, // numeric slider
			d: function(){
				camera.position.x = 5;
				camera.position.y = 10;
				camera.position.z = 18;

				controls.target.set( 0, 1, 0 );
				controls.update();
			},
			e: "#fff000", // color (hex)
			f: function(){ changeRingColor(parameters.e); send("ring_hex", parameters.e) },
			g: function () {
				initFight();
			},
			h: function(){ removePopped(); send("rem_popped"); }
		};
		
		gui.add( parameters, 'a' ).name('Confeti explosion');
		gui.add( parameters, 'b' ).name('Remove confeti');		

		
		var ring_folder = gui.addFolder('Ring options');

		ring_folder.add( baseRing.material, 'shininess' , 0, 50).step(1).name('Ring shininess');

		ring_folder.add( parameters, 'h' ).name('Clean');

		var change_color = ring_folder.addColor( parameters, 'e' ).name('Ring Color');

		change_color.onChange( function( colorValue  )
 	    {
 	      changeRingColor(colorValue);
 	    });

		ring_folder.add( parameters, 'f' ).name('Send color');
		ring_folder.close();
		
		// manera de hacer un grupo de parametros
		var folder = gui.addFolder('Camera position');
		folder.add(parameters, 'd').name('Default camera');
		folder.add( camera.position , 'x', -10, 50 ).step(1);
		folder.add( camera.position , 'y', -10, 50 ).step(1);
		folder.add( camera.position , 'z', -10, 50 ).step(1);
		folder.close();

		// inicialmente los controles cerrados
		gui.close();

		// Start
		startTime = Date.now();
	}

	function collides(mesh){

		var originPoint = mesh.position.clone();
		var localVertex = mesh.geometry.vertices[0].clone(); // solo utilizamos el primer vertex para la colision
		var globalVertex = localVertex.applyMatrix4( mesh.matrix );
		var directionVector = globalVertex.sub( mesh.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
			return true;
		}
	}

	function onWindowResize() {
		camera.aspect = tam.width / tam.height;
		camera.updateProjectionMatrix();
		renderer.setSize( tam.width, tam.height );
	}

	function animate() {
		var currentTime = performance.now();
		var time = ( currentTime - startTime ) / 1000;
		requestAnimationFrame( animate );

    	for(var i = 0; i < confeti_list.length; i++)
    	{
			if(confeti_list[i].position.y < 1.5){
    			if(!collides(confeti_list[i])){
    				confeti_list[i].position.y -= 0.03;
					confeti_list[i].rotation.x = Math.random() * time;
					confeti_list[i].rotation.y = Math.random() * time;
					confeti_list[i].scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );
    			}
			}else{
				confeti_list[i].position.y -= 0.03;
				confeti_list[i].rotation.x = Math.random()  * time;
				confeti_list[i].rotation.y = Math.random()  * time;
				confeti_list[i].scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );
			}

			if(confeti_list[i].position.y < 0){
				scene.remove(confeti_list[i])
			}
    	}

		renderer.render( scene, camera );

		var groupPosition = {
			px: camera.position.x,
			py: camera.position.y,
			pz: camera.position.z,
			info: 10
		}

		// LIGHT AND SPHERE MOVEMENTS

		// a veces carga antes --> evitamos fallos	
		if(scene.getObjectByName("player")){
			scene.getObjectByName("player").position.x = camera.position.x;
			scene.getObjectByName("player").position.y = camera.position.y;
			scene.getObjectByName("player").position.z = camera.position.z;
		}

		// PASSING POSITION TO OTHERS TO PRINT IT
		if(window.server_on) server.sendMessage(groupPosition);

		// PLAYER IN RING MOVEMENTS

		if(scene.getObjectByName("player_body")){

			var px = scene.getObjectByName("player_body").position.x;
			var pz = scene.getObjectByName("player_body").position.z;

			if(w && movementLimits(px, pz - 0.1)) scene.getObjectByName("player_body").position.z -= 0.1;
			if(a && movementLimits(px - 0.1, pz)) scene.getObjectByName("player_body").position.x -= 0.1;
			if(s && movementLimits(px, pz + 0.1)) scene.getObjectByName("player_body").position.z += 0.1;
			if(d && movementLimits(px + 0.1, pz)) scene.getObjectByName("player_body").position.x += 0.1;

			if(k) scene.getObjectByName("player_body").rotation.y += 0.05;
			if(l) scene.getObjectByName("player_body").rotation.y -= 0.05;

			var playerPosition = {
				px : scene.getObjectByName("player_body").position.x,
				py : scene.getObjectByName("player_body").position.y,
				pz : scene.getObjectByName("player_body").position.z,
				ry : scene.getObjectByName("player_body").rotation.y,
				info: 11
			}
		}

		// PASSING POSITION TO OTHERS TO PRINT IT
		if(window.server_on) server.sendMessage(playerPosition);

	}

	init();
	animate();
}
function confetiExplosion(){

	removeConfeti();

	audio.play();
	
	var confetiMat = new THREE.MeshPhongMaterial( {
			color: Math.random() * 0x808008 + 0x808080,
			shininess: 100,
			side: THREE.DoubleSide
		} );

	var confetiGeo = new THREE.BoxGeometry(0.12, 0.01, 0.07);

	for(var i = 0; i < 2000; i++){

		confetiMat = new THREE.MeshPhongMaterial( {
			color: Math.random() * 0x808008 + 0x808080,
			shininess: 100,
			side: THREE.DoubleSide
		} );

		var y = (Math.random() * 30) + 1;
		var x = (Math.random() * 30) + 1;
		var z = (Math.random() * 30) + 1;

		confetiMesh  = new THREE.Mesh( confetiGeo, confetiMat );
		confetiMesh.castShadow = true;
		confetiMesh.rotation.x = (Math.random() * 2 * Math.PI) + 1;
		confetiMesh.position.x = x - 15;
		confetiMesh.position.y = y + 7;
		confetiMesh.position.z = z - 15;
		confeti_list.push(confetiMesh);
		scene.add( confetiMesh );
	}
}

function createFigure(id, colorf, path){

	var group = new THREE.Group();
	group.name = id + "_body";

	var playerBodyMat = new THREE.MeshPhongMaterial( {
			color: colorf,
			shininess: 15,
			side: THREE.DoubleSide
		} ); // -> player

	materials = [

		new THREE.MeshPhongMaterial( {
			color: colorf,
			shininess: 15,
			side: THREE.DoubleSide
		} ),

		new THREE.MeshPhongMaterial( {
			color: colorf,
			shininess: 15,
			side: THREE.DoubleSide
		} ),

		new THREE.MeshPhongMaterial( {
			map: new THREE.TextureLoader().load(path),
			shininess: 15,
			side: THREE.DoubleSide
		} )// -> head
	]


	var playerHeadGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.35, 32);
	var playerBodyGeo = new THREE.BoxGeometry(1, 1.5, 1);
	var playerArmGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.5, 32);
		
	var playerHead = new THREE.Mesh(playerHeadGeo, new THREE.MultiMaterial(materials));
	playerHead.position.y = 3.8;
	playerHead.rotation.x = - Math.PI / 2;   
	playerHead.rotation.y = Math.PI / 2;
	playerHead.castShadow = true;
	group.add(playerHead);

	
	var playerBody = new THREE.Mesh(playerBodyGeo, playerBodyMat);
	playerBody.castShadow = true;
	playerBody.position.y = 2.25;
	group.add(playerBody);

	scene.add(group);
}

function createNewLight(list, colorl, user_id, path){

	var group = new THREE.Group();
	group.name = user_id;

	var spotLight = new THREE.SpotLight( colorl, 0.75 );
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.2;
	spotLight.castShadow = true;


	group.add( spotLight );

	var lightGeometry = new THREE.SphereGeometry( 0.8, 32, 32 );
	var lightMat = new THREE.MeshPhongMaterial( {
			map: new THREE.TextureLoader().load("assets/sphere.png"),
			shininess: 15,
			side: THREE.DoubleSide
		} );
	var light_sphere = new THREE.Mesh( lightGeometry, lightMat );

	if(user_id != "player") group.add( light_sphere );

	group.position.x = list[0];
	group.position.y = list[1];
	group.position.z = list[2];

	// cada uno guarda su propia luz
	window.player = group;

	scene.add(group);

	createFigure(user_id, colorl, path);
}

function createChairs(){

		// Sillas

		var chairMat = new THREE.MeshPhongMaterial( {
				color: 0xffffff,
				shininess: 20,
				specular: 0xffffff,
				side: THREE.DoubleSide
			} );

		var chairGeo = new THREE.BoxGeometry( 1, 1, 1 );

		var chair;

		for(var i = 0.5; i <= 4; i += 1){
			for(var j = -15; j <= 15; j += 1){
				chair  = new THREE.Mesh( chairGeo, chairMat );
				chair.castShadow = true;
				chair.receiveShadow = true;
				chair.position.x = j;
				chair.position.y = i;
				chair.position.z = -15 - i;
				scene.add( chair );
			}
		}

		for(var i = 0.5; i <= 4; i += 1){
			for(var j = -15; j <= 15; j += 1){
				chair  = new THREE.Mesh( chairGeo, chairMat );
				chair.castShadow = true;
				chair.receiveShadow = true;
				chair.position.x = -15 - i;
				chair.position.y = i;
				chair.position.z = j;
				scene.add( chair );
			}
		}

		for(var i = 0.5; i <= 4; i += 1){
			for(var j = -15; j <= 15; j += 1){
				chair  = new THREE.Mesh( chairGeo, chairMat );
				chair.castShadow = true;
				chair.receiveShadow = true;
				chair.position.x = j;
				chair.position.y = i;
				chair.position.z = 15 + i;
				scene.add( chair );
			}
		}

		for(var i = 0.5; i <= 4; i += 1){
			for(var j = -15; j <= 15; j += 1){
				chair  = new THREE.Mesh( chairGeo, chairMat );
				chair.castShadow = true;
				chair.receiveShadow = true;
				chair.position.x = 15 + i;
				chair.position.y = i;
				chair.position.z = j;
				scene.add( chair );
			}
		}
}

function updateMeshPosition(user_id, ox, oy, oz){

	if(scene.getObjectByName(user_id)){
		scene.getObjectByName(user_id).position.x = ox;
		scene.getObjectByName(user_id).position.y = oy;
		scene.getObjectByName(user_id).position.z = oz;
	}
}

function updatePlayerPosition(user_id, ox, oy, oz, ry){

	if(scene.getObjectByName(user_id + "_body")){
		scene.getObjectByName(user_id + "_body").position.x = ox;
		scene.getObjectByName(user_id + "_body").position.y = oy;
		scene.getObjectByName(user_id + "_body").position.z = oz;
		scene.getObjectByName(user_id + "_body").rotation.y = ry;
	}
}

function updateTexture(id, path){
	var head = scene.getObjectByName(id).children[0];
	head.material.materials[2].map = new THREE.ImageUtils.loadTexture(path);
	head.material.needsUpdate = true;
}

function updateRingColor(hex_color){

	baseRing.material.color.setHex(hex_color);
}

function deleteUser(user_id){
	for( var i = 0; i < scene.children.length; i++){
		// borrará la luz(grupo luz + esfera) y el jugador

		if(scene.children[i].name == user_id){
			scene.remove(scene.children[i]);
		}
	}
	for( var i = 0; i < scene.children.length; i++){
		if(scene.children[i].name == (user_id + "_body")){
			scene.remove(scene.children[i]);
		}
	}
}

function removeConfeti(){

	audio.pause();
	audio.currentTime = 0;

	// quitar el confeti anterior
	for( var i = confeti_list.length - 1; i >= 0; i--){
		scene.remove(confeti_list[i]);
	}
}

function removePopped(){
	for( var i = pop_list.length - 1; i >= 0; i--){
		scene.remove(pop_list[i]);
	}
}

function changeRingColor(color) {
  //the return value by the chooser is like as: #ffff so
  //remove the # and replace by 0x
  color = color.replace( '#','0x' );
  //set the color in the object
  baseRing.material.color.setHex(color);
}

function getRingColor(){

	return baseRing.material.color.getHex();
}

function initFight(){

	//begin = true;
}

function popCube(argumentx, argumentz){

	if(!argumentx){
		var px = scene.getObjectByName("player_body").position.x;
		var pz = scene.getObjectByName("player_body").position.z;
	}else{
		var px = argumentx;
		var pz = argumentz;
	}
	
	var poppedGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
	var poppedMat = new THREE.MeshPhongMaterial( {
			color: Math.random() * 0x808008 + 0x808080,
			shininess: 100,
			side: THREE.DoubleSide
	});

	var popped = new THREE.Mesh(poppedGeo, poppedMat);
	popped.position.x = px;
	popped.position.y = 2;
	popped.position.z = pz;
	pop_list.push(popped);
	scene.add(popped);

	if(!argumentx){
		var poppedPosition = {
			x: px,
			z: pz,
			info: 12
		}

		if(window.server_on) server.sendMessage(poppedPosition);
	}
}

var onKeyDown = function (event){

	if(document.activeElement.localName == "textarea" || document.activeElement.localName == "input"){
		return;
	}

	switch(event.keyCode){
		case 87:
			w = true;
			break;
		case 65:
			a = true;
			break;
		case 83:
			s = true;
			break;
		case 68:
			d = true;
			break;
		case 75:
			k = true;
			break;
		case 76:
			l = true;
			break;
	}
}

var onKeyUp = function (event){

	if(document.activeElement.localName == "textarea" || document.activeElement.localName == "input"){
		return;
	}

	switch(event.keyCode){
		case 87:
			w = false;
			break;
		case 65:
			a = false;
			break;
		case 83:
			s = false;
			break;
		case 68:
			d = false;
			break;
		case 75:
			k = false;
			break;
		case 76:
			l = false;
			break;
		case 32:
			popCube();
			break;
		case 67:
			openChat();
			break;
		case 80:
			privateInfo();
			break;
	}
}

function movementLimits(x, z){
	if(x > 4.35 || x < -4.35) return false;
	if(z > 4.5 || z < -4.35) return false;
	return true;
}


document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);	


