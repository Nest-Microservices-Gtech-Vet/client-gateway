import { Module } from '@nestjs/common';

import { EspecieRazaPatologiaController } from './especie-raza-patologia.controller';

@Module({
  controllers: [EspecieRazaPatologiaController],
  providers: [],
})
export class EspecieRazaPatologiaModule {}
