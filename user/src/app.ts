import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import * as dotenv from "dotenv";
import authMiddleware from './middlewares/auth.middleware';


dotenv.config();
const app = express();

console.log("variables de entorno")
console.log("DB_URL:", process.env.DB_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);



// Middleware
app.set("trust proxy", 1); // 1 = confiar en el primer proxy (API Gateway)
app.use(cors());
app.use(express.json()); 
//app.use(authMiddleware);

console.log("middlewares configurados")
// Rutas
app.use('/user', authRoutes);

export default app;