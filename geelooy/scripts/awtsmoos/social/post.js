/**
 * B"H
 */
import * as THREE from "/games/scripts/build/three.module.js";
import {FontLoader} from "/games/scripts/jsm/loaders/FontLoader.js"
import {TextGeometry} from "/games/scripts/jsm/utils/TextGeometry.js";

console.log("B\"H");

var helixRadius = 5;
var helixLength = 100; // You can adjust this based on your needs.
var helixDensity = 100;
class ThreeJSScene {
	framesPassed = 0;
	constructor() {
		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.tunnel = null;
		this.clock = new THREE.Clock();
		this.particleSystem = null;
		this.lettersParticleSystem = null;
		this.pointLight = null;
		this.particlesData = [];
		this.mouse = {
			x: 0,
			y: 0,
			scroll: 0
		};
		
		this.initThreeJS();
		this.initTunnelParticles()
		this.initGalaxy(); // New: creating the gala
	}
	
	initThreeJS() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 14;
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("threejs-canvas")
			.appendChild(this.renderer.domElement);
		
		//this.initTunnel();
		this.initParticles();
		this.initLighting();
		
		// Touch events
		let startY; // For storing the starting touch Y position

		
		document.addEventListener('touchstart', (e) => {
			startY = e.touches[0].clientY;
		}, { passive: true });
	
		document.addEventListener('touchmove', (e) => {
			var currentY = e.touches[0].clientY;
			var deltaY = startY - currentY;
			this.handleTouchScroll(deltaY);
			startY = currentY; // Update startY for the next movement
		}, { passive: true });
	
		document.addEventListener('touchend', () => {
			startY = null; // Reset startY on touch end
		});

		document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
		
		// Post hover
		document.querySelector('.post')
			.addEventListener('mouseenter', () => {
				this.particleSystem.children.forEach((p, index) => {
					gsap.to(p.position, {
						x: p.position.x * 1.5,
						y: p.position.y * 1.5,
						z: p.position.z * 1.5,
						duration: 0.5
					});
					gsap.to(p.scale, {
						x: 2,
						y: 2,
						z: 2,
						duration: 0.5
					});
					gsap.to(p.material.color, {
						r: Math.random(),
						g: Math.random(),
						b: Math.random(),
						duration: 0.5
					});
				});
			});
		
			addEventListener("wheel", this.handleWheel.bind(this), { passive: false });

