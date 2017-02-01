var app = {

	/*init: function(){
		console.log("app init");

		var canvas_painter = new CanvasPainter("#painter");
	},*/

	start3D: function(){
		loadCube();
	}
}

var count = 0;

var camera, scene, renderer, startTime;
var baseRing, ground;
var container = document.querySelector(".canvas_container");
var tam = container.getBoundingClientRect();
var confeti_list = []
var collidableMeshList = [];

//var spotLight;
var spotLightSpherePosX = 2;
var spotLightSpherePosY = 4;
var spotLightSpherePosZ = 10;

function loadCube(){
	
	function init() {
		camera = new THREE.PerspectiveCamera(36, tam.width / tam.height, 1, 1000 );
		camera.position.set( 5, 10, 18 );
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x00032 );
		// Lights
		scene.add( new THREE.AmbientLight( 0x505050 ) );

		/*spotLight = new THREE.SpotLight( "red" );
		spotLight.angle = Math.PI / 5;
		spotLight.penumbra = 0.2;
		spotLight.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );
		spotLight.castShadow = true;
		spotLight.shadow.camera.near = 3;
		spotLight.shadow.camera.far = 10;
		scene.add( spotLight );

		spotLight2 = new THREE.SpotLight( "blue" );
		spotLight2.angle = Math.PI / 5;
		spotLight2.penumbra = 0.2;
		spotLight2.position.set( spotLightSpherePosX - 10, spotLightSpherePosY , spotLightSpherePosZ + 5 );
		spotLight2.castShadow = true;
		spotLight2.shadow.camera.near = 3;
		spotLight2.shadow.camera.far = 10;
		scene.add( spotLight2 );*/

		/*var lightGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
		var lightMat1 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		light_sphere = new THREE.Mesh( lightGeometry, lightMat1 );
		light_sphere.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );
		scene.add( light_sphere );

		var lightMat2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		light_sphere2 = new THREE.Mesh( lightGeometry, lightMat2 );
		light_sphere2.position.set( spotLightSpherePosX - 10, spotLightSpherePosY , spotLightSpherePosZ + 5);
		scene.add( light_sphere2 );*/

		var directionalLight = new THREE.DirectionalLight( 0x55505a, 1 );
		directionalLight.position.set( 0, 3, 0 );
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 10;
		scene.add( directionalLight );

		// Objects

		//var floorTexture = new THREE.TextureLoader().load( 'assets/grass_texture.png' );
		var floorGeo = new THREE.PlaneGeometry( 40, 40, 1, 1 )
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
		var baseRingGeo = new THREE.BoxGeometry( 5, 1, 5 );

		baseRing = new THREE.Mesh( baseRingGeo, RingMat );
		baseRing.castShadow = true;
		baseRing.position.x = 0;
		baseRing.position.y = 1;
		scene.add( baseRing );
		collidableMeshList.push(baseRing);

		var cornerRingGeo = new THREE.CylinderGeometry(0.25, 0.25, 3, 32, 32, false);

		// 4 corners
		var cornerRing;
		for(var i = -2.5; i <= 2.5; i += 5){
			for(var j = -2.5; j <= 2.5; j += 5){
				cornerRing  = new THREE.Mesh( cornerRingGeo, RingMat );
				cornerRing.castShadow = true;
				cornerRing.position.x = i;
				cornerRing.position.y = 2;
				cornerRing.position.z = j;
				scene.add( cornerRing );
			}
		}

		// Renderer
		renderer = new THREE.WebGLRenderer();
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
		var canvas_container = document.querySelector(".canvas_container");
		canvas_container.appendChild(gui.domElement);
		gui.domElement.id = "gui_id";
	
		var parameters = 
		{
			a: function(){ confetiExplosion(); send("confeti") },
			b: function(){ removeConfeti(); },
			c: 100, // numeric slider
			e: "#fff000", // color (hex)
			f: function(){ changeRingColor(parameters.e); send("ring_hex", parameters.e) },
		};
		// gui.add( parameters )
		gui.add( parameters, 'a' ).name('Confeti explosion');
		gui.add( parameters, 'b' ).name('Remove confeti');
		gui.add( baseRing.material, 'shininess' , 0, 50).step(1).name('Ring shininess');

		var change_color = gui.addColor( parameters, 'e' ).name('Ring Color');

		change_color.onChange( function( colorValue  )
 	    {
 	      changeRingColor(colorValue);
 	    });

		gui.add( parameters, 'f' ).name('Send color');
		
		// manera de hacer un grupo de parametros
		var folder = gui.addFolder('Camera position');
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
		var currentTime = Date.now();
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
	}
	init();
	animate();
}

function createNewLight(list, colorl, user_id){

	var group = new THREE.Group();
	group.name = user_id;

	var spotLight = new THREE.SpotLight( colorl );
	spotLight.angle = Math.PI / 5;
	spotLight.penumbra = 0.2;
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 3;
	spotLight.shadow.camera.far = 10;

	group.add( spotLight );

	var lightGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
	var lightMat = new THREE.MeshBasicMaterial( {color: colorl } );
	var light_sphere = new THREE.Mesh( lightGeometry, lightMat );

	group.add( light_sphere );

	scene.add(group);
}

function deleteLight(user_id){
	for( var i = 0; i < scene.children.length; i++){
		if(scene.children[i].name == user_id){
			scene.remove(scene.children[i]);
		}
	}
}

function confetiExplosion(){

	removeConfeti();
	
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

function removeConfeti(){

	// quitar el confeti anterior
	for( var i = confeti_list.length - 1; i >= 0; i--){
		scene.remove(confeti_list[i]);
	}
}

function changeRingColor(color) {
  //the return value by the chooser is like as: #ffff so
  //remove the # and replace by 0x
  color = color.replace( '#','0x' );
  //set the color in the object
  baseRing.material.color.setHex(color);
}

function updateRingColor(hex_color){
	baseRing.material.color.setHex(hex_color);
}

function getRingColor(){
	return baseRing.material.color.getHex();
}


