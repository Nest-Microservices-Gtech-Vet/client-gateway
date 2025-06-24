import { Module } from '@nestjs/common';

import { HistoriaClinicaController } from './historia-clinica.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [HistoriaClinicaController],
  providers: [],
  imports:[NatsModule]
})
export class HistoriaClinicaModule {}
