import { Module } from '@nestjs/common';

import { RazaController } from './raza.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [RazaController],
  providers: [],
  imports:[NatsModule],
})
export class RazaModule {}
