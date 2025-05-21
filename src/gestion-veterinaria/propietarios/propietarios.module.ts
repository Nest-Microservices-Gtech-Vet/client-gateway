import { Module } from '@nestjs/common';
import { PropietariosController } from './propietarios.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [PropietariosController],
  providers: [],
  imports: [ NatsModule
    ],
})
export class PropietariosModule {}
