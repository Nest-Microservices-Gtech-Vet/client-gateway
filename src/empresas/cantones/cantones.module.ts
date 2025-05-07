import { Module } from '@nestjs/common';

import { CantonesController } from './cantones.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [CantonesController],
  providers: [],
   imports:[NatsModule],
})
export class CantonesModule {}
