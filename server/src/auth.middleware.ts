import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from './session/session.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly sessionService: SessionService) {}

  async use(req , res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'] as string;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    const session = await this.sessionService.getSessionDetail(token);
    if (!session || session.expireAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Extend session
    await this.sessionService.updateSessionToken(token, { expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    req.user = session.userId; // Attach user ID
    next();
  }
}