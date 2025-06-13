import { Controller } from '@nestjs/common';
import { VacunaService } from './vacuna.service';

@Controller('vacuna')
export class VacunaController {
  constructor(private readonly vacunaService: VacunaService) {}
}
