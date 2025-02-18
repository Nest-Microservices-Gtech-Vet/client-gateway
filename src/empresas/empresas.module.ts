import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMPRESAS_SERVICE, envs } from 'src/config';

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
  providers: [],
})
export class EmpresasModule {}
