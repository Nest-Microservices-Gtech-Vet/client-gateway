import { Controller, Post, UploadedFiles, UseInterceptors, Body, UseGuards, Get, Param, ParseIntPipe, InternalServerErrorException, Patch, BadRequestException } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles, User } from 'src/auth/decorators';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { UpdateConsultaDto } from './dto/update-consulta.dto';

@Controller('consulta')
export class ConsultaController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  //inicia crear consulta
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async crearConsulta(
    @Body() createConsultaDto: CreateConsultaDto,
    @User() user: CurrentUser,
  ) {
    return await firstValueFrom(
      this.client.send(
        { cmd: 'crear_consulta' },
        {
          createConsultaDto: {
            ...createConsultaDto,
          }, user: { id: user.id }
        },
      ),
    );
  }
  //finaliza crear consulta
  //******************************************** */
  //inicia editar consulta}
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findConsultaById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'consultaById' }, {
          id,
          user: { id: user.id }
        })
      )
    } catch (error) {
      console.error('Error al obtener consulta con id', error);
      throw new InternalServerErrorException('Error traer consulta ');
    }
  }
  //finaliza actualizar consulta
  //******************************************************************** */
  //inicia editar consulta
  @Patch('mascota/:id/modificar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateConsulta(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConsultaDto: UpdateConsultaDto,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'consulta_update' }, {
          id: id,
          updateConsultaDto,
          updatedBy: user.id,
          user: { id: user.id }
        })
      )
    } catch (error) {
      console.error('Error al actualizar consulta:', error);
      throw new InternalServerErrorException('No se pudo actualizar  consulta');
    }
  }
  //finaliza actualizar consulta
  //******************************************************************** */

}

//inicia editar consulta}
//finaliza actualizar consulta
//******************************************************************** */
//inicia editar consulta}
//finaliza actualizar consulta
//******************************************************************** */
//inicia editar consulta}
//finaliza actualizar consulta
//******************************************************************** */