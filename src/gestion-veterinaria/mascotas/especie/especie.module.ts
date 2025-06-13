import { Module } from '@nestjs/common';
import { EspecieService } from './especie.service';
import { EspecieController } from './especie.controller';

@Module({
  controllers: [EspecieController],
  providers: [EspecieService],
})
export class EspecieModule {}
