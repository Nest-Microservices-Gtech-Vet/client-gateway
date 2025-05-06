import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';

import { NatsModule } from './transports/nats.module';



@Module({
  imports: [UsersModule, EmpresasModule,NatsModule],
  
})
export class AppModule {}
