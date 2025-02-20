import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
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
})
export class AuthModule {}
