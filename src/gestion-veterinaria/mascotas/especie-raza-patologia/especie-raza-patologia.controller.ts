import { Controller } from '@nestjs/common';
import { EspecieRazaPatologiaService } from './especie-raza-patologia.service';

@Controller('especie-raza-patologia')
export class EspecieRazaPatologiaController {
  constructor(private readonly especieRazaPatologiaService: EspecieRazaPatologiaService) {}
}
