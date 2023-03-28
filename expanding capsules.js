import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let scene, camera, renderer, controls;
let stats, clock; // helpers
let light, pointLight;
let capsules = [];
let centerPoint;
let n = 0;


init();
animate();

function init() {


    scene = new THREE.Scene();

    //This creates the camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("sketch-container").appendChild( renderer.domElement );

    //camera interaction controls
    controls = new OrbitControls( camera, renderer.domElement );

    //controls.update() must be called after any manual changes to the camera's transform
    camera.position.set( 8, 13, 20 ); //always looks at center
    controls.update();

    //set up our scene
    light = new THREE.AmbientLight( 0xfffafe ); // soft white light
    scene.add( light );
    pointLight = new THREE.PointLight( 0xfffafe, 1, 100 );
    pointLight.position.set( 10, 10, 10 );
    scene.add( pointLight );
    

    centerPoint = new THREE.Vector3( 0, 0, 0 );
   

    const geometry_03= new THREE.CapsuleGeometry(1, 1, 1, 3);


    const material = new THREE.MeshNormalMaterial();
    
    //create cubes
    for (let x = -700; x <= 500; x += 10) {
        for (let z = -700; z <= 500; z += 10) {

            //this creates cubes?

            const capsule = new THREE.Mesh( geometry_03, material ); 


            capsule.position.x = x;
            capsule.position.y = 1;
            capsule.position.z = z;
            

            scene.add(capsule);
       

            capsules.push(capsule);
         
        }
    }



    


    //help us animate
    clock = new THREE.Clock();

    //For frame rate
    stats = Stats()
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom)
    

    //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    //https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    //https://www.w3schools.com/js/js_htmldom_events.asp
    window.addEventListener('resize', onWindowResize );

}


function animate() {
    renderer.setAnimationLoop( render );
}

function render(){
    stats.begin();

    for (let i = 0; i < capsules.length; i+= 1) {
        let capsule = capsules[i];
        let distance = capsule.position.distanceTo(centerPoint);
        let sine = Math.sin(distance + clock.getElapsedTime()*3);//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
        let height = THREE.MathUtils.mapLinear(sine,-2-n,1,1,2+n);//https://threejs.org/docs/?q=Math#api/en/math/MathUtils
        capsule.scale.y = height;
    }

    n = n + 0.01;

	stats.end();
   
    // required if controls.enableDamping or controls.autoRotate are set to true
	//controls.update();

    renderer.render( scene, camera );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

}

