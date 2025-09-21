import jwt from 'jsonwebtoken';


export function createToken(userId: number, roleId: number) {
  //información que se va a guardar en el token
  const payload = {
    id: userId,
    idRole: roleId
  }
  const secret = process.env.JWT_SECRET as string;
  const tokenExpires = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
  
  //se carga la info, el secret y el tiempo de expiración
  return jwt.sign(payload, secret, { expiresIn: tokenExpires })
  
}