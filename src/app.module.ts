import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';

import { NatsModule } from './transports/nats.module';
import { ProvinciasModule } from './empresas/provincias/provincias.module';
import { CantonesModule } from './empresas/cantones/cantones.module';
import { TiposEmpresasModule } from './empresas/tipos-empresas/tipos-empresas.module';
import { AuthModule } from './auth/auth.module';
import { PropietariosModule } from './gestion-veterinaria/propietarios/propietarios.module';
import { DebugController } from './debug/debug.controller';

@Module({
  imports: [
    UsersModule,
    EmpresasModule,
    NatsModule,
    ProvinciasModule,
    CantonesModule,
    TiposEmpresasModule,
    AuthModule,
    PropietariosModule,
  
  ],
  controllers: [DebugController],
})
export class AppModule {}
