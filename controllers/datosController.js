const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');



// ------- ***** RENDER ***** ------- /



const pool = new Pool({
    connectionString: 'postgres://avnadmin:AVNS_aG3a1KMG_5SbZLhqNOh@pg-192c8d92-lbanegas93-3975.c.aivencloud.com:20362/defaultdb?sslmode=require',
    ssl: {
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUdYoBT2nkHrZdqEVhGyCpgeLJdEIwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvN2FiN2QzNmUtZGQwMS00NTg2LWJhMDItN2EzNDNjMDQ4
Mzg4IFByb2plY3QgQ0EwHhcNMjQwOTEyMTQyNjE0WhcNMzQwOTEwMTQyNjE0WjA6
MTgwNgYDVQQDDC83YWI3ZDM2ZS1kZDAxLTQ1ODYtYmEwMi03YTM0M2MwNDgzODIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANJz4DdU
nnFnGy3FAJhpIFmYQTk85LlZ8G3HlPwa0BNfhYLazHoH9fvqMWUz41GHT+GaDX8D
MSZxl3Ag4q/2mLOFdCegy6zvwAz592n4pjKOLZQADXJYJy1LfMu24hDLaaEW4xup
KNCHikrcleUkgQRrYJSQRuLCvyOCPdb69uypQFnkS+AoeRCA2WIMLHGQtqMgoPlK
Rb3AWWyHUnmTQIxRhY7RF9/ueVEfvPS3A9wH6Q3ZIIzrxa5tL13c2je3SI2NUrSN
N6eV3H/3D48v4veU1rssSI+/kGFmGbheviZVbRXwNueeDd+MQD5Og1+MutSeVeR9
yRlMgE6j+7MQOSd46IvCWfhkzEMRod591qIGKNvGNOiibFQTx6qxSzK+BNXOjE1d
e07/vZzLar+6J+/eHxlGnHl3RMxWbYOdwgm54DVVAAFbxRK9eQ2o+DMX8RgTLidl
uIezrTwfoVwrHlRIui3uJ/EESFoEQ+SwPm+Tdaa4M2beihc0Xs0lXLjvowIDAQAB
oz8wPTAdBgNVHQ4EFgQUDk8Sms3ek0GHXj3u4PGwv1+Wk88wDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAKNr3HFABa5ugZzD
XWIacz41L/xdA8UBFONMIZXAzFgRWCEN4hPFhkVxpqvaSDxBWtmmT5gyRvBNtGq5
FbMco4bvXKGeaXMjScY8ZhqMaVicIeuUACHZbcRfb+jo7MM9FX5hLlwM5FkOB8Hj
r5r7YaFP3Jz6f7AaXVbgNjl/3XP2scPxFlyvm4GgAIIS1GTrTYWJi/l19vf1TwGD
p9xLiFE3LpLbB2xU3ckAOJ1QbNrGlSLOGGePtf2VDoa0pcFMyOHaWCP/AHpEG0c6
gqFOEs8gHFhQjA8Zg5RKWlYdmskf//7i05Ytnw6+8Su09F/1GigWM2c2JlWnNjqu
AgDX+2hchpvabBHVVdm1DLtLTC+fptuuXb85Z7QLLd1z7d3OTQAdTADbJn7miV0h
hG+p21+J9VzTLrscrwxPdPgbS3zD3/BSlrt2zTnQzh3awepBQ1g1LrxPsJOzcuSz
HbpqdEgJuFk0xB1B5L3qjOBkHNEJNpRdrYMP6iKhEatmdmYHmQ==
-----END CERTIFICATE-----`,
        rejectUnauthorized: true // Asegúrate de que esté configurado en true
    }
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
       const query = 'SELECT * FROM public.px'; 
      const result = await pool.query(query);
    console.log(result);
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
