import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateTiposEmpresaDto } from './dto/create-tipos-empresa.dto';
import { UpdateTiposEmpresaDto } from './dto/update-tipos-empresa.dto';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('tipos-empresas')
export class TiposEmpresasController {
  constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
      ) { }

  @Post()
  createTipoEmp(@Body() createTiposEmpresasDto: CreateTiposEmpresaDto) {
    return this.client.send({ cmd: 'create_tipoEmp' },createTiposEmpresasDto)
  }

  @Get()
  getTipoEmp(@Payload() any){
    return this.client.send({ cmd: 'get_tipoEmp'},{});
  }


}
