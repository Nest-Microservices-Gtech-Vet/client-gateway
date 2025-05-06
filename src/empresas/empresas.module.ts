import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMPRESAS_SERVICE, envs } from 'src/config';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EMPRESAS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.empresasMicroservicesHost,
          port: envs.empresasMicroservicesPort 
        }
      },
    ]),
  ],
  controllers: [EmpresasController],
  providers: [JwtService],
})
export class EmpresasModule {}
