import Database from '@tauri-apps/plugin-sql';

let db: Database | null = null;

// Interfaz para que TypeScript no de errores
export interface Nota {
  id: number | null;
  titulo: string;
  contenido: string;
  actualizado: string;
}



async function getDB() {
  if (!db) {
    try {
      db = await Database.load("sqlite:mis_notas.db");
      console.log("Base de datos cargada con éxito");
    } catch (error) {
      console.error("ERROR CARGANDO SQLITE:", error);
      throw error;
    }
  }
  return db;
}

export async function eliminarNota(id: number) {
  const instance = await getDB();
  return await instance.execute("DELETE FROM notas WHERE id = $1", [id]);
}



export async function inicializarDB() {
  const instance = await getDB();
  await instance.execute(`
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      contenido TEXT,
      actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function obtenerNotas(): Promise<Nota[]> {
  const instance = await getDB();
  return await instance.select<Nota[]>("SELECT * FROM notas ORDER BY actualizado DESC");
}

export async function guardarNota(id: number | null, titulo: string, contenido: string) {
  const instance = await getDB();
  if (id) {
    return await instance.execute(
      "UPDATE notas SET titulo = $1, contenido = $2, actualizado = CURRENT_TIMESTAMP WHERE id = $3",
      [titulo, contenido, id]
    );
  } else {
    return await instance.execute(
      "INSERT INTO notas (titulo, contenido) VALUES ($1, $2)",
      [titulo, contenido]
    );
  }
}