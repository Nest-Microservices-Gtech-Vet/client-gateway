import { Module } from '@nestjs/common';

import { VacunaController } from './vacuna.controller';

@Module({
  controllers: [VacunaController],
  providers: [],
})
export class VacunaModule {}
