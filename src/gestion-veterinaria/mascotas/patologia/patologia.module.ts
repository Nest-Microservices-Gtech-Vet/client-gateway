import { Module } from '@nestjs/common';

import { PatologiaController } from './patologia.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PatologiaController],
  providers: [],
  imports:[NatsModule]
})
export class PatologiaModule {}
