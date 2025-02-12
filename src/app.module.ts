import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmpresasModule } from './empresas/empresas.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from './config';



@Module({
  imports: [
    UsersModule, 
    EmpresasModule, 
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: envs.usersMicroservicesHost,
          port: envs.usersMicroservicesPort,
        },
      },
    ])
  ],

})
export class AppModule { }
