import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EMPRESAS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { request } from 'http';

@Controller('empresas')
export class EmpresasController {
  constructor(
    @Inject(EMPRESAS_SERVICE) private readonly empresasClient: ClientProxy
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createEmpresaDto: CreateEmpresaDto, @Req() request) {
    const authToken = request.headers.authorization; // ✅ Obtiene el token desde el header HTTP
    console.log('Enviando mensaje a create_empresa', createEmpresaDto);
    console.log('🔑 Token enviado:', authToken);

    return this.empresasClient.send('create_empresa', {
      createEmpresaDto,
      createdBy: request.user.userId,
      authorization: authToken, // ✅ Envía el token en el payload
    }).toPromise();
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  findAllEmpresas() {
    return this.empresasClient.send('findAll_empresas', {});
  }

  @Get(':id')
  async findOne(@Param('id') emp_id: string) {
    return this.empresasClient.send('findOne_empresa', { emp_id: Number(emp_id) })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  updateEmpresa(
    @Param('id', ParseIntPipe) emp_id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto) {
    return this.empresasClient.send('update_empresa', { emp_id, ...updateEmpresaDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Delete(':id')
  removeEmpresa(@Param('id', ParseIntPipe) emp_id: number) {
    return this.empresasClient.send('delete_empresa', { emp_id })
      .pipe(
        catchError(err => {
          console.log('Error al eliminar la empresa:', err);
          return throwError(() => new RpcException('Error al querer eliminar la empresa'))
        }
        )
      );
  }
}
