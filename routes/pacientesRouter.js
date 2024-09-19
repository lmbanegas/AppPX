const express = require('express');
const datosController = require('../controllers/datosController');
const userValidation = require('../middlewares/userValidation')


const router = express.Router();
router.use(userValidation);


//Todos los pacientes
router.get('/', datosController.allpacientes);


//Detalle de paciente
router.get('/detalle/:id', datosController.detail);

//Detalle de HC Paciente
router.get('/hc/:id', datosController.hc);

//Añadir entrada de HC
router.get('/add', datosController.nuevaEntrada);
router.post('/add', datosController.nuevaEntradaPost);

//Añadir paciente
router.get('/nuevo-paciente', datosController.nuevoPaciente);
router.post('/nuevo-paciente', datosController.nuevoPacientePost);

//Editar paciente

router.get('/edit/:id', datosController.detalleEditarPaciente);
router.post('/edit/:id', datosController.editarPaciente);

//Borrar paciente
router.delete('/edit/:id/delete', datosController.pacienteDelete);


module.exports = router;
