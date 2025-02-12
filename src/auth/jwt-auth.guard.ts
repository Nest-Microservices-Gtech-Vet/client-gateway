import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    let authHeader;

    // Verifica si es una solicitud HTTP o TCP
    if (context.getType() === 'rpc') {
      const rpcData = context.switchToRpc().getData();
      authHeader = rpcData?.authorization;
    } else {
      const req = context.switchToHttp().getRequest();
      authHeader = req.headers?.authorization;
    }

    if (!authHeader) {
      console.error('❌ No Authorization header found');
      throw new UnauthorizedException('Token is missing');
    }

    return super.canActivate(context);
  }
}
