// src/debug/debug.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { NATS_SERVICE } from 'src/config';

@Controller('debug')
export class DebugController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

    // @UseGuards(AuthGuard, RolesGuard)
    // @Roles('SUPERADMIN')
    @Get('por-rol')
    findUsuariosPorRolTest(@Query('rol') rol: string) {
        console.log('🧪 Recibido rol plano:', rol);
        return this.client.send({ cmd: 'findAll_users.byRole' }, { usua_rol: rol }).toPromise();
    }
}
