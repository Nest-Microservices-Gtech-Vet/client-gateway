import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EMPRESA_SERVICE, envs } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EMPRESA_SERVICE,
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
