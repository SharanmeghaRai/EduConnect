import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { AuthRequest } from '../middleware/auth.js';
import { UserRepository } from '../repositories/userRepository.js';

export class AuthController {
  static async googleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { credential } = req.body;
      if (!credential) {
        res.status(400).json({
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Google credential ID token required.' },
        });
        return;
      }

      const { user, tokens } = await AuthService.verifyGoogleToken(credential);

      // Set httpOnly SameSite refresh token cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password, role, department, rollNumber } = req.body;
      const { user, tokens } = await AuthService.registerWithEmail({
        name,
        email,
        password,
        role,
        department,
        rollNumber,
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await AuthService.loginWithEmail({ email, password });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async demoLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type = 'student' } = req.body;
      const { user, tokens } = await AuthService.demoLogin(
        type === 'admin' ? 'admin' : 'student'
      );

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'No refresh token available.' },
        });
        return;
      }

      const { user, tokens } = await AuthService.refreshAccessToken(refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      data: { message: 'Successfully logged out.' },
    });
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { message: 'Not authenticated' } });
        return;
      }

      const user = await UserRepository.findById(req.user.id);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }
}
