/***************************************************
 * VALIDAR IMAGEN - Promesa
 ***************************************************/
function validarImagen(url) 
{
    // Crea una promesa que valida si una imagen carga correctamente
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(); // Imagen cargada
        img.onerror = () => reject("La imagen no se puede cargar"); // Error al cargar
        img.src = url;
    });
}

/***************************************************
 * VARIABLES DEL DOM
 ***************************************************/
const form = document.getElementById("productoForm"); // Formulario
const formContainer = document.getElementById("formContainer"); // Contenedor del formulario
const btnAdd = document.getElementById("btnAdd"); // Boton mostrar formulario
const btnSubmit = form.querySelector("button"); // Boton submit

/***************************************************
 * MOSTRAR / OCULTAR FORMULARIO
 ***************************************************/
btnAdd.addEventListener("click", () => {
    // Muestra o oculta el formulario
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
});

/***************************************************
 * SUBMIT DEL FORMULARIO 
 ***************************************************/
form.addEventListener("submit", e => {
    e.preventDefault(); // Evita envio tradicional

    // Obtiene valores del formulario
    const id = prodId.value.trim();
    const nombre = prodNombre.value.trim();
    const desc = prodDesc.value.trim();
    const precio = prodPrecio.value.trim();
    const img = prodImg.files[0];

    limpiarErrores(); // Limpia errores previos
    let valido = true;

    // VALIDACIONES SINCRONAS
    if (!id) 
    { 
        marcarError(prodId, "errId", "ID obligatorio"); 
        valido = false; 
    }

    if (!nombre) 
    { 
        marcarError(prodNombre, "errNombre", "Nombre obligatorio"); 
        valido = false; 
    }

    if (!desc) 
    { 
        marcarError(prodDesc, "errDesc", "Descripcion obligatoria"); 
        valido = false; 
    }

    if (!precio) 
    {
        marcarError(prodPrecio, "errPrecio", "Precio obligatorio");
        valido = false;
    } 
    else if (isNaN(precio) || precio <= 0)
    {
        marcarError(prodPrecio, "errPrecio", "Precio invalido");
        valido = false;
    }

    if (!img) 
    {
        marcarError(prodImg, "errImg", "Imagen obligatoria");
        valido = false;
    }

    if (!valido) return; // Si hay errores se detiene

    // Desactiva boton mientras guarda
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Guardando...";

    const reader = new FileReader();

    // Convierte imagen a base64
    reader.onload = ev => {

        // Objeto producto
        const producto = {
            id, nombre, desc, precio,
            imagen: ev.target.result
        };

        // Guarda producto en API
        API.guardarProducto(producto)
            .then(() => {
                crearProducto(producto); // Crea tarjeta
                form.reset(); // Limpia formulario
            })
            .catch(error => {
                marcarError(prodId, "errId", error);
            })
            .finally(() => {
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Crear";
            });
    };

    reader.readAsDataURL(img); // Lee imagen
});

/***************************************************
 * CREAR TARJETA Y BORRADO ASINCRONO 
 ***************************************************/
function crearProducto({ id, nombre, desc, precio, imagen }) 
{
    // Contenedor del producto
    const card = document.createElement("div");
    card.className = "card";

    // Imagen del producto
    const imgEl = document.createElement("img");
    imgEl.src = imagen;

    // Nombre visible al hacer hover
    const nombreHover = document.createElement("div");
    nombreHover.className = "nombre-hover";
    nombreHover.textContent = nombre;

    // Informacion del producto
    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Precio:</strong> ${precio} €</p>
        <p><strong>Descripcion:</strong> ${desc}</p>
    `;

    // Muestra u oculta info al hacer click
    imgEl.addEventListener("click", () => {
        info.style.display = info.style.display === "none" ? "block" : "none";
    });

    // Borra producto con click derecho
    card.addEventListener("contextmenu", async e => {
        e.preventDefault();
        card.style.opacity = "0.5";

        try 
        {
            await API.borrarProducto(id); // Llama a API
            card.remove(); // Elimina del DOM
        } 
        catch 
        {
            card.style.opacity = "1";
            alert("Error al borrar el producto");
        }
    });

    // Agrega elementos a la tarjeta
    card.append(imgEl, nombreHover, info);
    document.getElementById("catalogo").appendChild(card);
}

/***************************************************
 * FUNCIONES AUXILIARES
 ***************************************************/
function marcarError(input, spanId, mensaje) 
{
    // Muestra mensaje de error y marca input
    document.getElementById(spanId).textContent = mensaje;
    input.classList.add("error-field");
}

function limpiarErrores() 
{
    // Limpia mensajes y estilos de error
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
    document.querySelectorAll(".error-field").forEach(e => e.classList.remove("error-field"));
}
