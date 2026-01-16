// Inicializar mapa
const map = L.map("map").setView([40.4168, -3.7038], 6);

// Capa del mapa
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
{
    attribution: "© OpenStreetMap"
}).addTo(map);

// Inputs
const latInput = document.getElementById("lat");
const lngInput = document.getElementById("lng");

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Array de posiciones
let posiciones = JSON.parse(localStorage.getItem("posiciones")) || [];

// Mostrar coordenadas en tiempo real
map.on("mousemove", (e) => {
    latInput.value = e.latlng.lat.toFixed(5);
    lngInput.value = e.latlng.lng.toFixed(5);
});

// Guardar posicion al hacer click
map.on("click", (e) => {
    const posicion = 
    {
        lat: e.latlng.lat,
        lng: e.latlng.lng
};

    posiciones.push(posicion);
    localStorage.setItem("posiciones", JSON.stringify(posiciones));

    L.marker([posicion.lat, posicion.lng]).addTo(map);

    dibujarCanvas();
});

// Recuperar marcadores al cargar
posiciones.forEach(pos => {
    L.marker([pos.lat, pos.lng]).addTo(map);
});

// Dibujar en canvas
function dibujarCanvas() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    posiciones.forEach((pos, index) => {
        const x = (pos.lng + 180) * (canvas.width / 360);
        const y = (90 - pos.lat) * (canvas.height / 180);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(index + 1, x + 8, y);
    });
}

// Dibujar al cargar la pagina
dibujarCanvas();
