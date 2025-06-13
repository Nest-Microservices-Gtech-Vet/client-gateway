import { Controller } from '@nestjs/common';
import { PatologiaService } from './patologia.service';

@Controller('patologia')
export class PatologiaController {
  constructor(private readonly patologiaService: PatologiaService) {}
}
