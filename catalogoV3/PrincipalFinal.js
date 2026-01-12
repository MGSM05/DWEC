/***************************************************
 * VALIDAR IMAGEN (PROMESA ASINCRONA)
 ***************************************************/
function validarImagen(url) 
{
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject("La imagen no se puede cargar");
        img.src = url;
    });
}

/***************************************************
 * GUARDAR PRODUCTO EN BACKEND
 ***************************************************/
async function guardarProductoBackend(producto) 
{
    const response = await fetch("api.php?action=guardar", 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    return await response.json();
}

/***************************************************
 * BORRAR PRODUCTO EN BACKEND
 ***************************************************/
async function borrarProductoBackend(id) 
{
    const response = await fetch(`api.php?action=borrar&id=${id}`);
    return await response.json();
}

/***************************************************
 * CARGAR TODOS LOS PRODUCTOS AL INICIAR
 ***************************************************/
async function cargarProductos() 
{
    try 
    {
        const response = await fetch("api.php?action=listar");
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        if (data.success) 
        {
            // Limpiamos el contenedor antes de pintar (por si acaso)
            contenedor.innerHTML = "";
            data.productos.forEach(producto => pintarProducto(producto));
        } 
        else 
        {
            console.error("Error del servidor:", data.error);
        }
    } 
    catch (error) 
    {
        console.error("Error al cargar productos:", error);
    }
}

/***************************************************
 * VARIABLES DEL DOM
 ***************************************************/
const formulario = document.getElementById("formulario");
const idInput      = document.getElementById("id");
const nombre      = document.getElementById("nombre");
const precio      = document.getElementById("precio");
const imagen      = document.getElementById("imagen");
const btnGuardar  = document.getElementById("btnGuardar");
const contenedor  = document.getElementById("contenedor");

/***************************************************
 * SUBMIT DEL FORMULARIO
 ***************************************************/
formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!idInput.value || !nombre.value || !precio.value || !imagen.value) 
    {
        alert("Todos los campos son obligatorios");
        return;
    }

    if (isNaN(precio.value) || Number(precio.value) <= 0) 
    {
        alert("El precio debe ser un número positivo");
        return;
    }

    const producto = {
        id: idInput.value.trim(),
        nombre: nombre.value.trim(),
        precio: precio.value,
        imagen: imagen.value.trim()};

    try 
    {
        await validarImagen(producto.imagen);

        btnGuardar.disabled = true;
        btnGuardar.textContent = "Guardando...";

        const resultado = await guardarProductoBackend(producto);

        if (resultado.success) 
        {
            pintarProducto(producto);
            formulario.reset();
        } 
        else 
        {
            alert(resultado.error || "Error al guardar el producto");
        }
    } 
    catch (error) 
    {
        alert(error.message || "Error al validar la imagen o conectar con el servidor");
    } 
    finally 
    {
        btnGuardar.disabled = false;
        btnGuardar.textContent = "Guardar";
    }
});

/***************************************************
 * PINTAR PRODUCTO EN EL DOM
 ***************************************************/
function pintarProducto(producto) 
{
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>ID: ${producto.id}</p>
        <p>Precio: ${Number(producto.precio).toFixed(2)} €</p>
    `;

    card.addEventListener("contextmenu", async (e) => {
        e.preventDefault();
        card.style.opacity = "0.5";

        try 
        {
            const resultado = await borrarProductoBackend(producto.id);
            if (resultado.success) 
            {
                card.remove();
            } 
            else 
            {
                card.style.opacity = "1";
                alert(resultado.error || "No se pudo eliminar");
            }
        } 
        catch 
        {
            card.style.opacity = "1";
            alert("Error de conexión al eliminar");
        }
    });

    contenedor.appendChild(card);
}

// Cargar los productos cuando la página termina de cargar
window.addEventListener('load', cargarProductos);