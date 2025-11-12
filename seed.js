import pool from "./db.js";
import { randomUUID } from "crypto";

const insertarDatos = async () => {
  try {
    const dispositivo_id = randomUUID();
    const latitud = -34.6037 + Math.random() * 0.01;
    const longitud = -58.3816 + Math.random() * 0.01;
    const bateria_porcentaje = Math.floor(Math.random() * 100);
    const nivel_senal = Math.floor(Math.random() * 100);

    const query = `
      INSERT INTO dispositivo_log (dispositivo_id, latitud, longitud, bateria_porcentaje, nivel_senal)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [dispositivo_id, latitud, longitud, bateria_porcentaje, nivel_senal];
    const { rows } = await pool.query(query, values);

    console.log("Registro insertado:");
    console.table(rows);

  } catch (err) {
    console.error("Error al insertar:", err);
  } finally {
    pool.end();
  }
};

insertarDatos();
