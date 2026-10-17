import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('tipos-empresas')
export class TiposEmpresasController {
  constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
      ) { }

  // Devuelve los tipos de empresa ya usados por las empresas registradas (empresas-ms)
  @Get()
  getTipoEmp(){
    return this.client.send({ cmd: 'get_tipoEmp'},{});
  }


}
