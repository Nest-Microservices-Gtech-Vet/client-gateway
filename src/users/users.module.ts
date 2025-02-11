import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, USER_SERVICE } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      { 
        name: USER_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.usersMicroservicesHost,
          port: envs.usersMicroservicesPort,
        } 
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
