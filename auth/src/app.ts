import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import * as dotenv from "dotenv";
import authMiddleware from './middlewares/auth.middleware';


dotenv.config();
const app = express();

// Middleware
app.set("trust proxy", 1); // 1 = confiar en el primer proxy (API Gateway)
app.use(cors());
app.use(express.json()); 
app.use(authMiddleware);

console.log("middlewares configurados")
// Rutas
app.use('/auth', authRoutes);

export default app;