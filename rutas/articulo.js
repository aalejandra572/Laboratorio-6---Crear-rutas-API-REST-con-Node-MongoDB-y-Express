const router = express.Router();
const ArticuloControlador = require("../controladores/articulo");

const almacenamiento = multer.diskStorage({
  destination: function(req,file,cb){
      cb(null, './imagenes/articulos');
  },
  filename: function(req,file,cb) {
      cb(null, "articulo" + Date.now() + file.originalname);
  }
})

const subidas = multer({storage: almacenamiento});

// Crear rutas

// Este middleware capturará todas las solicitudes y las imprimirá en la consola
app.all('*', (req, res, next) => {
  console.log(`Solicitud recibida en la ruta ${req.path}`);
  next(); // Pasa el control al siguiente middleware o ruta
});
// Insertar un artículo (POST)
// Ruta para insertar un artículo con imagen (POST)
app.post("/insert", upload.single('image'), (req, res) => {
  try {
      const imagePath = req.file ? req.file.path : null;

      const newArticle = {
          title: req.body.title,
          content: req.body.content,
          image: imagePath
      };

      console.log("Nuevo artículo:", newArticle);

      res.status(201).send({
          message: "Artículo insertado con imagen",
          data: newArticle
      });

  } catch (error) {
      console.error("Error al insertar el artículo:", error);
      res.status(500).send("Error al insertar el artículo: " + error.message);
  }
});

// Eliminar un artículo (DELETE)
app.delete("/delete/:id", async (req, res) => {
    try {
        const articleId = req.params.id;
        await Article.findByIdAndDelete(articleId);
        console.log("Artículo eliminado correctamente");
        return res.status(200).send(`
          <div>
            <h1>Artículo eliminado</h1>
          </div>
        `);
    } catch (error) {
        return res.status(500).send("Error al eliminar el artículo: " + error.message);
    }
});

// Actualizar un artículo (PUT)
app.put("/update/:id", async (req, res) => {
    try {
        const articleId = req.params.id;
        const updatedArticle = await Article.findByIdAndUpdate(articleId, req.body, { new: true });
        console.log("Artículo actualizado correctamente");
        return res.status(200).send(`
          <div>
            <h1>Artículo actualizado</h1>
          </div>
        `);
    } catch (error) {
        return res.status(500).send("Error al actualizar el artículo: " + error.message);
    }
});

// Buscar/Obtener un artículo (GET)
app.get("/find/:id", async (req, res) => {
    try {
        const articleId = req.params.id;
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).send(`
              <div>
                <h1>Artículo no encontrado</h1>
              </div>
            `);
        }
        console.log("Artículo encontrado");
        return res.status(200).send(`
          <div>
            <h1>Artículo encontrado</h1>
            <p>${JSON.stringify(article)}</p>
          </div>
        `);
    } catch (error) {
        return res.status(500).send("Error al obtener el artículo: " + error.message);
    }
});

//rutas de prueba
router.get("/ruta-de-prueba",ArticuloControlador.prueba);
router.get("/curso",ArticuloControlador.curso);

//ruta util
router.post("/crear",ArticuloControlador.crear);
router.get("/listar",ArticuloControlador.listar);
router.get("/articulo/:id",ArticuloControlador.uno);
router.delete("/borrar/:id",ArticuloControlador.borrar);
router.put("/actualizar/:id",ArticuloControlador.editar);
router.post("/subir-imagen/:id", subidas.single("file0"),ArticuloControlador.subir);


module.exports = router;
