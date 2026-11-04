import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireRole = (allowedRoles: string | string[]) => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
      return;
    }

    if (!rolesArray.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Requires one of roles: [${rolesArray.join(', ')}]`,
        },
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN', 'FACULTY']);
