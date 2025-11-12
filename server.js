import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

//endpoints 

app.get("/", (req, res) => {
  res.send("API de Dispositivos funcionando");
});

app.post("/registrar", async (req, res) => {
  try {
    const { dispositivo_id,
            latitud,
            longitud,
            bateria_porcentaje,
            nivel_senal, 
            velocidad,
            fecha_hora
        } = req.body;

    if(!dispositivo_id) {   
        return res.status(400).json({ error: "dispositivo_id es obligatorio" });
    }
    const query = `
        INSERT INTO dispositivo_log (dispositivo_id, latitud, longitud, bateria_porcentaje, nivel_senal, velocidad, fecha_hora)
        VALUES ($1, $2, $3, $4, $5, $6, $7 )
        RETURNING *;
    `;
    const values = [dispositivo_id, 
        latitud, 
        longitud, 
        bateria_porcentaje, 
        nivel_senal, 
        velocidad || null,
        fecha_hora];
    const { rows } = await pool.query(query, values);

    res.status(201).json({mensaje : "Datos registrados correctamente", data: rows[0]});
  }
    catch (err) {
    //console.error("Error al registrar los datos:", err);
    res.status(500).json({ error: "Error al registrar datos" });
  }
});
//obtener todos los registros
app.get("/registros", async (req, res) => {
    try{
        const {rows} = await pool.query(
            `SELECT * FROM dispositivo_log ORDER BY fecha_hora DESC;`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener datos" });
    }
});

//obtenere utimos datos por dispositivo
app.get("/dispositivos/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const {rows} = await pool.query(
            `SELECT * FROM dispositivo_log WHERE dispositivo_id = $1 ORDER BY fecha_hora DESC LIMIT 10;`,
            [id]
        );
        res.json(rows);

    } catch (err) {
        //console.error("Error al obtener los datos:", err);
        res.status(500).json({ error: "Error al obtener datos" });
    }
});
//consultas query
app.post("/consultar-sql", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Debe enviar una consulta SQL válida" });
    }

    /*// Seguridad básica: solo permitir SELECT
    const sql = query.trim().toLowerCase();
    if (!sql.startsWith("select")) {
      return res.status(400).json({ error: "Solo se permiten consultas SELECT" });
    }*/

    
    const { rows } = await pool.query(query);
    res.json({ resultados: rows });

  } catch (err) {
    console.error("Error ejecutando consulta:", err);
    res.status(500).json({ error: "Error ejecutando la consulta" });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


