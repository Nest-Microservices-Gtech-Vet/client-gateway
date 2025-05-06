import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('🛠 Token recibido en JwtAuthGuard:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('🚫 Token no proporcionado o formato incorrecto');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('🚫 Token inválido o expirado');
    }
  }
}
