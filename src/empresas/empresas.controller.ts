import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EMPRESAS_SERVICE, NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';


@Controller('empresas')
export class EmpresasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  @Post()
  createEmp(@Body() createEmpresaDto: CreateEmpresaDto) {
    console.log('Enviando mensaje a create_empresa', createEmpresaDto);

    return this.client.send({ cmd: 'create_empresa'}, createEmpresaDto);
  }

  @Get()
  findAllEmpresas() {
    return this.client.send({ cmd: 'findAll_empresas' }, {});
  }

  @Get(':id')
  async findOne(@Param('id') emp_id: string) {
    return this.client.send({ cmd: 'findOne_empresa' }, { emp_id: Number(emp_id) })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  updateEmpresa(
    @Param('id', ParseIntPipe) emp_id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @Body('updatedBy', ParseIntPipe) updatedBy: number
  ) {
    return this.client.send(
      { cmd: 'update_empresa' },
      { updateEmpresaDto:{ ...updateEmpresaDto, emp_id }, updatedBy }
    ).pipe(
        catchError(err => { throw new RpcException(err) })
    );
  }

@Delete(':id')
removeEmpresa(@Param('id', ParseIntPipe) emp_id: number) {
  return this.client.send({ cmd: 'delete_empresa' }, { emp_id })
    .pipe(
      catchError(err => {
        console.log('Error al eliminar la empresa:', err);
        return throwError(() => new RpcException('Error al querer eliminar la empresa'))
      }
      )
    );
}
}
