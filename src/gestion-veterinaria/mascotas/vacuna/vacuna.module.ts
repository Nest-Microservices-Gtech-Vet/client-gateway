import { Module } from '@nestjs/common';

import { VacunaController } from './vacuna.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [VacunaController],
  providers: [],
  imports:[NatsModule]
})
export class VacunaModule {}
