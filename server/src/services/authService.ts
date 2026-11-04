import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env.js';
import { UserRepository } from '../repositories/userRepository.js';
import { AuditRepository } from '../repositories/auditRepository.js';
import { prisma } from '../config/prisma.js';

const googleClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export class AuthService {
  static generateTokens(user: { id: string; email: string; role: string; name: string }) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(payload, ENV.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  static async verifyGoogleToken(idToken: string) {
    if (!ENV.GOOGLE_CLIENT_ID) {
      throw new Error('Google OAuth is not configured on this server.');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: ENV.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token payload.');
    }

    // Optional institutional domain restriction
    if (ENV.ALLOWED_EMAIL_DOMAIN) {
      const emailDomain = payload.email.split('@')[1];
      if (emailDomain !== ENV.ALLOWED_EMAIL_DOMAIN) {
        throw new Error(
          `Unauthorized domain: ${emailDomain}. Access restricted to @${ENV.ALLOWED_EMAIL_DOMAIN}`
        );
      }
    }

    const existingUser = await UserRepository.findByEmail(payload.email);
    let role = 'STUDENT';
    if (existingUser) {
      role = existingUser.role;
    } else if (payload.email.includes('admin') || payload.email.includes('faculty')) {
      role = 'ADMIN';
    }

    const user = await UserRepository.upsertGoogleUser({
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      avatarUrl: payload.picture,
      role,
    });

    const tokens = this.generateTokens(user);

    await AuditRepository.logAction({
      actorUserId: user.id,
      action: 'LOGIN_GOOGLE',
      entityType: 'USER',
      entityId: user.id,
    });

    return { user, tokens };
  }

  /**
   * Register a new Student or Faculty with Email
   */
  static async registerWithEmail(data: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    department?: string;
    rollNumber?: string;
  }) {
    const email = (data.email || '').trim().toLowerCase();
    const name = (data.name || '').trim();
    const rawRole = (data.role || 'STUDENT').toUpperCase();
    const role = rawRole === 'FACULTY' || rawRole === 'ADMIN' ? rawRole : 'STUDENT';

    if (!email || !name) {
      throw new Error('Name and email are required for registration.');
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const isStudent = role === 'STUDENT';
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${
          role === 'FACULTY' ? '111B3C' : '5146CD'
        }&color=fff`,
        newsletterSubscriptions: {
          create: {
            email,
            isSubscribed: true,
          },
        },
        studentProfile: {
          create: {
            department: data.department || (isStudent ? 'Computer Science & Engineering' : 'Placement & Training'),
            rollNumber: isStudent ? data.rollNumber || undefined : undefined,
            graduationYear: isStudent ? 2026 : undefined,
            targetRoles: isStudent ? 'Software Development Engineer' : 'Faculty Placement Coordinator',
            prepStreakDays: 1,
            lastActiveDate: new Date(),
          },
        },
      },
      include: {
        studentProfile: true,
        newsletterSubscriptions: true,
      },
    });

    const tokens = this.generateTokens(user);

    await AuditRepository.logAction({
      actorUserId: user.id,
      action: 'REGISTER_EMAIL',
      entityType: 'USER',
      entityId: user.id,
      metadataJson: JSON.stringify({ role: user.role }),
    });

    return { user, tokens };
  }

  /**
   * Login with Email
   */
  static async loginWithEmail(data: { email: string; password?: string }) {
    const email = (data.email || '').trim().toLowerCase();
    if (!email) {
      throw new Error('Email is required.');
    }

    let user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('No account found with this email. Please click "Create Account" to register.');
    }

    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact the placement cell administration.');
    }

    // Refresh streak or last active
    if (user.studentProfile) {
      await prisma.studentProfile.update({
        where: { userId: user.id },
        data: { lastActiveDate: new Date() },
      });
    }

    const tokens = this.generateTokens(user);

    await AuditRepository.logAction({
      actorUserId: user.id,
      action: 'LOGIN_EMAIL',
      entityType: 'USER',
      entityId: user.id,
    });

    return { user, tokens };
  }

  /**
   * Fast Demo Login bypass for seamless testing and review
   * Supports 'student' or 'admin' mode
   */
  static async demoLogin(type: 'student' | 'admin') {
    const email =
      type === 'admin' ? 'admin@educonnect.ac.in' : 'student@educonnect.ac.in';

    let user = await UserRepository.findByEmail(email);

    if (!user) {
      user = await UserRepository.upsertGoogleUser({
        email,
        name: type === 'admin' ? 'Dr. Ramesh Sharma (Placement Dean)' : 'Aarav Patel',
        role: type === 'admin' ? 'ADMIN' : 'STUDENT',
        avatarUrl:
          type === 'admin'
            ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }

    const tokens = this.generateTokens(user);

    await AuditRepository.logAction({
      actorUserId: user.id,
      action: 'LOGIN_DEMO',
      entityType: 'USER',
      entityId: user.id,
    });

    return { user, tokens };
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        ENV.REFRESH_TOKEN_SECRET
      ) as { id: string; email: string; role: string; name: string };

      const user = await UserRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User inactive or not found.');
      }

      const tokens = this.generateTokens(user);
      return { user, tokens };
    } catch {
      throw new Error('Invalid or expired refresh token.');
    }
  }
}
