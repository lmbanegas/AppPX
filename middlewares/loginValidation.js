const { body, validationResult } = require('express-validator');

const loginValidation = [
  body('username').notEmpty().withMessage('El campo de usuario no puede estar vacío'),
  body('password').notEmpty().withMessage('El campo contraseña no puede estar vacío'),

];

module.exports = loginValidation;