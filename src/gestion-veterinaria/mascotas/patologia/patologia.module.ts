import { Module } from '@nestjs/common';
import { PatologiaService } from './patologia.service';
import { PatologiaController } from './patologia.controller';

@Module({
  controllers: [PatologiaController],
  providers: [PatologiaService],
})
export class PatologiaModule {}
