import { ConfigService } from '@nestjs/config';
import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { Role } from 'src/roles/role.enum';

@Injectable()
export class ForbiddenMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    try {
      if (!req.headers || !req.headers.authorization) {
        console.log('unauthorized ! ');
      }
      const token = req.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_AT_SECRET'),
      });
      req.user = decoded;
      if (!decoded || !decoded.roles.includes(Role.User)) {
        return res.status(HttpStatus.FORBIDDEN).render('403.hbs', {
          message: 'You do not have permission to access this resource',
        });
      }
      next();
    } catch (error) {
      console.error('Error in ForbiddenMiddleware:', error);
    }
  }
}
