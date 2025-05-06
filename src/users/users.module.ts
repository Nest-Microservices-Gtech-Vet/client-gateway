import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, USERS_SERVICE } from 'src/config';
import { JwtService } from '@nestjs/jwt';

@Module({
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
  controllers: [UsersController],
  providers: [JwtService],
})
export class UsersModule {}
