// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded
let manager = new ZapparThree.LoadingManager();

// Setup ThreeJS in the usual way
let renderer = new THREE.WebGL1Renderer();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Setup a Zappar camera instead of one of ThreeJS's cameras
let camera = new ZapparThree.Camera();

// The Zappar library needs your WebGL context, so pass it
ZapparThree.glContextSet(renderer.getContext());

// Create a ThreeJS Scene and set its background to be the camera background texture
let scene = new THREE.Scene();
scene.background = camera.backgroundTexture;

// Request the necessary permission from the user
 ZapparThree.permissionRequestUI().then(function(granted) {
     if (granted) camera.start();
     else ZapparThree.permissionDeniedUI();
 });

 //Set up our instant tracker group 
  let tracker = new ZapparThree.InstantWorldTracker();
  let trackerGroup = new ZapparThree.InstantWorldAnchorGroup(camera, tracker);
  scene.add(trackerGroup);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(5, 10, 7)
directionalLight.castShadow = true
trackerGroup.add(directionalLight)
trackerGroup.add(new THREE.AmbientLight(0x404040, 4))

let character

// Load Depthkit File
let depthkit = new Depthkit();
			depthkit.load('../assets/dk_single.txt', '../assets/dk_single.mp4',
				dkCharacter => {
					character = dkCharacter;
					dkCharacter.position.set(0, 2, -0.5)
        			dkCharacter.rotation.set(0.6,-0.1 , 0)
        			dkCharacter.scale.set(1, 1, -1)

					// Depthkit video playback control
					depthkit.video.muted = "muted"; // Necessary for auto-play in chrome now
					depthkit.setLoop( true );
					depthkit.play();
					
					//Add the character to the scene
					trackerGroup.add(character);
				});


// Listen for when thee user taps on the placement UI
let hasPlaced = false;
let placementUI = document.getElementById("zappar-placement-ui");
placementUI.addEventListener("click", function() {
    placementUI.remove();
    hasPlaced = true;
})

// Set up our render loop
function render() {
    requestAnimationFrame(render);
    
    camera.updateFrame(renderer);
    if (!hasPlaced) tracker.setAnchorPoseFromCameraOffset(0, 0, -5);

    renderer.render(scene, camera);
}

requestAnimationFrame(render);