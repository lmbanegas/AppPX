const express = require('express');
const datosController = require('../controllers/datosController');
const userValidation = require('../middlewares/userValidation')


const router = express.Router();
router.use(userValidation);


//Todos los pacientes
router.get('/', datosController.allpacientes);


//Detalle de paciente
router.get('/detalle/:id', datosController.detail);

//Añadir entrada de HC
router.get('/add', datosController.nuevaEntrada);
router.post('/add', datosController.nuevaEntradaPost);

//Añadir producto
router.get('/nuevo-paciente', datosController.nuevoPaciente);
router.post('/nuevo-paciente', datosController.nuevoPacientePost);

//Editar paciente

router.get('/edit/:id', datosController.detailProductEdit);
router.post('/edit/:id', datosController.productEdit);

//Borrar paciente
router.delete('/edit/:id/delete', datosController.productDelete);


module.exports = router;
