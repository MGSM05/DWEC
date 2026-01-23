const API = (() => {

    // Array privado para almacenar productos
    const productos = [];

    // Objeto publico con metodos
    return {

        // Guarda un producto de forma asincrona
        guardarProducto(producto) 
        {
            return new Promise((resolve, reject) => {
                setTimeout(() => {

                    // Comprueba si el ID ya existe
                    const existe = productos.some(p => p.id === producto.id);

                    if (existe) 
                    {
                        reject("Error: El ID ya existe");
                        return;
                    }

                    // Guarda el producto
                    productos.push(producto);
                    resolve("Producto guardado");

                }, 2000); // Simula retardo del servidor
            });
        },

        // Borra un producto por ID de forma asincrona
        borrarProducto(id) 
        {
            return new Promise((resolve, reject) => {
                setTimeout(() => {

                    // Simula error aleatorio
                    const errorAleatorio = Math.random() < 0.1;
                    if (errorAleatorio) 
                    {
                        reject("Error al borrar el producto");
                        return;
                    }

                    // Busca el producto
                    const index = productos.findIndex(p => p.id === id);

                    if (index !== -1) 
                    {
                        // Elimina el producto
                        productos.splice(index, 1);
                        resolve();
                    } 
                    else 
                    {
                        reject("Producto no encontrado");
                    }

                }, 1500); // Simula retardo del servidor
            });
        }
    };

})();
