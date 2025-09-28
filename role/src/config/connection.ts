import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

// Crear un pool de conexiones (recomendado para Lambda + MySQL)
export const db = mysql.createPool({
  uri: process.env.DB_URL,  
  waitForConnections: true,
  connectionLimit: 10,       
  queueLimit: 0,
});
