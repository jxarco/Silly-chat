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

function loadCubes(){

	var camera, scene, renderer, controls;
	var plane;
	var mouse, raycaster, isShiftDown = false;

	var cubeColor, cubeMaterial, cubeGeometry;

	var objects = [];

	initCubes();
	animate();

	function initCubes(){

		cubeColor = "green";
		cubeMaterial = new THREE.MeshLambertMaterial( { color: cubeColor, overdraw: 0.5 });
		cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );

		var container = document.querySelector(".canvas_container");
		var tam = container.getBoundingClientRect();

		var info = document.createElement( 'div' );
		info.style.position = 'absolute';
		info.style.textAlign = 'center';
		info.innerHTML = '<button id="modColor_button"></button>';
		container.appendChild( info );

		var but = document.querySelector("#modColor_button");
		but.innerHTML = "PUSH ME TO CHANGE COLOR";

		but.addEventListener("click", function(){
			cubeColor = "red";
		});

		camera = new THREE.PerspectiveCamera( 40, tam.width / tam.height, 1, 10000 );
		camera.position.set( 500, 800, 1300 );
		camera.lookAt( new THREE.Vector3() );
		scene = new THREE.Scene();
		// Grid
		var size = 500, step = 50;
		var geometry = new THREE.Geometry();
		for ( var i = - size; i <= size; i += step ) {
			geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
			geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
			geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
			geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
		}
		var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );
		var line = new THREE.LineSegments( geometry, material );
		scene.add( line );
		//
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
		geometry.rotateX( - Math.PI / 2 );
		plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
		scene.add( plane );
		objects.push( plane );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

		// Lights
		var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );

		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.x = 0.15;
		directionalLight.position.y = 0.75;
		directionalLight.position.z = 0.60;
		directionalLight.position.normalize();
		scene.add( directionalLight );

		var directionalLight = new THREE.DirectionalLight( 0xbfbfbf );
		directionalLight.position.x = -0.25;
		directionalLight.position.y = 0.80;
		directionalLight.position.z = -0.50;
		directionalLight.position.normalize();
		scene.add( directionalLight );

		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( tam.width, tam.height );
		container.appendChild(renderer.domElement);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render );


		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		document.addEventListener( 'keyup', onDocumentKeyUp, false );
		//
		window.addEventListener( 'resize', onWindowResize, false );

		render();

	}

	function onDocumentMouseDown( event ) {
		event.preventDefault();
		mouse.x = ( event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( event.offsetY / renderer.domElement.clientHeight ) * 2 + 1;
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( objects );
		if ( intersects.length > 0 ) {
			var intersect = intersects[ 0 ];
			if ( isShiftDown ) {
				if ( intersect.object != plane ) {
					scene.remove( intersect.object );
					objects.splice( objects.indexOf( intersect.object ), 1 );
				}
			} else {
				var voxel = new THREE.Mesh( cubeGeometry, new THREE.MeshLambertMaterial( { color: cubeColor, overdraw: 0.5 }) );
				voxel.position.copy( intersect.point ).add( intersect.face.normal );
				voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
				scene.add( voxel );
				objects.push( voxel );
			}
			render();
		}
	}

	function onDocumentKeyDown( event ) {
		switch( event.keyCode ) {
			case 16: isShiftDown = true; break;
		}
	}

	function onDocumentKeyUp( event ) {
		switch( event.keyCode ) {
			case 16: isShiftDown = false; break;
		}
	}

	function onWindowResize() {
		camera.aspect = tam.width / tam.height;
		camera.updateProjectionMatrix();
		renderer.setSize( tam.width, tam.height );
		render();
	}

	function animate() {

  		requestAnimationFrame( animate );
  		controls.update();
	}

	function render() {
	  renderer.render( scene, camera );
	}
}

function loadCube(){
	
	var camera, scene, renderer, startTime, object, light_sphere;
	var container = document.querySelector(".canvas_container");
	var tam = container.getBoundingClientRect();

	var spotLight;
	var spotLightSpherePosX = 2;
	var spotLightSpherePosY = 4;
	var spotLightSpherePosZ = 3;
	
	function init() {
		camera = new THREE.PerspectiveCamera(36, tam.width / tam.height, 1, 1000 );
		camera.position.set( 0, 1.3, 3 );
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xa7f1ff );
		// Lights
		scene.add( new THREE.AmbientLight( 0x505050 ) );

		spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.angle = Math.PI / 5;
		spotLight.penumbra = 0.2;
		spotLight.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );
		spotLight.castShadow = true;
		spotLight.shadow.camera.near = 3;
		spotLight.shadow.camera.far = 10;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		scene.add( spotLight );

		var lightGeometry = new THREE.SphereGeometry( 0.25, 32, 32 );
		var lightMat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		light_sphere = new THREE.Mesh( lightGeometry, lightMat );
		light_sphere.position.set( spotLightSpherePosX, spotLightSpherePosY, spotLightSpherePosZ );

		scene.add( light_sphere );

		var directionalLight = new THREE.DirectionalLight( 0x55505a, 1 );
		directionalLight.position.set( 0, 3, 0 );
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.near = 1;
		directionalLight.shadow.camera.far = 10;
		directionalLight.shadow.camera.right = 1;
		directionalLight.shadow.camera.left = - 1;
		directionalLight.shadow.camera.top	= 1;
		directionalLight.shadow.camera.bottom = - 1;
		directionalLight.shadow.mapSize.width = 1024;
		directionalLight.shadow.mapSize.height = 1024;
		scene.add( directionalLight );

		// Plane
		var localPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0.8 );

		// Geometry
		var objectMat = new THREE.MeshPhongMaterial( {
				color: 0xffffff,
				shininess: 100,
				side: THREE.DoubleSide
			} );
		//var objectGeo = new THREE.TorusKnotGeometry( 0.4, 0.08, 95, 20 );
		var objectGeo = new THREE.BoxGeometry( 0.75, 0.75, 0.75 );

		// Object
		object = new THREE.Mesh( objectGeo, objectMat );
		object.castShadow = true;
		scene.add( object );


		var floorTexture = new THREE.TextureLoader().load( 'assets/grass_texture.png' );
		var floorGeo = new THREE.PlaneBufferGeometry( 100, 100, 1, 1 )
		var flootMat = new THREE.MeshPhongMaterial( { map: floorTexture, shininess: 150 } );

		// Ground
		var ground = new THREE.Mesh(floorGeo, flootMat );
		ground.rotation.x = - Math.PI / 2; // rotates X/Y to X/Z
		ground.receiveShadow = true;
		scene.add( ground );

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
	function onWindowResize() {
		camera.aspect = tam.width / tam.height;
		camera.updateProjectionMatrix();
		renderer.setSize( tam.width, tam.height );
	}
	function animate() {
		var currentTime = Date.now();
		var time = ( currentTime - startTime ) / 1000;
		requestAnimationFrame( animate );
		object.position.y = 0.8;
		object.rotation.x = time * 0.5;
		object.rotation.y = time * 0.2;
		object.scale.setScalar( Math.cos( time ) * 0.125 + 0.875 );

		light_sphere.position.y += Math.cos( time ) * 0.05;
		spotLight.position.y += Math.cos( time ) * 0.05;

		renderer.render( scene, camera );
	}
	init();
	animate();
}


