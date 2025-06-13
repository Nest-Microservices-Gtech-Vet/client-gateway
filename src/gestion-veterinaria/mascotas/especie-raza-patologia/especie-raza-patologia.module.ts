import { Module } from '@nestjs/common';
import { EspecieRazaPatologiaService } from './especie-raza-patologia.service';
import { EspecieRazaPatologiaController } from './especie-raza-patologia.controller';

@Module({
  controllers: [EspecieRazaPatologiaController],
  providers: [EspecieRazaPatologiaService],
})
export class EspecieRazaPatologiaModule {}
