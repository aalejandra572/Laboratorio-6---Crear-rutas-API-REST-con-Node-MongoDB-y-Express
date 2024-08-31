const { conexion } = require("./basededatos/conexion.js");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Inicializar la APP
console.log("Mi API Rest arrancada");

// Inicializar la BD
conexion(); // Asegúrate de que esta función se conecte a la base de datos 'mi blog'

// Crear un servidor Node
const app = express();
const puerto = 3900;

// Configurar los CORS
app.use(cors());

// Convertir body a objeto JS
app.use(express.json());

// Importar el modelo 'Article'
const Article = require('./models/article.js');

const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar la imagen para evitar duplicados
    }
});

// Configurar el filtro de archivos para permitir solo ciertos tipos de imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes en formato JPG, JPEG o PNG'));
    }
};

// Crear el middleware de subida de archivos con multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


// Escuchar peticiones del servidor
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto: " + puerto);
});
