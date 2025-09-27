import { NextFunction, Router, Request, Response } from "express";
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

const router = Router();

// Aplica límite de solicitudes a TODO el middleware (ej. 100 por IP cada 10 min)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 100, // Máximo 100 solicitudes por IP
    message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
});


router.use(limiter); // Aplica la limitación a todas las solicitudes que pasen por el middleware


router.use(async (req: Request, res: Response, next: NextFunction) => {

    const url = req.url;
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Favor de iniciar sesión",
            isLogged: false
        });
    }

    if (!authHeader.startsWith('Bearer')) {
        res.status(401);
        res.json({ message: "[1]:Favor de iniciar sesión", isLogged: false });
        res.end();
        return;
    }

    const token = authHeader.split('Bearer')[1].trim();

    if (!token) {
        res.status(401)
        res.json({ message: "[2]:Favor de iniciar sesión", isLogged: false });
        res.end();
        return
    }

    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.currentUser = decoded;
        next();
    } catch (error) {
        res.status(401)
        res.json({ message: "[3]:Favor de iniciar sesión", isLogged: false });
        res.end();
        return
    }
}); 

export default router;