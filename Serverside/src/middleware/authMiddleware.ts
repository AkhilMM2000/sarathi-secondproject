import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include the decoded user payload.
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'user' | 'driver' | 'admin';
  };
}


export const protectRoute = (
  allowedRoles: ('user' | 'driver' | 'admin')[] = []
) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
 
   
   
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res.status(401).json({ message: 'No token provided' });
      return  
    }
   

    const token = authHeader.split(' ')[1];


  
    try {
    
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { id: string; email: string; role: 'user' | 'driver' | 'admin' };

      
      
      
      req.user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        res.status(403).json({ message: 'Not authorized to access this route' });
        return;
      }

      next();
    } catch (err:any) {
     
      
  
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
 
    } 
  };
};
