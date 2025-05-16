import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🛡️ Required roles:', requiredRoles); // <- log 1

    if (!requiredRoles) {
      return true; // no roles requeridos → permite
    }

    

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('👤 Usuario recibido en RolesGuard:', user); // <- log 2

    if (!user || !user.rol) {
      throw new ForbiddenException('No tiene roles asignados');
    }

    const hasRole = user.rol.some((role: string) => requiredRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('No tiene permisos suficientes');
    }
    console.log('✅ RolesGuard pasó');

    return hasRole;
  }
}
