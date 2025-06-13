import { Controller } from '@nestjs/common';
import { EspecieService } from './especie.service';

@Controller('especie')
export class EspecieController {
  constructor(private readonly especieService: EspecieService) {}
}
