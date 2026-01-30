import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { config } from '../../config/environment';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError';

export interface JwtPayload {
  userId: string;
  role: string;
}

export class JwtService {
  generate(userId: string, role: string): string {
    const payload: JwtPayload = {
      userId,
      role,
    };

    const expiresIn = config.jwt.expiration as StringValue;

    return jwt.sign(payload, config.jwt.secret, { expiresIn });
  }

  verify(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  decode(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
