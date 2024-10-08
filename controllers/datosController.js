const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');



// ------- ***** RENDER ***** ------- /



const pool = new Pool({
    connectionString: 'postgres://avnadmin:AVNS_aG3a1KMG_5SbZLhqNOh@pg-192c8d92-lbanegas93-3975.c.aivencloud.com:20362/defaultdb?sslmode=no-verify',
});
// ------- ***** RENDER ***** ------- /


// ------- ***** VS ***** ------- /
//const connectionString = 'postgresql://datatabasepx_user:aQ03haJ4FmjHl4yVQDwAp13zrb8PTrPN@dpg-crk81d3qf0us73df2u8g-a.oregon-postgres.render.com/datatabasepx';

//const pool = new Pool({
  //connectionString: connectionString,
 // ssl: {
//    rejectUnauthorized: false // Importante para conexiones remotas a bases de datos en servicios de la nube como Render
//  }
//});
// ------- ***** VS ***** ------- /

const login = async (req, res) => {
  try {
    const query = 'SELECT * FROM public.px'; 
    const result = await pool.query(query);
    console.log(result);
    res.render('login', { data: result.rows }); // Pasar datos a la vista si es necesario
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error.message);
    res.status(500).send('Error en la base de datos');
  }
};


const username = 'liclg';
const passwordHash = '$2y$10$IDUMENJpVGqSHVKl1T5LbeEdEALei5g0f4/CdI1ibo8TveV64dbTm'; 

const loginPost = async (req, res) => {
  try {
    let errors = validationResult(req);
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    // Verificar si el usuario ingresado coincide con el único usuario
    if (enteredUsername === username && await bcrypt.compare(enteredPassword, passwordHash)) {
      res.cookie('username', enteredUsername, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, secure: true });
      req.session.user = enteredUsername;
      res.redirect('/');
    } else {
      errors.errors.push({ param: 'general', msg: 'Usuario y/o contraseña incorrectos' });
      return res.render('login', { errors });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const allpacientes = async (req, res) => {
    try {
      const query = 'SELECT * FROM public.px order by nombreyapellido'; 
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


    if (result.rows.length > 0) {
      const dato = result.rows[0];
      res.render('detallePaciente', { dato });
    } else {
      res.status(404).send('Dato no encontrado');
      res.render('detallePaciente');
    }


  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const hc = async (req, res) => {
  try {
    const id = req.params.id;

    //Requiero datos personales
    const query = 'SELECT * FROM public.px WHERE id = $1' 
    const result = await pool.query(query, [id]);


    //Requiero historia
    const queryHc = 'SELECT * FROM public.historiapx WHERE idPaciente = $1  ORDER BY fecha';
    const resultHc = await pool.query(queryHc, [id]);

    if (result.rows.length > 0 & resultHc.rows.length > 0) {
      const dato = result.rows[0];
      const datoHC = resultHc.rows;
      
      console.log(datoHC)
      res.render('historiaClinica', { dato: dato, datoHC:datoHC  });
    } else {
      res.status(404).send('Historia clínica no encontrada');
    }
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};


const nuevaEntrada = async (req, res) => {
  const resultado = "SELECT historiapx.IDPACIENTE, historiapx.fecha, px.nombreyapellido FROM historiapx INNER JOIN px ON px.id = historiapx.idpaciente WHERE historiapx.fecha = (SELECT MAX(h.fecha)    FROM historiapx h    WHERE h.idpaciente = historiapx.idpaciente);";
  const resultados = await pool.query(resultado);
  console.log(resultados)
  res.render('nuevaEntrada', {resultados: resultados.rows});

};

const nuevaEntradaPost = async (req, res) => {
  try {
    console.log(req.body)
    const { px, fecha, comentario } = req.body;

    const query = 'INSERT INTO public.historiapx (idpaciente, fecha, comentario) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [px, fecha, comentario]);

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
      const {
        nombreyapellido,
        fechaNacimiento,
        documento,
        domicilio,
        nucleoFamiliar,
        telefono,
        telefonoAlternativo,
        antecedentesFamiliares,
        antecedentesPersonales,
        motivoConsulta,
        obraSocial,
        id,
      } = req.body;

  
      const query = `
        UPDATE public.px SET 
        nombreyapellido = $1, 
        fechanacimiento = $2, 
        documento = $3, 
        domicilio = $4, 
        nucleofamiliar = $5, 
        telefono = $6, 
        telefonoalternativo = $7, 
        antecedentesfamiliares = $8, 
        antecedentespersonales = $9, 
        motivoconsulta = $10, 
        obrasocial = $11
        WHERE id = $12
        RETURNING *`;
  
      const values = [
        nombreyapellido,
        fechaNacimiento,
        documento,
        domicilio,
        nucleoFamiliar,
        telefono,
        telefonoAlternativo,
        antecedentesFamiliares,
        antecedentesPersonales,
        motivoConsulta,
        obraSocial,
        id,
      ];
  
      const result = await pool.query(query, values);
  
      


    res.redirect(`/pacientes/`);
  } catch (error) {
    console.error('Error al editar datos del paciente:', error.message);
    res.status(500).send('Error al editar datos del  paciente');
  }
};


const nuevoPaciente = (req, res) => {
  res.render('nuevoPaciente');
};


const nuevoPacientePost = async (req, res) => {
  try {
    const {
      nombreyapellido,
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
      (nombreyapellido, fechanacimiento, documento, domicilio, nucleofamiliar, telefono, telefonoalternativo, antecedentesfamiliares, antecedentespersonales, motivoconsulta, obrasocial) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`;

    const values = [
      nombreyapellido,
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




module.exports = {login, loginPost, allpacientes, detail, hc, nuevaEntrada, nuevaEntradaPost, detalleEditarPaciente, editarPaciente, nuevoPaciente, nuevoPacientePost };
