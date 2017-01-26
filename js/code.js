var app = {

	init: function(){
		console.log("app init");

		var canvas_painter = new CanvasPainter("#painter");
	},

	start3D: function(){
		console.log("loading cubes");
		loadCubes();
	}
}

function loadCubes(){

			var container;
			var camera, scene, renderer;
			var plane;
			var mouse, raycaster, isShiftDown = false;
			var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
			var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff80, overdraw: 0.5 } );
			var objects = [];
			

			container = document.querySelector(".canvas_container");
			var tam = container.getBoundingClientRect();

			console.log(tam.width)
			console.log(tam.height)

			tam.width -= 50;

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
			directionalLight.position.x = Math.random() - 0.5;
			directionalLight.position.y = Math.random() - 0.5;
			directionalLight.position.z = Math.random() - 0.5;
			directionalLight.position.normalize();
			scene.add( directionalLight );
			var directionalLight = new THREE.DirectionalLight( 0x808080 );
			directionalLight.position.x = Math.random() - 0.5;
			directionalLight.position.y = Math.random() - 0.5;
			directionalLight.position.z = Math.random() - 0.5;
			directionalLight.position.normalize();
			scene.add( directionalLight );
			renderer = new THREE.CanvasRenderer();

			renderer.setClearColor( 0xf0f0f0 );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( tam.width, tam.height );
			container.appendChild(renderer.domElement);

			document.addEventListener( 'mousedown', onDocumentMouseDown, false );
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keyup', onDocumentKeyUp, false );
			//
			window.addEventListener( 'resize', onWindowResize, false );

			render();

			function onWindowResize() {
				camera.aspect = tam.width / tam.height;
				camera.updateProjectionMatrix();
				renderer.setSize( tam.width, tam.height );
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
						var voxel = new THREE.Mesh( cubeGeometry, cubeMaterial );
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

			function render() {
				renderer.render( scene, camera );
			}


}