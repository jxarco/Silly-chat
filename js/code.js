var app = {

	/*init: function(){
		console.log("app init");

		var canvas_painter = new CanvasPainter("#painter");
	},*/

	start3D: function(){
		console.log("loading cubes");
		loadCube();
	}
}

function loadCube(){
	
	var camera, scene, renderer, startTime, light_sphere, light_sphere2;
	var container = document.querySelector(".canvas_container");
	var tam = container.getBoundingClientRect();
	var list = []

	var spotLight;
	var spotLightSpherePosX = 2;
	var spotLightSpherePosY = 4;
	var spotLightSpherePosZ = 10;
	
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
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		scene.add( spotLight );

		spotLight2 = new THREE.SpotLight( "blue" );
		spotLight2.angle = Math.PI / 5;
		spotLight2.penumbra = 0.2;
		spotLight2.position.set( spotLightSpherePosX - 10, spotLightSpherePosY , spotLightSpherePosZ + 5 );
		spotLight2.castShadow = true;
		spotLight2.shadow.camera.near = 3;
		spotLight2.shadow.camera.far = 10;
		spotLight2.shadow.mapSize.width = 1024;
		spotLight2.shadow.mapSize.height = 1024;
		scene.add( spotLight2 );

		var lightGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
		var lightMat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		light_sphere = new THREE.Mesh( lightGeometry, lightMat );
		light_sphere.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );
		scene.add( light_sphere );

		light_sphere2 = new THREE.Mesh( lightGeometry, lightMat );
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
		var floorGeo = new THREE.PlaneBufferGeometry( 100, 100, 1, 1 )
		var flootMat = new THREE.MeshPhongMaterial( { color: 0xf1f4f1, shininess: 5 } );

		// Ground
		var ground = new THREE.Mesh(floorGeo, flootMat );
		ground.rotation.x = - Math.PI / 2;
		ground.receiveShadow = true;
		scene.add( ground );

		// BaseRing
		var RingMat = new THREE.MeshPhongMaterial( {
				color: 0xffffff,
				shininess: 100,
				side: THREE.DoubleSide
			} );
		var baseRingGeo = new THREE.BoxGeometry( 5, 1, 5 );

		var baseRing = new THREE.Mesh( baseRingGeo, RingMat );
		baseRing.castShadow = true;
		baseRing.position.x = 0;
		baseRing.position.y = 1;
		scene.add( baseRing );

		var cornerRingGeo = new THREE.CylinderGeometry(0.25, 0.25, 3, 64, 64, false);

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

		confetiExplosion();

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

		// Start
		startTime = Date.now();
	}

	function confetiExplosion(){
		
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
			confetiMesh.position.y = y;
			confetiMesh.position.z = z - 15;
			list.push(confetiMesh);
			scene.add( confetiMesh );
		}
	}

	function onRing(x, z){
		if(x < 2.5 && x > -2.5){
			if(z < 2.5 && z > -2.5){
				return true;
			}
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
		
		/*object.position.y = 0.8;
		object.rotation.x = time * 0.5;
		object.rotation.y = time * 0.2;
		object.scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );*/

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
    		
    		if(list[i].position.y > 0.25)
    			list[i].position.y -= 0.05;
    	}

		renderer.render( scene, camera );
	}
	init();
	animate();
}


