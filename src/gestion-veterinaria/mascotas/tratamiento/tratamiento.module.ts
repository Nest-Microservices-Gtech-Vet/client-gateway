import { Module } from '@nestjs/common';

import { TratamientoController } from './tratamiento.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TratamientoController],
  providers: [],
  imports:[NatsModule]
})
export class TratamientoModule {}
