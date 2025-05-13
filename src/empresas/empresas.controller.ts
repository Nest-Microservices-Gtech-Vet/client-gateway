import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EMPRESAS_SERVICE, NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { Token, User } from 'src/auth/decorators';


@Controller('empresas')
export class EmpresasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  createEmp(@Body() createEmpresaDto: CreateEmpresaDto, @User() user: CurrentUser, @Token() token: string) {
    console.log('Enviando mensaje a create_empresa', createEmpresaDto);

    const payload = {
      ...createEmpresaDto,
      createdBy: user.id
    }

    return this.client.send({ cmd: 'create_empresa' }, payload);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  findAllEmpresas(user: CurrentUser, @Token() token: string) {
    return this.client.send({ cmd: 'findAll_empresas' }, {});
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async findOne(@Param('id') emp_id: string,user: CurrentUser, @Token() token: string) {
    return this.client.send({ cmd: 'findOne_empresa' }, { emp_id: Number(emp_id) })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(':id')
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  updateEmpresa(
    @Param('id', ParseIntPipe) emp_id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @User() user: CurrentUser, @Token() token: string) {
    const payload = { emp_id, updatedBy: user.id, updateEmpresaDto: updateEmpresaDto, }
    return this.client.send(
      { cmd: 'update_empresa' },
      payload
    ).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  removeEmpresa(@Param('id', ParseIntPipe) emp_id: number, @User() user: CurrentUser, @Token() token: string) {
    return this.client.send({ cmd: 'delete_empresa' }, { emp_id, updatedBy: user.id })
      .pipe(
        catchError(err => {
          console.log('Error al eliminar la empresa:', err);
          return throwError(() => new RpcException('Error al querer eliminar la empresa'))
        }
        )
      );
  }
}
