// routes/index.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/datosController');
const userValidation = require('../middlewares/userValidation');
const loginValidation = require('../middlewares/loginValidation');



router.get('/login', loginValidation, controller.loginGet);
router.post('/login',loginValidation, controller.loginPost);

router.use(userValidation);

router.get('/', controller.home);
router.post('/crear-pedido', controller.crearPedido);

module.exports = router;
