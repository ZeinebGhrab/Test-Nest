import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(req: any, res: Response, next: NextFunction) {
    console.log('Request...', req.headers.authorization);

    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Missing Authorization Header' });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_AT_SECRET'),
      });
      req.user = decoded;
      console.log('Decoded Token:', decoded);
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send({ message: 'Invalid Token' });
    }
  }
}
