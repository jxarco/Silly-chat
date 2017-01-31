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

var camera, scene, renderer, startTime, light_sphere, light_sphere2;
var baseRing, ground;
var container = document.querySelector(".canvas_container");
var tam = container.getBoundingClientRect();
var list = []
var collidableMeshList = [];

var spotLight;
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

		spotLight = new THREE.SpotLight( "red" );
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
		scene.add( spotLight2 );

		var lightGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
		var lightMat1 = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		light_sphere = new THREE.Mesh( lightGeometry, lightMat1 );
		light_sphere.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );
		scene.add( light_sphere );

		var lightMat2 = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
		light_sphere2 = new THREE.Mesh( lightGeometry, lightMat2 );
		light_sphere2.position.set( spotLightSpherePosX - 10, spotLightSpherePosY , spotLightSpherePosZ + 5);
		scene.add( light_sphere2 );

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
				shininess: 100,
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
		gui.domElement.id = "gui_id";
	
		var parameters = 
		{
			a: function(){ confetiExplosion(); send("confeti") },
			//b: 200, // numeric slider
			//c: "Hello, GUI!", // string
			//d: false, // boolean (checkbox)
			e: "#fff000", // color (hex)
			f: function(){ changeRingColor(parameters.e); send("ring_hex", parameters.e) },
			//w: "...", // dummy value, only type is important
			//x: 0, y: 0, z: 0
		};
		// gui.add( parameters )
		gui.add( parameters, 'a' ).name('Confeti explosion');

		
		//gui.add( parameters, 'b' ).min(128).max(256).step(16).name('Slider');
		//gui.add( parameters, 'c' ).name('String');
		//gui.add( parameters, 'd' ).name('Boolean');
		
		gui.addColor( parameters, 'e' ).name('Color');
		gui.add( parameters, 'f' ).name('Save color');
		
		/*var stringList = ["One", "Two", "Three"];
		gui.add( parameters, 'w', stringList ).name('List');*/
		
		// manera de hacer un grupo de parametros
		var folder = gui.addFolder('Camera position');
		folder.add( camera.position , 'x', -10, 50 ).step(1);
		folder.add( camera.position , 'y', -10, 50 ).step(1);
		folder.add( camera.position , 'z', -10, 50 ).step(1);
		folder.close();
	

		// Start
		startTime = Date.now();
		//confetiExplosion();
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

    	light_sphere2.position.x = 10*Math.cos(time * 0.5) + 0;
    	light_sphere2.position.z = 10*Math.sin(time * 0.5) + 0;

    	spotLight2.position.x = 10*Math.cos(time * 0.5) + 0;
    	spotLight2.position.z = 10*Math.sin(time * 0.5) + 0;

    	light_sphere.position.x = -10*Math.cos(time * 0.5) + 0;
    	light_sphere.position.z = 10*Math.sin(time * 0.5) + 0;

    	spotLight.position.x = -10*Math.cos(time * 0.5) + 0;
    	spotLight.position.z = 10*Math.sin(time * 0.5) + 0;

    	for(var i = 0; i < list.length; i++)
    	{
    		console.log("Comparando")
			if(list[i].position.y < 1.5){
    			if(!collides(list[i])){
    				list[i].position.y -= 0.03;
					list[i].rotation.x = Math.random() * time;
					list[i].rotation.y = Math.random() * time;
					list[i].scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );
    			}
			}else{
				list[i].position.y -= 0.03;
				list[i].rotation.x = Math.random()  * time;
				list[i].rotation.y = Math.random()  * time;
				list[i].scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );
			}

			if(list[i].position.y < 0){
				scene.remove(list[i])
			}
    	}

		renderer.render( scene, camera );
	}
	init();
	animate();
}

function confetiExplosion(){

	// quitar el confeti anterior
	for( var i = list.length - 1; i >= 0; i--){
		scene.remove(list[i]);
	}
	
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
		list.push(confetiMesh);
		scene.add( confetiMesh );
		}
}

function changeRingColor(color) {
  //the return value by the chooser is like as: #ffff so
  //remove the # and replace by 0x
  color = color.replace( '#','0x' );
  //set the color in the object
  baseRing.material.color.setHex(color);
}


