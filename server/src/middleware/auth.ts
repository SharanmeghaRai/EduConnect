import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { UserRepository } from '../repositories/userRepository.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required. No token provided.' },
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;

    // Verify user exists and is active
    const user = await UserRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: { code: 'USER_INACTIVE', message: 'User account not found or disabled.' },
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Access token expired. Please refresh session.' },
      });
      return;
    }
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or forged authentication token.' },
    });
  }
};

/**
 * Optional JWT authentication middleware:
 * If a valid token is provided, populates req.user with the authenticated user.
 * If no token or an invalid token is provided, falls back seamlessly to the default scholar
 * account so guest visitors and students can freely use AI assistance without getting blocked by 401 errors.
 */
export const authenticateOptionalJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const raw = authHeader.split(' ')[1];
      if (raw && raw !== 'null' && raw !== 'undefined') {
        token = raw;
      }
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
        const user = await UserRepository.findById(decoded.id);
        if (user && user.isActive) {
          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          };
          return next();
        }
      } catch {
        // Token invalid or expired - proceed to fallback
      }
    }

    // Seamless fallback to seeded student account so AI Mentor works for all visitors
    const defaultStudent = await UserRepository.findByEmail('student@educonnect.ac.in');
    if (defaultStudent) {
      req.user = {
        id: defaultStudent.id,
        email: defaultStudent.email,
        role: defaultStudent.role,
        name: defaultStudent.name,
      };
    }

    next();
  } catch (err) {
    next();
  }
};
