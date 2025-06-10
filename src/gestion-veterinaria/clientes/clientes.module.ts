import { Module } from '@nestjs/common';

import { NatsModule } from 'src/transports/nats.module';
import { ClientesController } from './clientes.controller';

@Module({
  controllers: [ClientesController],
  providers: [],
  imports: [ NatsModule
    ],
})
export class ClientesModule {}
