import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

import { JwtService } from '@nestjs/jwt';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  imports: [ NatsModule
  ],
  controllers: [UsersController],
  providers: [JwtService],
})
export class UsersModule {}
