// Configuración básica
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Función para crear la base poligonal
function poligono(n, R) {
  var angulo = (2 * Math.PI) / n;
  var vertices = [];
  for (let i = 0; i < n; i++) {
    vertices.push(R * Math.cos(i * angulo), 0, R * Math.sin(i * angulo));
  }
  return vertices;
}

// Esta función es para construir el poliedro
function construirPoliedro(n, R, h) {
    var geometria = new THREE.BufferGeometry();
  
    var baseVertices = poligono(n, R);
  
    var vertices = [];
  
    // Vertices de la base inferior
    for (var i = 0; i < baseVertices.length; i += 3) {
      vertices.push(baseVertices[i], baseVertices[i + 1], baseVertices[i + 2]);
    }
  
    // Vertices de la base superior
    var escala = 0.5; // Factor de escala para la base superior
    for (var i = 0; i < baseVertices.length; i += 3) {
      var x = baseVertices[i] * escala;
      var y = baseVertices[i + 1] + h;
      var z = baseVertices[i + 2] * escala;
      vertices.push(x, y, z);
    }
  
    var verticesArray = new Float32Array(vertices);
  
    geometria.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
  
    // Creamos las caras
    var indices = [];
  
    // Caras laterales
    for (var i = 0; i < n; i++) {
      var baseVerticeIndex = i;
      var siguienteBaseVerticeIndex = (i + 1) % n;
      var parteSuperiorVerticeIndex = baseVerticeIndex + n;
      var siguienteParteSuperiorVerticeIndex = siguienteBaseVerticeIndex + n;
  
      indices.push(baseVerticeIndex, siguienteBaseVerticeIndex, parteSuperiorVerticeIndex);
      indices.push(siguienteBaseVerticeIndex, siguienteParteSuperiorVerticeIndex, parteSuperiorVerticeIndex);
      indices.push(parteSuperiorVerticeIndex, siguienteBaseVerticeIndex, siguienteParteSuperiorVerticeIndex); // Agregamos una cara extra para conectar las partes superior e inferior
    }
  
    var indicesArray = new Uint32Array(indices);
  
    geometria.setIndex(new THREE.BufferAttribute(indicesArray, 1));
  
    geometria.computeVertexNormals();
  
    // Material y objeto
    var material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true });
    var poliedro = new THREE.Mesh(geometria, material);
  
    return poliedro;
  }

// Función para crear las 8 pirámides
function crearPiramides() {
  var piramideOriginal = construirPoliedro(6, 1, 2);


  // Pirámides encima del plano xz
  for (var i = 0; i < 4; i++) {
    var piramideEncima = piramideOriginal.clone();
    piramideEncima.position.x = (i - 1.5) * 3;
    scene.add(piramideEncima);
  }

  // Pirámides debajo del plano xz
for (var i = 0; i < 4; i++) {
    var piramideDebajo = piramideOriginal.clone();
    piramideDebajo.position.y = -3;
    piramideDebajo.position.x = (i - 1.5) * 3;
    scene.add(piramideDebajo);
  }
  
}

// Posicionar la cámara
camera.position.z = 10;

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const size = 1000;
const divisions = 1000;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// Renderizar la escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Crear las pirámides
crearPiramides();

// Animar la escena
animate();
