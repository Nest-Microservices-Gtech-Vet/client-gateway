import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';

import { NatsModule } from './transports/nats.module';
import { ProvinciasModule } from './empresas/provincias/provincias.module';
import { CantonesModule } from './empresas/cantones/cantones.module';
import { TiposEmpresasModule } from './empresas/tipos-empresas/tipos-empresas.module';



@Module({
  imports: [UsersModule, EmpresasModule,NatsModule, ProvinciasModule,CantonesModule,TiposEmpresasModule],
  
})
export class AppModule {}
