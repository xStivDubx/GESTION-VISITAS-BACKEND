import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { AppDataSource } from './config/data-source';
import * as dotenv from "dotenv";
import authMiddleware from './middlewares/auth.middleware';


dotenv.config();
const app = express()

// Inicializar conexión a la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a la base de datos establecida");
    })
    .catch((error) => {
        console.error("Error al conectar a la base de datos:", error);
    });


// Middleware
app.use(cors());
app.use(express.json()); 
app.use(authMiddleware);


// Rutas
app.use('/auth', authRoutes);

export default app;