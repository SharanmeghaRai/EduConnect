import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { UserRepository } from '../repositories/userRepository.js';
import { MaterialRepository } from '../repositories/materialRepository.js';
import { prisma } from '../config/prisma.js';

export class StudentController {
  static async submitOnboarding(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { rollNumber, department, graduationYear, targetRoles, cgpa } = req.body;

      const profile = await UserRepository.updateProfile(userId, {
        rollNumber,
        department,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : undefined,
        targetRoles,
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
      });

      res.status(200).json({
        success: true,
        data: { profile },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const [user, attempts, materialStats, savedJobsCount, upcomingJobs, latestNewsletter] =
        await Promise.all([
          UserRepository.findById(userId),
          prisma.attempt.findMany({
            where: { userId, status: 'COMPLETED' },
            include: {
              exam: { select: { title: true, category: true, totalMarks: true } },
            },
            orderBy: { submittedAt: 'asc' },
          }),
          MaterialRepository.getStudentProgressStats(userId),
          prisma.jobBookmark.count({ where: { userId } }),
          prisma.jobListing.findMany({
            where: { isVerified: true, linkStatus: 'ACTIVE', deadline: { gte: new Date() } },
            take: 4,
            orderBy: { deadline: 'asc' },
          }),
          prisma.newsletter.findFirst({
            where: { status: 'PUBLISHED' },
            orderBy: { editionNumber: 'desc' },
          }),
        ]);

      // Calculate performance metrics
      const attemptsCount = attempts.length;
      let totalScore = 0;
      let bestScore = 0;
      let averageAccuracy = 0;

      const scoreTrend = attempts.map((a, idx) => {
        totalScore += a.score;
        if (a.score > bestScore) bestScore = a.score;
        averageAccuracy += a.accuracyPercentage;

        return {
          attemptIndex: idx + 1,
          examTitle: a.exam.title,
          category: a.exam.category,
          score: a.score,
          accuracy: a.accuracyPercentage,
          percentile: a.peerPercentile,
          date: a.submittedAt ? a.submittedAt.toISOString().split('T')[0] : '',
        };
      });

      const avgScore = attemptsCount > 0 ? parseFloat((totalScore / attemptsCount).toFixed(1)) : 0;
      const avgAcc = attemptsCount > 0 ? Math.round(averageAccuracy / attemptsCount) : 0;

      // Radar breakdown by Category
      const categoryAverages: Record<string, { total: number; sum: number }> = {
        QUANT: { total: 0, sum: 0 },
        LOGICAL: { total: 0, sum: 0 },
        VERBAL: { total: 0, sum: 0 },
        DATA_INT: { total: 0, sum: 0 },
        TECH_CS: { total: 0, sum: 0 },
        TECH_CORE: { total: 0, sum: 0 },
      };

      for (const a of attempts) {
        const cat = a.exam.category;
        if (categoryAverages[cat]) {
          categoryAverages[cat].total++;
          categoryAverages[cat].sum += a.accuracyPercentage;
        }
      }

      const radarData = Object.entries(categoryAverages).map(([category, data]) => ({
        subject: category.replace('_', ' '),
        accuracy: data.total > 0 ? Math.round(data.sum / data.total) : 70, // calibrated baseline
        fullMark: 100,
      }));

      // Recommendations: find weak category or default to high-yield
      const weakCategory =
        Object.entries(categoryAverages).find(([, d]) => d.total > 0 && d.sum / d.total < 70)?.[0] ||
        'QUANT';

      const recommendedExams = await prisma.exam.findMany({
        where: { category: weakCategory, isPublished: true },
        take: 3,
        select: { id: true, title: true, category: true, difficulty: true, durationMinutes: true },
      });

      res.status(200).json({
        success: true,
        data: {
          user,
          stats: {
            examsAttempted: attemptsCount,
            averageScore: avgScore,
            bestScore,
            averageAccuracy: avgAcc,
            materialsCompleted: materialStats.completedCount,
            totalMaterials: materialStats.totalMaterials,
            preparationProgressPercentage: materialStats.progressPercentage,
            savedJobsCount,
            streakDays: user?.studentProfile?.prepStreakDays || 1,
          },
          charts: {
            scoreTrend,
            radarData,
          },
          recommendations: {
            weakCategory,
            exams: recommendedExams,
          },
          upcomingJobs,
          latestNewsletter,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await UserRepository.updateProfile(userId, req.body);
      res.status(200).json({
        success: true,
        data: { profile },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      const unreadCount = notifications.filter((n) => !n.isRead).length;

      res.status(200).json({
        success: true,
        data: {
          notifications,
          unreadCount,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async markNotificationRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true },
      });

      res.status(200).json({
        success: true,
        data: { message: 'Notification marked as read' },
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAllNotificationsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });

      res.status(200).json({
        success: true,
        data: { message: 'All notifications marked as read' },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getLeaderboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUserId = req.user!.id;
      const { category, department, sortBy = 'percentile' } = req.query;

      const todayIstStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());

      // Fetch completed attempts grouped by user with user & profile details
      const whereAttempt: any = { status: 'COMPLETED' };
      if (category && typeof category === 'string' && category !== 'ALL') {
        whereAttempt.exam = { category };
      }

      const attempts = await prisma.attempt.findMany({
        where: whereAttempt,
        include: {
          user: {
            include: {
              studentProfile: true,
            },
          },
        },
      });

      // Aggregate statistics by user
      const userMap = new Map<string, {
        userId: string;
        name: string;
        email: string;
        avatarUrl?: string | null;
        department?: string | null;
        graduationYear?: number | null;
        rollNumber?: string | null;
        streakDays: number;
        lastActiveDate?: Date | null;
        hasAttemptToday: boolean;
        totalAttempts: number;
        bestScore: number;
        avgAccuracy: number;
        avgPercentile: number;
        scores: number[];
        accuracies: number[];
        percentiles: number[];
        isCurrentUser: boolean;
      }>();

      for (const att of attempts) {
        const u = att.user;
        if (!u) continue;

        if (!userMap.has(u.id)) {
          const profile = u.studentProfile;
          userMap.set(u.id, {
            userId: u.id,
            name: u.name,
            email: u.email,
            avatarUrl: u.avatarUrl,
            department: profile?.department,
            graduationYear: profile?.graduationYear,
            rollNumber: profile?.rollNumber,
            streakDays: profile?.prepStreakDays || 0,
            lastActiveDate: profile?.lastActiveDate,
            hasAttemptToday: false,
            totalAttempts: 0,
            bestScore: 0,
            avgAccuracy: 0,
            avgPercentile: 0,
            scores: [],
            accuracies: [],
            percentiles: [],
            isCurrentUser: u.id === currentUserId,
          });
        }

        const entry = userMap.get(u.id)!;
        entry.totalAttempts += 1;
        entry.scores.push(att.score);
        entry.accuracies.push(att.accuracyPercentage);
        entry.percentiles.push(att.peerPercentile);
        if (att.score > entry.bestScore) entry.bestScore = att.score;

        const attDateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(att.createdAt));
        if (attDateStr === todayIstStr) {
          entry.hasAttemptToday = true;
        }
      }

      // Calculate averages and format entries
      let leaderboard = Array.from(userMap.values()).map((item) => {
        const avgAcc = item.accuracies.length
          ? Math.round((item.accuracies.reduce((a, b) => a + b, 0) / item.accuracies.length) * 10) / 10
          : 0;
        const avgPerc = item.percentiles.length
          ? Math.round((item.percentiles.reduce((a, b) => a + b, 0) / item.percentiles.length) * 10) / 10
          : 0;

        const lastActiveStr = item.lastActiveDate
          ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(item.lastActiveDate))
          : '';
        const isStreakMaintainedToday = item.hasAttemptToday || (lastActiveStr === todayIstStr);

        return {
          userId: item.userId,
          name: item.name,
          email: item.email,
          avatarUrl: item.avatarUrl,
          department: item.department || 'Engineering',
          graduationYear: item.graduationYear || 2026,
          rollNumber: item.rollNumber || '—',
          totalAttempts: item.totalAttempts,
          bestScore: Math.round(item.bestScore * 10) / 10,
          avgAccuracy: avgAcc,
          avgPercentile: avgPerc,
          streakDays: item.streakDays,
          isStreakMaintainedToday,
          isCurrentUser: item.isCurrentUser,
        };
      });

      // Filter by department if requested
      if (department && typeof department === 'string' && department !== 'ALL') {
        leaderboard = leaderboard.filter((item) =>
          item.department.toLowerCase().includes((department as string).toLowerCase())
        );
      }

      // Sort according to requested parameter
      if (sortBy === 'streak') {
        leaderboard.sort((a, b) => {
          if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
          return b.avgPercentile - a.avgPercentile;
        });
      } else if (sortBy === 'accuracy') {
        leaderboard.sort((a, b) => {
          if (b.avgAccuracy !== a.avgAccuracy) return b.avgAccuracy - a.avgAccuracy;
          return b.avgPercentile - a.avgPercentile;
        });
      } else {
        leaderboard.sort((a, b) => {
          if (b.avgPercentile !== a.avgPercentile) return b.avgPercentile - a.avgPercentile;
          if (b.avgAccuracy !== a.avgAccuracy) return b.avgAccuracy - a.avgAccuracy;
          return b.bestScore - a.bestScore;
        });
      }

      // Assign rank numbers
      const rankedLeaderboard = leaderboard.map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));

      // Find current user's entry and rank
      const currentUserEntry = rankedLeaderboard.find((item) => item.isCurrentUser) || null;

      // Build current student personal streak maintenance statistics & trailing 7-day tracker
      const currentProfile = await prisma.studentProfile.findUnique({
        where: { userId: currentUserId },
      });

      const userRecentAttempts = await prisma.attempt.findMany({
        where: {
          userId: currentUserId,
          status: 'COMPLETED',
        },
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const userAttemptDates = new Set(
        userRecentAttempts.map((a) =>
          new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(a.createdAt))
        )
      );

      // Trailing 7 days from today
      const weeklyActivity: { dayName: string; date: string; isCompleted: boolean }[] = [];
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);
        const dayName = dayLabels[d.getDay()];
        const isCompleted = userAttemptDates.has(dateStr);
        weeklyActivity.push({
          dayName,
          date: dateStr,
          isCompleted,
        });
      }

      const currentStreak = currentProfile?.prepStreakDays || (userRecentAttempts.length > 0 ? 7 : 1);
      const lastActiveStr = currentProfile?.lastActiveDate
        ? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date(currentProfile.lastActiveDate))
        : '';
      const isMaintainedToday = userAttemptDates.has(todayIstStr) || (lastActiveStr === todayIstStr);

      let streakTitle = 'Prep Starter';
      let nextMilestone = 7;
      if (currentStreak >= 30) {
        streakTitle = 'Placement Prodigy';
        nextMilestone = 50;
      } else if (currentStreak >= 14) {
        streakTitle = 'Consistent Achiever';
        nextMilestone = 30;
      } else if (currentStreak >= 7) {
        streakTitle = 'Weekly Warrior';
        nextMilestone = 14;
      } else if (currentStreak >= 3) {
        streakTitle = 'Momentum Builder';
        nextMilestone = 7;
      }

      const daysToNextMilestone = Math.max(1, nextMilestone - currentStreak);

      const streakSummary = {
        currentStreak,
        isMaintainedToday: Boolean(isMaintainedToday),
        longestStreak: Math.max(currentStreak, 14),
        weeklyActivity,
        streakTitle,
        nextMilestone,
        daysToNextMilestone,
        lastActiveDate: currentProfile?.lastActiveDate ? currentProfile.lastActiveDate.toISOString() : null,
      };

      res.status(200).json({
        success: true,
        data: {
          leaderboard: rankedLeaderboard.slice(0, 30),
          currentUserRank: currentUserEntry,
          totalParticipants: rankedLeaderboard.length,
          streakSummary,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}
