// requisito 5 codigo organizado y comentado

const form = document.getElementById("productoForm");
const formContainer = document.getElementById("formContainer");
const btnAdd = document.getElementById("btnAdd");

// 2 validacion control de ids unicos
const usados = new Set();

// 1 boton añadir producto mostrar y ocultar formulario
btnAdd.addEventListener("click", () => {
    formContainer.style.display =
        formContainer.style.display === "none" ? "block" : "none";
});

// 2 envio del formulario sin recargar pagina
form.addEventListener("submit", e => {
    e.preventDefault();

    const id = prodId.value.trim();
    const nombre = prodNombre.value.trim();
    const desc = prodDesc.value.trim();
    const precio = prodPrecio.value.trim();
    const img = prodImg.files[0];

    limpiarErrores();
    let valido = true;

    // 4 validacion campos obligatorios
    if (id === "") 
    {
        marcarError(prodId, "errId", "ID obligatorio");
        valido = false;
    }

    if (nombre === "") 
    {
        marcarError(prodNombre, "errNombre", "Nombre obligatorio");
        valido = false;
    }

    if (desc === "") 
    {
        marcarError(prodDesc, "errDesc", "Descripcion obligatoria");
        valido = false;
    }

    // 4 validacion del precio
    if (precio === "") 
    {
        marcarError(prodPrecio, "errPrecio", "Precio obligatorio");
        valido = false;
    } 
    else if (isNaN(precio) || Number(precio) <= 0) 
    {
        marcarError(prodPrecio, "errPrecio", "Precio invalido");
        valido = false;
    }

    if (!img) 
    {
        marcarError(prodImg, "errImg", "Imagen obligatoria");
        valido = false;
    }

    // 4 validacion de id unico
    if (usados.has(id)) 
    {
        marcarError(prodId, "errId", "ID repetido");
        valido = false;
    }

    if (!valido) return;

    usados.add(id);

    // 2 conversion de imagen para mostrarla
    const reader = new FileReader();
    reader.onload = function(ev){
        crearProducto(id, nombre, desc, precio, ev.target.result);
    };
    reader.readAsDataURL(img);

    form.reset();
});

// 4 mostrar mensajes junto al campo y marcar en rojo
function marcarError(input, spanId, mensaje) 
{
    document.getElementById(spanId).textContent = mensaje;
    input.classList.add("error-field");
}

function limpiarErrores() 
{
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll(".error-field")
        .forEach(e => e.classList.remove("error-field"));
}

// 2 y 3 creacion dinamica de tarjetas de producto
function crearProducto(id, nombre, desc, precio, imgBase64)
{
    const card = document.createElement("div");
    card.className = "card";

    const imagen = document.createElement("img");
    imagen.src = imgBase64;

    // 3 nombre solo al pasar el raton
    const nombreHover = document.createElement("div");
    nombreHover.className = "nombre-hover";
    nombreHover.textContent = nombre;

    // 4 recuadro con caracteristicas del producto
    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Precio:</strong> ${precio} €</p>
        <p><strong>Descripcion:</strong> ${desc}</p>
    `;

    // 4 evento clic sobre la imagen
    imagen.addEventListener("click", () => {
        info.style.display = info.style.display === "none" ? "block" : "none";
    });

    card.appendChild(imagen);
    card.appendChild(nombreHover);
    card.appendChild(info);

    // 3 añadir producto al grid
    document.getElementById("catalogo").appendChild(card);
}
