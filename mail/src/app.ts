import express from 'express';
import cors from 'cors';
import appRoutes from './routes/appRoutes';
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
app.use('/mail', appRoutes);

export default app;