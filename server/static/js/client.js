const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

renderer.setAnimationLoop(function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
});

// testing WebXR manager fingerprinting
if ("xr" in navigator) {
    console.log("WebXR is supported");
    const session_types = ["immersive-ar", "immersive-vr", "inline"];
    xr = navigator.xr;
    for (const key in session_types) {
        if (Object.hasOwnProperty.call(session_types, key)) {
            const session_type = session_types[key];
            if (xr.isSessionSupported(session_type)) {
                console.log(`${session_type} supported`);
                xr.requestSession(session_type).then((session) => {
                    console.log(session);
                    session.end();
                }, (error) => {
                    console.log(error)
                });
            }
        }
    }
}