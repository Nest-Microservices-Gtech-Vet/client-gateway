import { Module } from '@nestjs/common';

import { EspecieController } from './especie.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [EspecieController],
  providers: [],
  imports:[NatsModule],
})
export class EspecieModule {}
