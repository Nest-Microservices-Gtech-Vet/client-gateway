import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';

import { JwtService } from '@nestjs/jwt';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    NatsModule
  ],
  controllers: [EmpresasController],
  providers: [JwtService],
})
export class EmpresasModule {}
