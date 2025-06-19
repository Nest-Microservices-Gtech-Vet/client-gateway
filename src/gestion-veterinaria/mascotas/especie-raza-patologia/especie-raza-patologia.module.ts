import { Module } from '@nestjs/common';

import { EspecieRazaPatologiaController } from './especie-raza-patologia.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EspecieRazaPatologiaController],
  providers: [],
  imports:[NatsModule]
})
export class EspecieRazaPatologiaModule {}
