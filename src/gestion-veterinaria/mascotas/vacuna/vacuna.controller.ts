import { Body, Controller, Inject, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Roles, User } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { NATS_SERVICE } from 'src/config';
import {  CreateVacunaDto } from './dto/create-vacuna.dto';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';


@Controller('vacuna')
export class VacunaController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  //inicia crear vacunas
  @Post('registrar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async registrarVacunas(
    @Body() createVacunaDto: CreateVacunaDto,
    @User() user: CurrentUser,
  ) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'crear_vacuna' }, {
          createVacunaDto: {
            ...createVacunaDto
          },
          user: { id: adminId },
        })
      );
    } catch (error) {
      console.error('Error al registrar vacuna:', {
        message: error?.message,
        response: error?.response,
        cause: error?.cause,
        stack: error?.stack,
      });
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al registrar vacuna'
      );
    }

  }  //fin crear vacunas
  //************************************************ */


  //inicia crear vacunas
  //fin crear vacunas
  //************************************************ */


  //inicia crear vacunas
  //fin crear vacunas
  //************************************************ */


  //inicia crear vacunas
  //fin crear vacunas
  //************************************************ */


  //inicia crear vacunas
  //fin crear vacunas
  //************************************************ */
}
