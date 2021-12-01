const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(4,1,1);
const material = new THREE.MeshBasicMaterial( { color: 0x00FFFF } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

var dirSwitch = false;

camera.position.z = 5;

const animate = function () {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.04;
    if(cube.rotation.y <= 0.20) cube.rotation.y += 0.02;
    else cube.rotation.y -= 0.04;
    if(cube.position.y >= 2) dirSwitch = true;
    if(cube.position.y <= -2) dirSwitch = false;
    if(dirSwitch) cube.position.y -= 0.01;
    else cube.position.y += 0.01;

    cube.scale = mouse.x/screen.width;
    // if(cube.scale.z >= 0.5) cube.scale.z -= 0.05;
    // else cube.scale.z += 0.05;
    // if(cube.scale.y >= 0.5) cube.scale.y -= 0.05;
    // else cube.scale.y += 0.05;
    // if(cube.scale.x >= 0.5) cube.scale.x -= 0.05;
    // else cube.scale.x += 0.05;

	renderer.render( scene, camera );
};

animate();