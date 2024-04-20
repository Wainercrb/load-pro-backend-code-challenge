import { Response, NextFunction } from 'express';
import { MiddlewareRequest } from './auth.middleware';
import { Role } from '@domain/entities/User/User';

export const isAdmin = (req: MiddlewareRequest, res: Response, next: NextFunction) => {
  try {

    console.log('isAdmin', req.user)

    if (!req.user) return res.status(403).json({ message: 'Require Authenticated  User!' });

    if (req.user.role !== Role.admin) return res.status(403).json({ message: 'Require Admin Role User!' });

    next();
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
