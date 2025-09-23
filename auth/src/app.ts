import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { AppDataSource } from './config/data-source';
import * as dotenv from "dotenv";
import authMiddleware from './middlewares/auth.middleware';


dotenv.config();
const app = express();

console.log("variables de entorno")
console.log("DB_URL:", process.env.DB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);


// Inicializar conexión a la base de datos
console.log("iniciando conexion a la base de datos")
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a la base de datos establecida");
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });

console.log("iniciando app")

console.log("Entidades en options:", AppDataSource.options.entities);
console.log("Metadatos cargados:", AppDataSource.entityMetadatas.map(m => m.name));


// Middleware
app.set("trust proxy", 1); // 1 = confiar en el primer proxy (API Gateway)
app.use(cors());
app.use(express.json()); 
app.use(authMiddleware);

console.log("middlewares configurados")
// Rutas
app.use('/auth', authRoutes);

export default app;