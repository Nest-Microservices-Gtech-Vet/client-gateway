import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, BadRequestException, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { CreateClienteDto, } from './dto/create-cliente.dto';
import { UpdateClientesDto, } from './dto/update-cliente.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Controller('clientes')
export class ClientesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }


  //Inicia crear propietario asignado a empresa y por admin
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createClienteDto: CreateClienteDto,
    @User() user: CurrentUser,) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'crear_cliente' },
          {
            createClienteDto: {
              ...createClienteDto, // ← se respeta el empresa_id enviado
            },
            user: { id: adminId },
          }
        )
      );
    } catch (error) {
      console.error('Error al crear cliente:', {
        message: error?.message,
        response: error?.response,
        cause: error?.cause,
        stack: error?.stack,
      });
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al crear cliente'
      );
    }
  }

  //fin crear propietario asignado a empresa y por admin
  //************************************************************************************** */
  //inicia obtener propietarios
  @Get()
  findAll() {
    return this.client.send('findAll_propietarios', {})
  }
  //finobtener propietarios

  //inicia obtener propietario por id
  @Get(':id')
  async findPropietarioById(
    @Param('id') prop_id: string,
  ) {
    return this.client.send('findPropietarioById', { prop_id: Number(prop_id) })
      .pipe(catchError(err => { throw new RpcException(err) }));
  }
  //finobtener propietariopor id

  //inicia  actualizar propietario por id
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updatePropietario(
    @Param('id', ParseIntPipe) prop_id: number,
    @Body() updateClientesDto: UpdateClientesDto,
    @User() user: CurrentUser
  ) {
    const payload = { prop_id, updatedBy: user.id, updateClientesDto: updateClientesDto }
    return this.client.send('updatePropietario', payload).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }
  //fin actualizar propietario por id

  //inicia  eliminar propietario por id borrado logico
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  removePropietario(
    @Param('id', ParseIntPipe) prop_id: number,
    @User() user: CurrentUser
  ) {
    return this.client.send('removePropietario', { prop_id, updatedBy: user.id })
      .pipe(
        catchError(err => {
          console.log('Error al eliminar propietario:', err);
          return throwError(() => new RpcException('Error al querer eliminar propietario'))
        }
        )
      );
  }
  //fin eliminar propietario por id borrado logico
}
