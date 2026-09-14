import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { refreshAccessToken } from '../services/google.service.js';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const sessionToken = req.cookies?.google_session;

  if (!sessionToken) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }



  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ message: 'JWT_SECRET is not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(sessionToken, secret) as {userId : string, refreshToken: string};
    
    if(!decoded.refreshToken){
      res.status(401).json({
        success: false,
        message: "Google access token is not present"
      })
      return 
    }
    
    const accessToken = await refreshAccessToken(decoded.refreshToken)
    
    res.locals.userId = decoded.userId    
    res.locals.googleAccessToken = accessToken    

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    return;
  }
};

export default authenticateToken;
