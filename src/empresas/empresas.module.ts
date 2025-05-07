import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';


import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [
    NatsModule
  ],
  controllers: [EmpresasController],
  providers: [],
})
export class EmpresasModule {}
