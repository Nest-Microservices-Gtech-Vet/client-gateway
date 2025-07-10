import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, ParseIntPipe, InternalServerErrorException } from '@nestjs/common';

import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { Roles, User } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';

@Controller('tratamiento')
export class TratamientoController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post('crear')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createTratamientoDto: CreateTratamientoDto,
    @User() user: CurrentUser,
  ) {
    return await firstValueFrom(
      this.client.send(
        { cmd: 'crear_tratamiento' },
        {
          createTratamientoDto: {
            ...createTratamientoDto,
          }, user: { id: user.id }
        },
      ),
    );
  }

  @Get()
  findAll() {
    return ""
  }

  @Get('por-consulta/:consultaId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getByConsultaId(
    @Param('consultaId', ParseIntPipe) consultaId: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'obtener_tratamiento_por_consulta' },
          {
            consultaId,
            user: { id: user.id }
          }
        )
      );
    } catch (error) {
      console.error('Error al obtener tratamiento por consultaId', error);
      throw new InternalServerErrorException(`Error traer tratamiento de consulta ${consultaId}`);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'obtener_tratamiento' },
          {
            id,
            user: { id: user.id }
          }
        )
      )
    } catch (error) {
      console.error('Error al obtener tratamiento con id', error);
      throw new InternalServerErrorException(`Error traer tratamiento${id}`);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTratamientoDto: UpdateTratamientoDto) {
    return "this.tratamientoService.update(+id, updateTratamientoDto);"
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return "this.tratamientoService.remove(+id);"
  }
}
