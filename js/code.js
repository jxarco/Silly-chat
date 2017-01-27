var app = {

	/*init: function(){
		console.log("app init");

		var canvas_painter = new CanvasPainter("#painter");
	},*/

	start3D: function(){
		console.log("loading cubes");
		//loadCube();
		loadTubes();
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

	var camera, scene, renderer, controls;
	var plane;
	var mouse, raycaster;
	var objects = [];

	var tam, container;
	var voxel;
	var light_sphere;
	var animation = true;

	initCube();
	animate();

	function initCube(){

		// Cube
		var cubeColor = "red";
		var cubeMaterial = new THREE.MeshLambertMaterial( { color: cubeColor, overdraw: false, transparent: true, opacity: 0.75 });
		var cubeGeometry = new THREE.BoxGeometry( 30, 30, 30 );
		voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
		voxel.castShadow = true;
		voxel.receiveShadow = false;

		container = document.querySelector(".canvas_container");
		tam = container.getBoundingClientRect();

		var info = document.createElement( 'div' );
		info.style.position = 'absolute';
		info.style.textAlign = 'center';
		info.innerHTML = '<button id="modColor_button"></button>';
		container.appendChild( info );

		var but = document.querySelector("#modColor_button");
		but.innerHTML = "PUSH ME TO CHANGE COLOR";

		but.addEventListener("click", function(){
			if(animation) animation = false;
			else{
				animation = true;
				animate();
			}

			console.log(animation)
		});

		// Camera

		camera = new THREE.PerspectiveCamera( 40, tam.width / tam.height, 1, 10000 );
		camera.position.set( 50, 80, 130 );
		camera.lookAt( new THREE.Vector3() );
		scene = new THREE.Scene();

		scene.add( voxel );

		// Lights
		var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );

		var light_x = 50;
		var light_y = 80;
		var light_z = 130;

		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.x = light_x;
		directionalLight.position.y = light_y;
		directionalLight.position.z = light_z;
		directionalLight.position.normalize();

		directionalLight.castShadow = true;
		directionalLight.shadowDarkness = 0.5;
		directionalLight.shadowCameraVisible = true;

		directionalLight.shadowCameraRight    =  5;
		directionalLight.shadowCameraLeft     = -5;
		directionalLight.shadowCameraTop      =  5;
		directionalLight.shadowCameraBottom   = -5;

		scene.add( directionalLight );

		var lightGeometry = new THREE.SphereGeometry( 5, 32, 32 );
		var lightMat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
		light_sphere = new THREE.Mesh( lightGeometry, lightMat );
		light_sphere.position.set( light_x, light_y, light_z );

		scene.add( light_sphere );

		renderer = new THREE.CanvasRenderer();
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		renderer.setClearColor( 0xffffff );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( tam.width, tam.height );
		container.appendChild(renderer.domElement);
		//

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', render );
	}

	window.addEventListener( 'resize', onWindowResize, false );

	render();

	function onWindowResize() {
		camera.aspect = tam.width / tam.height;
		camera.updateProjectionMatrix();
		renderer.setSize( tam.width, tam.height );
		render();
	}

	function animate() {

		if(animation){
			//voxel.rotation.y += Math.PI * 0.005;
  			controls.update();
  			requestAnimationFrame( animate );
  			render();
		}
	}

	function render() {
	  	
	  	var time = Date.now() * 0.0005;
		light_sphere.position.y += Math.cos( time ) * 0.75;
		renderer.render( scene, camera );
	}
}

function loadTubes(){
	
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

		var dirLight = new THREE.DirectionalLight( 0x55505a, 1 );
		dirLight.position.set( 0, 3, 0 );
		dirLight.castShadow = true;
		dirLight.shadow.camera.near = 1;
		dirLight.shadow.camera.far = 10;
		dirLight.shadow.camera.right = 1;
		dirLight.shadow.camera.left = - 1;
		dirLight.shadow.camera.top	= 1;
		dirLight.shadow.camera.bottom = - 1;
		dirLight.shadow.mapSize.width = 1024;
		dirLight.shadow.mapSize.height = 1024;
		scene.add( dirLight );

		// Plane
		var localPlane = new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0.8 );

		// Geometry
		var material = new THREE.MeshPhongMaterial( {
				color: 0x80ee10,
				shininess: 100,
				side: THREE.DoubleSide,
				// ***** Clipping setup (material): *****
				clippingPlanes: [ localPlane ],
				clipShadows: true
			} );
		var geometry = new THREE.TorusKnotGeometry( 0.4, 0.08, 95, 20 );
		object = new THREE.Mesh( geometry, material );
		object.castShadow = true;
		scene.add( object );

		var ground = new THREE.Mesh(
				new THREE.PlaneBufferGeometry( 9, 9, 1, 1 ),
				new THREE.MeshPhongMaterial( {
					color: 0xa0adaf, shininess: 150 } ) );
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


