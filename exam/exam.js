// Configuración básica
const scene = new THREE.Scene();
// Agregar una luz ambiental
var luzAmbiental = new THREE.AmbientLight(0x404040);
scene.add(luzAmbiental);

// Agregar una luz direccional
var luzDireccional = new THREE.DirectionalLight(0xffffff);
luzDireccional.position.set(1, 1, 1);
scene.add(luzDireccional);

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

    indices.push(baseVerticeIndex, parteSuperiorVerticeIndex, siguienteBaseVerticeIndex);
    indices.push(siguienteBaseVerticeIndex, parteSuperiorVerticeIndex, siguienteParteSuperiorVerticeIndex);
  }

  // Caras base inferior
  for (var i = 1; i < n - 1; i++) {
    indices.push(0, i, i + 1);
  }

  // Caras base superior
  var offset = n;
  for (var i = 1; i < n - 1; i++) {
    indices.push(offset, offset + i + 1, offset + i);
  }

  var indicesArray = new Uint32Array(indices);

  geometria.setIndex(new THREE.BufferAttribute(indicesArray, 1));

  geometria.computeVertexNormals();

  // Material y objeto
  var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
  var poliedro = new THREE.Mesh(geometria, material);

  return poliedro;
}



// Función para crear las 8 pirámides
function crearPiramides() {
  var piramideOriginal = construirPoliedro(5, 1.4, 2.5);
  var ps = []; // Arreglo para las pirámides superiores
  var pi = []; // Arreglo para las pirámides inferiores

  // Pirámides encima del plano xz
  for (var i = 0; i < 4; i++) {
    var piramideEncima = piramideOriginal.clone();
    piramideEncima.position.x = (i - 1.5) * 3;

    // Generar un color aleatorio
    var color = new THREE.Color(Math.random(), Math.random(), Math.random());
    piramideEncima.material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });

    scene.add(piramideEncima);
    ps.push(piramideEncima); // Agregar la pirámide al arreglo de las superiores
  }

  // Pirámides debajo del plano xz
  for (var i = 0; i < 4; i++) {
    var piramideDebajo = piramideOriginal.clone();
    piramideDebajo.position.y = -3;
    piramideDebajo.position.x = (i - 1.5) * 3;

    // Generar un color aleatorio
    var color = new THREE.Color(Math.random(), Math.random(), Math.random());
    piramideDebajo.material = new THREE.MeshPhongMaterial({ color: color, side: THREE.DoubleSide });

    scene.add(piramideDebajo);
    pi.push(piramideDebajo); // Agregar la pirámide al arreglo de las inferiores
  }
}



// Posicionar la cámara
camera.position.z = 6;

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const size = 1000;
const divisions = 1000;


// Renderizar la escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Crear las pirámides
crearPiramides();

// Animar la escena
animate();
