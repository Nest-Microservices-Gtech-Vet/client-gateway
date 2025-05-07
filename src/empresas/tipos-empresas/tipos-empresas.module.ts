import { Module } from '@nestjs/common';
import { TiposEmpresasController } from './tipos-empresas.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TiposEmpresasController],
  providers: [],
  imports:[NatsModule],
})
export class TiposEmpresasModule {}
