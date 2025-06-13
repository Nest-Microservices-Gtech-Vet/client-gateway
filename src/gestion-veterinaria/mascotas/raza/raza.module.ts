import { Module } from '@nestjs/common';
import { RazaService } from './raza.service';
import { RazaController } from './raza.controller';

@Module({
  controllers: [RazaController],
  providers: [RazaService],
})
export class RazaModule {}
