import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';

import { NatsModule } from './transports/nats.module';
import { ProvinciasModule } from './empresas/provincias/provincias.module';
import { CantonesModule } from './empresas/cantones/cantones.module';
import { TiposEmpresasModule } from './empresas/tipos-empresas/tipos-empresas.module';
import { AuthModule } from './auth/auth.module';


import { DebugController } from './debug/debug.controller';
import { ClientesModule } from './gestion-veterinaria/clientes/clientes.module';
import { MascotasModule } from './gestion-veterinaria/mascotas/mascotas.module';
import { EspecieRazaPatologiaModule } from './gestion-veterinaria/mascotas/especie-raza-patologia/especie-raza-patologia.module';
import { PatologiaModule } from './gestion-veterinaria/mascotas/patologia/patologia.module';
import { AppController } from './app.controller_old';

@Module({
  imports: [
    UsersModule,
    EmpresasModule,
    NatsModule,
    ProvinciasModule,
    CantonesModule,
    TiposEmpresasModule,
    AuthModule,
    ClientesModule,
    MascotasModule,
    EspecieRazaPatologiaModule,
    PatologiaModule,
  ],
  controllers: [
    DebugController,
    AppController,
  ],
})
export class AppModule {}