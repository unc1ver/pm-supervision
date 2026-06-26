 import { Request, Response, NextFunction } from 'express';
 import jwt from 'jsonwebtoken';
 import { JwtPayload } from '../types.js';
 
 const JWT_SECRET = process.env.JWT_SECRET || 'property-group-supervision-secret-key-2026';
 
 export function generateToken(payload: JwtPayload): string {
   return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
 }
 
 export function verifyToken(token: string): JwtPayload {
   return jwt.verify(token, JWT_SECRET) as JwtPayload;
 }
 
 export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
   const authHeader = req.headers.authorization;
   if (!authHeader || !authHeader.startsWith('Bearer ')) {
     res.status(401).json({ error: '未提供认证令牌' });
     return;
   }
 
   const token = authHeader.substring(7);
   try {
     const payload = verifyToken(token);
     (req as any).user = payload;
     next();
   } catch {
     res.status(401).json({ error: '认证令牌无效或已过期' });
   }
 }
