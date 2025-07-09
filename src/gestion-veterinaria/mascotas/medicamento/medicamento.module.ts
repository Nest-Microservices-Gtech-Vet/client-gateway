import { Module } from '@nestjs/common';
import { MedicamentoController } from './medicamento.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [MedicamentoController],
  providers: [],
  imports:[NatsModule]
})
export class MedicamentoModule {}
