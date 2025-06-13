import { Controller } from '@nestjs/common';
import { RazaService } from './raza.service';

@Controller('raza')
export class RazaController {
  constructor(private readonly razaService: RazaService) {}
}
