import { NextFunction, Router, Request, Response } from "express";
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { AuthService } from "../services/auth.service";

const router = Router();

// Aplica límite de solicitudes a TODO el middleware (ej. 100 por IP cada 5 min)
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 100, // Máximo 100 solicitudes por IP
    message: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
});


router.use(limiter); // Aplica la limitación a todas las solicitudes que pasen por el middleware

const authService = new AuthService();
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
        res.json({ message: "Favor de iniciar sesión", isLogged: false });
        res.end();
        return;
    }

    const token = authHeader.split('Bearer')[1].trim();

    if (!token) {
        res.status(401)
        res.json({ message: "Favor de iniciar sesión", isLogged: false });
        res.end();
        return
    }

    try {
        // Verificar el token JWT
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        const permissions = await authService.getPermissionByRole(decoded.roleId);

        if (!permissions) {
            res.status(403)
            res.json({ message: "[1]:No tiene permisos para acceder a este modulo", isLogged: false });
            res.end();
            return
        }

        const isPathInResults = permissions.some((result: any) => url.includes(result!.CODE));
        if (!isPathInResults) {
            console.log("[2]No tiene permisos para acceder a este modulo");

            res.status(403)
            res.json({ message: "[2]:No tiene permisos para acceder a este modulo" });
            res.end();
            return
        }

        res.locals.currentUser = decoded;
        next();
    } catch (error) {
        console.error("Error en la verificación del token:", error.message);
        res.status(401)
        res.json({ message: "Favor de iniciar sesión", error: error.message, isLogged: false });
        res.end();
        return
    }
});

export default router;