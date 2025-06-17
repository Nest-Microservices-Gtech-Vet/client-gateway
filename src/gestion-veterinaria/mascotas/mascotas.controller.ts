import { Body, Controller, Get, Inject, InternalServerErrorException, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';


@Controller('mascotas')
export class MascotasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  //inicia crear mascotas
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createMascotas(
    @Body() createMascotaDto: CreateMascotaDto,
    @User() user: CurrentUser,
  ) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'crear_mascota' }, {
          createMascotaDto: {
            ...createMascotaDto
          },
          user: { id: adminId },
        })
      );
    } catch (error) {
      console.error('Error al crear mascota:', {
        message: error?.message,
        response: error?.response,
        cause: error?.cause,
        stack: error?.stack,
      });
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al crear mascota'
      );
    }

  }
  //fin crear mascotas
  //************************************************************************************************** */
  //inicio obtener mascotas se gun empresa
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_mascotas' }, { adminId: user.id })
      );
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de mascotas');
    }
  }

  //fin obtener mascotas se gun empresa
  //************************************************************************************************** */
  //inicio obtener mascota por id se gun empresa
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findMascotaById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'mascotaById' }, {
          id,
          user: { id: user.id }
        })
      )
    } catch (error) {
      console.error('Error al obtener mascota con id', error);
      throw new InternalServerErrorException('Error al listar clientes');
    }
  }
  //fin obtener mascotas por id se gun empresa
  //************************************************************************************************** */
}
