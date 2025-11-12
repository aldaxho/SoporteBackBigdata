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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


