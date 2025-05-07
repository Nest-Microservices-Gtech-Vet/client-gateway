import { Module } from '@nestjs/common';

import { ProvinciasController } from './provincias.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ProvinciasController],
  providers: [],
  imports:[NatsModule],
})
export class ProvinciasModule {}
