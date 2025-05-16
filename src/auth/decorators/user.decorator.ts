import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();


        // Acceder con notación de corchetes para mantener consistencia con AuthGuard
        const user = request['user'];

        if (!user) {
            throw new InternalServerErrorException('Usuario no encontrado (¿AuthGuard fue llamado?)');
        }

        return user;
    }
);