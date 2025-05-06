import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard, JwtService],
  imports: [
      ClientsModule.register([
        { 
          name: USERS_SERVICE, 
          transport: Transport.TCP,
          options: {
            host: envs.usersMicroservicesHost,
            port: envs.usersMicroservicesPort,
          } 
        },
      ]),
    ],
    exports: [JwtAuthGuard],
})
export class AuthModule {}
