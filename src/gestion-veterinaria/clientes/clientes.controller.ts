import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, BadRequestException, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { CreateClienteDto, } from './dto/create-cliente.dto';
import { UpdateClienteDto, } from './dto/update-cliente.dto';
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


  //Inicia crear cliente asignado a empresa y por admin
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

  //fin crear cliente asignado a empresa y por admin
  //************************************************************************************** */
  //inicia obtener clientes
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_clientes' }, { adminId: user.id })
      );
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de clientes');
    }
  }
  //fin obtener clientes
  //************************************************************************************** */

  //inicia obtener cliente por id
  @Get(':id')
  async findPropietarioById(
    @Param('id') prop_id: string,
  ) {
    return this.client.send('findPropietarioById', { prop_id: Number(prop_id) })
      .pipe(catchError(err => { throw new RpcException(err) }));
  }
  //finobtener clientepor id

  //inicia  actualizar cliente por id
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updatePropietario(
    @Param('id', ParseIntPipe) cli_id: number,
    @Body() updateClienteDto: UpdateClienteDto,
    @User() user: CurrentUser
  ) {
    const payload = { cli_id, updatedBy: user.id, updateClienteDto: updateClienteDto }
    return this.client.send('updateCliente', payload).pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }
  //fin actualizar propietario por id
  //************************************************************************************** */

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
  //fin eliminar cliente por id borrado logico
  //************************************************************************************** */
}
