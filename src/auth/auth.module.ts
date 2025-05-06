import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard, JwtService],
  imports: [
      NatsModule
    ],
    exports: [JwtAuthGuard],
})
export class AuthModule {}