		document.querySelector('.post')
			.addEventListener('mouseleave', () => {
				this.particleSystem.children.forEach((p, index) => {
					gsap.to(p.position, {
						x: this.particlesData[index].position.x,
						y: this.particlesData[index].position.y,
						z: this.particlesData[index].position.z,
						duration: 0.5
					});
					gsap.to(p.scale, {
						x: 1,
						y: 1,
						z: 1,
						duration: 0.5
					});
					gsap.to(p.material.color, {
						r: 1,
						g: 1,
						b: 1,
						duration: 0.5
					});
				});
			});
		
		
		this.animate();
	}

	setupIntervals() {
		console.log("Hi")
		this.lettersParticleSystem.children.forEach((child,imd) => {
			console.log("Trying",imd,child)
			var changeLetter = () => {
				var randomLetter = this.hebrewLetters[Math.floor(Math.random() * this.hebrewLetters.length)];
				var textGeo = new TextGeometry(randomLetter, {
					font: this.font,
					size: 0.5,
					height: 0.1,
					curveSegments: 12,
				});
				child.geometry.dispose();  // Dispose old geometry
				child.geometry = textGeo;
	
				// Set a random timeout for the next letter change
				var randomTimeout = Math.random() * 2000 + 500; // Adjust as needed, this gives a range of 0.5s to 2.5s
				setTimeout(changeLetter, randomTimeout);
				
			};
	
			// Start the process for this letter
			changeLetter();
		});
	}

	scrollTarget = 0
	handleTouchScroll(deltaY) {
		// Translate touch swipe to scroll and handle it similarly to wheel scroll
		this.scrollTarget += deltaY * 0.005; // Adjust multiplier as needed for sensitivity
	}
	handleWheel(event) {
		// Update the scroll value (adjust 0.005 as needed for scroll speed)
		this.scrollTarget += event.deltaY * 0.005;
		
	}
	
	//method to create a galaxy background.
	
	
	//method to create a galaxy background.
	
	initGalaxy() {
		var particles = new THREE.BufferGeometry;
		var particleCount = 10000; // Increase the particle count for a denser galaxy
		
		var posArray = new Float32Array(particleCount * 3); // Each particle has x, y, z coordinate.
		for (let i = 0; i < particleCount * 3; i++) {
			posArray[i] = (Math.random() - 0.5) * (Math.random() * 100); // Increase the range of random positioning for a more spread-out galaxy
		}
		
		particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
		
		// Change the material to give the galaxy particles a variety of colors and bigger size
		var particleMaterial = new THREE.PointsMaterial({
			size: 0.01, // Increase size for a more visible particle
			color: new THREE.Color("skyblue"),
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			vertexColors: true, // Allows individual color setting for particles
			transparent: true
		});
		
		// Set individual colors for particles
		var colors = [];
		for (let i = 0; i < particleCount; i++) {
			var color = new THREE.Color();
			color.setHSL(Math.random(), 0.7, 0.5); // Hue, Saturation, Lightness
			colors.push(color.r, color.g, color.b);
		}
		particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
		
		var particleMesh = new THREE.Points(particles, particleMaterial);
		this.scene.add(particleMesh);
	}
	
	initTunnel() {
		var geometry = new THREE.CylinderGeometry(5, 1, 100, 128, 1, true);  // Made it longer and tapered more for depth.
	
		var tunnelShader = {
			uniforms: {
				uTime: { value: 0.0 },
				uMouse: { value: 0.0 },  // 0 to 1, to determine depth based on scroll
				uScroll: { value: 0.0 }  // Stores scroll value
			},
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform float uTime;
				uniform float uMouse;
				uniform float uScroll;
				varying vec2 vUv;
				void main() {
					vec2 uv = vUv;
					uv.y = mod(uv.y + uScroll, 1.0);  // Loop the texture based on scroll
					float dist = distance(uv, vec2(0.5, 0.5));
					float noise = (1.0 + sin(uTime + uv.y * 10.0)) * 0.5;
					float pulsating = 0.5 + 0.5 * sin(10.0 * dist - uTime * 2.0 + noise * 2.0);
					float depthColor = smoothstep(0.0, 1.0, uv.y);
					float glow = smoothstep(0.1, 0.6, dist) - smoothstep(0.6, 0.7, dist);  // Inner glow
					float color = glow * pulsating * depthColor;
					gl_FragColor = vec4(vec3(color), 1.0);
				}
			`
		};
	
		var material = new THREE.ShaderMaterial({
			uniforms: tunnelShader.uniforms,
			vertexShader: tunnelShader.vertexShader,
			fragmentShader: tunnelShader.fragmentShader,
			side: THREE.BackSide,
			wireframe: false
		});
	
		this.tunnel = new THREE.Mesh(geometry, material);
		this.tunnel.rotation.x = Math.PI / 2;
		this.scene.add(this.tunnel);
		window.t=this.tunnel
	}
	
	/**
	 * Generates a point on a helix.
	 * If provided, the time seed will move the point along the helix's z-axis.
	 * 
	 * @param {number} t - Current position along the helix.
	 * @param {number} totalLetters - The total number of letters, used to determine the spacing between helix coils.
	 * @param {number} [timeSeed=0] - Optional seed value representing the progression of time (e.g., number of frames passed).
	 * @returns {THREE.Vector3} - A point on the helix.
	 */
	generateHelixPoint = (t, totalLetters, timeSeed = 0, previousZ = 0) => {
		var a = helixRadius;
		var c = helixLength / totalLetters;
	
		var x = a * Math.cos(t * 5);
		var y = a * Math.sin(t * 5);
	
		// Adjust the z-value based on the time seed and previousZ
		var z = (c * t + timeSeed + previousZ) - 50;
	
		return new THREE.Vector3(x, y, z);
	};

	initTunnelParticles() {
	

		
		this.lettersParticleSystem = new THREE.Group();

		var loader = new FontLoader();
		loader.load('/resources/fonts/Tinos_Bold.json', (font) => {
			this.hebrewLetters = 
				"קראטוןןםפףךלחיעכגדשזסבהנמצתץ"
				.split("");

			this.font = font;
			
			for (let i = 0; i < helixDensity; i++) {  // Increased to 500 for more letters
                var letter = this.hebrewLetters[i % this.hebrewLetters.length];
                var randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
                var particleMaterial = new THREE.MeshPhongMaterial({
                    color: randomColor,
                    emissive: randomColor,
                    emissiveIntensity: 1,
                    specular: 0xFFFFFF
                });
                var textGeo = new TextGeometry(letter, {
                    font: font,
                    size: 0.5,
                    height: 0.1,
                    curveSegments: 12,
                });
                var textMesh = new THREE.Mesh(textGeo, particleMaterial);
                var t = i * 0.2;  // Adjust the multiplier as needed for spacing.
                var tSpacing = helixDensity / helixLength; // Adjust based on desired helix density
				var position = this
					.generateHelixPoint
					(i * tSpacing, helixDensity,
						this.framesPassed);

                textMesh.position.set(position.x, position.y, position.z);
    
                textMesh.originalZ = textMesh.position.z;
    
                this.lettersParticleSystem.add(textMesh);
            }
		
			this.setupIntervals();
		}, undefined, e => {
			console.log("Error: ",e)
		});

		this.scene.add(this.lettersParticleSystem);
	}

	initParticles() {
		var particleGeometry = new THREE.SphereGeometry(0.05, 32, 32);
		var particleMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, specular: 0xFFFFFF });
		this.particleSystem = new THREE.Group();
		for (let i = 0; i < 1000; i++) {
			var particleMesh = new THREE.Mesh(particleGeometry, particleMaterial);
			var x = (Math.random() - 0.5) * 20;
			var y = (Math.random() - 0.5) * 20;
			var z = (Math.random() - 0.5) * 20;
			particleMesh.position.set(x, y, z);
			this.particleSystem.add(particleMesh);
			
			// store original data
			this.particlesData.push({
				position: new THREE.Vector3(x, y, z),
				scale: 1,
				color: 0xFFFFFF
			});
		}
		this.scene.add(this.particleSystem);
	}
	
	initLighting() {
		this.pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
		this.pointLight.position.set(0, 0, 5);
		this.scene.add(this.pointLight);
	}
	
	onDocumentMouseMove(event) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
	
	letterDistance = 100;
	letterAmount = 0;
	animate() {
		var delta = this.clock.getDelta();
		this.framesPassed++;
		if(this.framesPassed % 3000 == 0) {
			this.framesPassed = 0;
		}
		this.letterAmount+=15;
		
		this.mouse.scroll = THREE.MathUtils.lerp(this.mouse.scroll, this.scrollTarget, 0.1);
		this.scrollTarget *= 0.9;  // Dampening the scroll effect over time

		if(this.tunnel) {
			this.tunnel.material.uniforms.uMouse.value = (this.mouse.x, this.mouse.y);
			this.tunnel.material.uniforms.uScroll.value = this.mouse.scroll;
		}
		this.particleSystem.rotation.y -= delta * 0.5;
		
		// Move letters in a helix
		if (this.lettersParticleSystem) {
			this.lettersParticleSystem.children.forEach((child, index) => {
				var tSpacing = helixDensity / helixLength;
				var position = this.generateHelixPoint(
					index * tSpacing + this.framesPassed * 0.001, 
					helixDensity,
					this.letterAmount * 0.01,
					//child.position.z // Pass the current z-position of the letter as previousZ
				);
				child.position.set(position.x, position.y, position.z);
				this.letterAmount += this.mouse.scroll;

				if (child.position.z > this.letterDistance) {
					this.letterAmount = 0;
					child.position.z -= helixDensity * tSpacing;  // Reset the position
				} else if(child.position.z < -this.letterDistance) {
					this.letterAmount = 0;
				}
			});
		}
		
		
		// The camera movement gives a more immersive feeling when navigating the tunnel
		this.camera.position.x += (-this.mouse.x * 2 - this.camera.position.x) * 0.05;
		this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.05;
		this.camera.lookAt(this.scene.position);
		
		this.renderer.renderAsync(this.scene, this.camera);
		requestAnimationFrame(this.animate.bind(this));
	}
	
}

//var myScene = new ThreeJSScene();