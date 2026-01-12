<?php
    /***************************************************
     * API PHP - RESPUESTAS EN JSON
     ***************************************************/
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    header("Content-Type: application/json");

    // CONEXION A LA BASE DE DATOS
    $conn = new mysqli(
        "fdb1032.awardspace.net", // SERVIDOR
        "4717042_catalogo", // USUARIO
        "gMcUe4FC9;Sf0MB*", // CONTRASEÑA
        "4717042_catalogo" // BASE DE DATOS
    );

    // ERROR DE CONEXION
    if ($conn->connect_error) 
    {
        echo json_encode([
            "success" => false,
            "error" => "Error de conexion con la base de datos"
        ]);
        exit;
    }

    // ACCION RECIBIDA
    $action = $_GET["action"] ?? "";

    // DATOS JSON RECIBIDOS
    $data = json_decode(file_get_contents("php://input"), true);

    /***************************************************
     * LISTAR PRODUCTOS
     ***************************************************/
    if ($action === "listar") 
    {
        $result = $conn->query("SELECT * FROM productos");

        if (!$result) 
        {
            echo json_encode([
                "success" => false,
                "error" => "Error al consultar la base de datos"
            ]);
            exit;
        }

        $productos = [];
        while ($row = $result->fetch_assoc()) 
        {
            $productos[] = $row;
        }

        echo json_encode([
            "success" => true,
            "productos" => $productos
        ]);
        exit;
    }

    /***************************************************
     * GUARDAR PRODUCTO
     ***************************************************/
    if ($action === "guardar") 
    {
        $id = $data["id"];
        $nombre = $data["nombre"];
        $precio = $data["precio"];
        $imagen = $data["imagen"];

        // COMPROBAR ID DUPLICADO
        $check = $conn->prepare("SELECT id FROM productos WHERE id = ?");
        $check->bind_param("s", $id);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) 
        {
            echo json_encode([
                "success" => false,
                "error" => "ID duplicado"
            ]);
            exit;
        }

        // INSERTAR PRODUCTO
        $stmt = $conn->prepare("INSERT INTO productos (id, nombre, precio, imagen) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssds", $id, $nombre, $precio, $imagen);
        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Producto guardado correctamente"
        ]);
    }

    /***************************************************
     * BORRAR PRODUCTO
     ***************************************************/
    if ($action === "borrar") 
    {
        $id = $_GET["id"];

        $stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();

        if ($stmt->affected_rows === 0) 
        {
            echo json_encode([
                "success" => false,
                "error" => "El producto no existe"
            ]);
        } 
        else 
        {
            echo json_encode([
                "success" => true
            ]);
        }
    }

    $conn->close();
?>