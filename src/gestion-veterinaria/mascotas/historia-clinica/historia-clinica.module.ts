import { Module } from '@nestjs/common';

import { HistoriaClinicaController } from './historia-clinica.controller';

@Module({
  controllers: [HistoriaClinicaController],
  providers: [],
})
export class HistoriaClinicaModule {}
