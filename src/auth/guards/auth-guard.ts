import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request = context.switchToHttp().getRequest();
        
        const token = this.extractTokenFromHeader(request);
        console.log('📡 Enviando token a NATS:', token);

        if (!token) {
            throw new UnauthorizedException('Token no encontrado');
        }
        try {
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            const { user, token: newToken } = await firstValueFrom(
                this.client.send('auth.verify.user', token)
            );
            console.log('🧾 Respuesta de usuarios-ms:', user); // Nuevo log
            // Normalizar el rol
            if (typeof user.usua_rol === 'string') {
                user.rol = [user.usua_rol]; // crea un nuevo campo 'rol' como array
            } else if (Array.isArray(user.rol)) {
                // Ya está bien
            } else {
                user.rol = [];
            }

            console.log('🧾 Token decodificado:', user); // <- Aquí

            request['user'] = user;
            request['token'] = newToken;
        } catch {
            throw new UnauthorizedException();
        }

        console.log('✅ AuthGuard pasó');
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
