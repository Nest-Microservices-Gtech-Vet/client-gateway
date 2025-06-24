import { Module } from '@nestjs/common';

import { ConsultaController } from './consulta.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ConsultaController],
  providers: [],
  imports:[NatsModule]
})
export class ConsultaModule {}
