import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ChatService } from '../services/chatService.js';
import { ChatRepository } from '../repositories/chatRepository.js';

export class ChatController {
  static async streamMessage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { prompt, sessionId, apiKey: bodyApiKey } = req.body;
      const customApiKey = ((req.headers['x-gemini-key'] as string) || bodyApiKey || '').trim();

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ success: false, error: { message: 'Prompt string is required.' } });
        return;
      }

      // Configure Server-Sent Events (SSE) headers
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      res.flushHeaders?.();

      const result = await ChatService.streamChat(
        userId,
        prompt,
        sessionId,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ type: 'token', chunk })}\n\n`);
          (res as any).flush?.();
        },
        customApiKey || undefined
      );

      // Send completion metadata with session ID and grounded citations
      res.write(
        `data: ${JSON.stringify({
          type: 'done',
          sessionId: result.sessionId,
          citations: result.citations,
        })}\n\n`
      );
      res.end();
    } catch (err) {
      if (!res.headersSent) {
        next(err);
      } else {
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'Stream interrupted' })}\n\n`);
        res.end();
      }
    }
  }

  static async listSessions(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessions = await ChatRepository.getUserSessions(userId);
      res.status(200).json({
        success: true,
        data: { sessions },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSessionMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const messages = await ChatRepository.getSessionMessages(id);
      res.status(200).json({
        success: true,
        data: { messages },
      });
    } catch (err) {
      next(err);
    }
  }

  static async explainQuestion(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { questionId } = req.body;
      const userId = req.user!.id;

      if (!questionId) {
        res.status(400).json({ success: false, error: { message: 'Question ID is required.' } });
        return;
      }

      const result = await ChatService.explainQuestion(questionId, userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async submitFeedback(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageId, rating } = req.body; // 1 or -1
      if (!messageId || ![1, -1].includes(rating)) {
        res.status(400).json({ success: false, error: { message: 'Invalid feedback parameters.' } });
        return;
      }

      const updated = await ChatRepository.setFeedback(messageId, rating);
      res.status(200).json({
        success: true,
        data: { message: updated },
      });
    } catch (err) {
      next(err);
    }
  }
}
