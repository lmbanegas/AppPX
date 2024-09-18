const express = require('express');
const datosController = require('../controllers/datosController');
const userValidation = require('../middlewares/userValidation')


const router = express.Router();
router.use(userValidation);


//Todos los paciente
router.get('/', datosController.allpacientes);


//Detalle de paciente
router.get('/detail/:id', datosController.detail);

//Añadir producto
router.get('/add', datosController.addProduct);
router.post('/add', datosController.addProductPost);

//Añadir producto
router.get('/nuevo-paciente', datosController.nuevoPaciente);
router.post('/nuevo-paciente', datosController.nuevoPacientePost);

//Editar paciente

router.get('/edit/:id', datosController.detailProductEdit);
router.post('/edit/:id', datosController.productEdit);

//Borrar producto
router.delete('/edit/:id/delete', datosController.productDelete);


module.exports = router;
