import pool from "./db.js";

const crearTabla = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS dispositivo_log (
      id SERIAL PRIMARY KEY,
      dispositivo_id UUID NOT NULL,
      latitud DECIMAL(10,6),
      longitud DECIMAL(10,6),
      bateria_porcentaje INT,
      nivel_senal INT,
      velocidad DECIMAL(8,3),  
      fecha_hora TIMESTAMPTZ DEFAULT NOW(),  -- ← Cambio aquí
      created_at TIMESTAMPTZ DEFAULT NOW()   -- ← Cambio aquí
    );

    CREATE INDEX IF NOT EXISTS idx_dispositivo_log_dispositivo_id
      ON dispositivo_log (dispositivo_id);

    CREATE INDEX IF NOT EXISTS idx_dispositivo_log_fecha_hora
      ON dispositivo_log (fecha_hora DESC);
  `;

  try {
    await pool.query(query);
    console.log("Migración completada: tabla dispositivo_log creada o ya existente.");
  } catch (err) {
    console.error("Error ejecutando migración:", err);
  } finally {
    pool.end();
  }
};

crearTabla();