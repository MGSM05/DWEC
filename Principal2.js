const form = document.getElementById("productoForm");
const formContainer = document.getElementById("formContainer");
const btnAdd = document.getElementById("btnAdd");

// Mostrar / ocultar formulario
btnAdd.addEventListener("click", () => {
    formContainer.style.display =
        formContainer.style.display === "none" ? "block" : "none";
});

// Evento del formulario
form.addEventListener("submit", e => {
    e.preventDefault();

    const id = prodId.value;
    const nombre = prodNombre.value;
    const desc = prodDesc.value;
    const precio = prodPrecio.value;
    const img = prodImg.files[0];

    if (!img) {
        alert("Debes seleccionar una imagen");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(ev){
        crearProducto(id, nombre, desc, precio, ev.target.result);
    };

    reader.readAsDataURL(img);

    form.reset();
});

// Crear tarjeta de producto
function crearProducto(id, nombre, desc, precio, imgBase64)
{
    const card = document.createElement("div");
    card.className = "card";

    const imagen = document.createElement("img");
    imagen.src = imgBase64;
    imagen.style.width = "25%";
    imagen.style.cursor = "pointer";

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Precio:</strong> ${precio} €</p>
        <p><strong>Descripción:</strong> ${desc}</p>
    `;

    imagen.addEventListener("click", () => {
        info.style.display = info.style.display === "none" ? "block" : "none";
    });

    card.appendChild(imagen);
    card.appendChild(info);

    document.getElementById("catalogo").appendChild(card);
}
