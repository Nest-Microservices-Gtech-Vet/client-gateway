import { Module } from '@nestjs/common';
import { ExamenesController } from './examenes.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ExamenesController],
  providers: [],
  imports:[NatsModule]
})
export class ExamenesModule {}
