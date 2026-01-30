import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser';
import { Login } from '../../../application/use-cases/auth/Login';
import { MongoUserRepository } from '../../../infrastructure/database/mongodb/repositories/MongoUserRepository';
import { HashService } from '../../../infrastructure/security/HashService';
import { JwtService } from '../../../infrastructure/security/JwtService';
import { Logger } from '../../../infrastructure/logging/Logger';

export class AuthController {
  private userRepository = new MongoUserRepository();
  private hashService = new HashService();
  private jwtService = new JwtService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const registerUser = new RegisterUser(
        this.userRepository,
        this.hashService.hash.bind(this.hashService)
      );

      const user = await registerUser.execute(req.body);

      Logger.info(`[Auth] User registered: ${user.email}`);

      const token = this.jwtService.generate(user.id!, user.role);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
          accessToken: token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const login = new Login(
        this.userRepository,
        this.hashService.compare.bind(this.hashService),
        this.jwtService.generate.bind(this.jwtService)
      );

      const result = await login.execute(req.body);

      Logger.info(`[Auth] User logged in: ${result.user.email}`);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
