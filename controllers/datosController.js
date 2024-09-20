const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');



// ------- ***** RENDER ***** ------- /

// const pool = new Pool({
//   connectionString: 'postgresql://datatabasepx_user:aQ03haJ4FmjHl4yVQDwAp13zrb8PTrPN@dpg-crk81d3qf0us73df2u8g-a/datatabasepx',
// });
// ------- ***** RENDER ***** ------- /


// ------- ***** VS ***** ------- /
const connectionString = 'postgresql://datatabasepx_user:aQ03haJ4FmjHl4yVQDwAp13zrb8PTrPN@dpg-crk81d3qf0us73df2u8g-a.oregon-postgres.render.com/datatabasepx';

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false // Importante para conexiones remotas a bases de datos en servicios de la nube como Render
  }
});
// ------- ***** VS ***** ------- /

const home = async (req, res) => {
  try {
    console.log('Iniciando consulta...');
    const resultado = "SELECT * FROM public.pacientes";
    const resultados = await pool.query(resultado);
    
    console.log('Consulta exitosa. Resultados:', resultados.rows);
    
    res.render('index', {
      resultados: resultados.rows
    });
  } catch (error) {
    console.error('Error de consulta222:', error.message);
    res.status(500).send('Error de consulta22');
  }
};


const loginGet = async (req, res) => {
  res.render('login')
};


const loginPost = async (req, res) => {
  try {
    let errors = validationResult(req);
    const username = req.body.username;
    const password = req.body.password;

    // Verificar las credenciales en el servidor
    if (username === 'liclg' && password === 'liclg') {
      res.cookie('username', username, { maxAge: 24 * 60 * 60 * 1000 });
      req.session.user = username;
      res.redirect('/');
    } else {
      errors.errors.push({ param: 'general', msg: 'Usuario y/o contraseña incorrectos' });
      console.log(errors)

      return res.render('login', { errors });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const allpacientes = async (req, res) => {
    try {
      const query = 'SELECT * FROM public.px'; 
      const result = await pool.query(query);

      res.render('pacientes', { pacientes: result.rows });


    } catch (error) {
      console.error('Error de consulta:', error.message);
      res.status(500).send('Error de consulta');
    }
  };


const detail = async (req, res) => {
  try {
    const id = req.params.id;

    const query = 'SELECT * FROM public.px WHERE id = $1'
    const result = await pool.query(query, [id]);


    // Verifica si se encontró un resultado
    if (result.rows.length > 0) {
      const dato = result.rows[0];
      res.render('detallePaciente', { dato });
    } else {
      // Si no se encuentra el dato, puedes manejarlo como desees
      res.status(404).send('Dato no encontrado');
    }

    res.render('detallePaciente');


  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const hc = async (req, res) => {
  try {
    // // Obtén el id de los parámetros de la URL
    // const id = req.params.id;

    // // Realiza la consulta SQL con una cláusula WHERE para filtrar por id
    // const query = 'SELECT * FROM public.articulos WHERE id = $1'
    // ;
    // const result = await pool.query(query, [id]);

    // // Verifica si se encontró un resultado
    // if (result.rows.length > 0) {
    //   const dato = result.rows[0];
    //   res.render('productDetail', { dato });
    // } else {
    //   // Si no se encuentra el dato, puedes manejarlo como desees
    //   res.status(404).send('Dato no encontrado');
    // }

    res.render('historiaClinica');


  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const nuevaEntrada = async (req, res) => {

  // const resultado = "SELECT * FROM public.pacientes";
  // const resultados = await pool.query(resultado);
  
  // console.log('Consulta exitosa. Resultados:', resultados.rows);
      

  // res.render('nuevaEntrada', {resultados: resultados.rows});


  // const resultado = "SELECT * FROM public.pacientes";
  // const resultados = await pool.query(resultado);
  
  // console.log('Consulta exitosa. Resultados:', resultados.rows);
      

  res.render('nuevaEntrada');
};

const nuevaEntradaPost = async (req, res) => {
  try {
    // const { px, fecha, comentario } = req.body;

    // const query = 'INSERT INTO public.historiaPX (idpaciente, fecha, comentario) VALUES ($1, $2, $3) RETURNING *';
    // const result = await pool.query(query, [px, fecha, comentario]);

    res.redirect(`/pacientes/`);
  } catch (error) {
    console.error('Error al agregar nueva entrada:', error.message);
    res.status(500).send('Error al agregar entrada');
  }
};


const detalleEditarPaciente = async (req, res) => {
  try {
    const id = req.params.id;

    const query = 'SELECT * FROM public.px WHERE id = $1'
    const result = await pool.query(query, [id]);
    const dato = result.rows[0];


      res.render('editarPaciente', { dato });
  } catch (error) {
    console.error('Error al mostrar formulario de edición:', error.message);
    res.status(500).send('Error al mostrar formulario de edición');
  }
};


const editarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, price, aumento, category } = req.body;

    if (aumento > 0) {
      price = (price * (1 + aumento / 100));
    }

    price = parseFloat(price).toFixed(2);

    // Modificar la consulta para incluir la categoría
    const query = 'UPDATE public.articulos SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
    const result = await pool.query(query, [name, price, category, id]);

    res.redirect(`/pacientes/`);
  } catch (error) {
    console.error('Error al editar datos del paciente:', error.message);
    res.status(500).send('Error al editar datos del  paciente');
  }
};

const pacienteDelete = async (req, res) => {
  try {
    const id = req.params.id;

    const query = 'DELETE FROM public.articulos WHERE id = $1';


    await pool.query(query, [id]);

    console.log('Query:', query);


    res.redirect(`/`);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error');
  }
};


const nuevoPaciente = (req, res) => {
  res.render('nuevoPaciente');
};


const nuevoPacientePost = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      fechaNacimiento,
      documento,
      domicilio,
      nucleoFamiliar,
      telefono,
      telefonoAlternativo,
      antecedentesFamiliares,
      antecedentesPersonales,
      motivoConsulta,
      obraSocial
    } = req.body;

    const query = `
      INSERT INTO px 
      (nombre, apellido, fechanacimiento, documento, domicilio, nucleofamiliar, telefono, telefonoalternativo, antecedentesfamiliares, antecedentespersonales, motivoconsulta, obrasocial) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`;

    const values = [
      nombre,
      apellido,
      fechaNacimiento,
      documento,
      domicilio,
      nucleoFamiliar,
      telefono,
      telefonoAlternativo,
      antecedentesFamiliares,
      antecedentesPersonales,
      motivoConsulta,
      obraSocial
    ];

    const result = await pool.query(query, values);

    res.redirect(`/pacientes/`);
  } catch (error) {
    console.error('Error al añadir nuevo paciente:', error.message);
    res.status(500).send('Error al añadir nuevo paciente');
  }
};




module.exports = {home,loginGet, loginPost, allpacientes, detail, hc, nuevaEntrada, nuevaEntradaPost, detalleEditarPaciente, editarPaciente, pacienteDelete, nuevoPaciente, nuevoPacientePost };
