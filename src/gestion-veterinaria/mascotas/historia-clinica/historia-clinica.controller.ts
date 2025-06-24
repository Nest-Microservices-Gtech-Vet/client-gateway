import { Body, Controller, Inject, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';


@Controller('historia-clinica')
export class HistoriaClinicaController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }
  //empieza crear historia clinica
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async crearHistoria(
    @Body() createHistoriaClinicaDto: CreateHistoriaClinicaDto,
    @User() user: CurrentUser,
  ) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'crear_historiaClinica' },
          {
            createHistoriaClinicaDto: {
              ...createHistoriaClinicaDto
            },
            user: { id: adminId },
          }
        )
      );
    } catch (error) {
      console.error('Error al crear historia clinica:', {
        message: error?.message,
        response: error?.response,
        cause: error?.cause,
        stack: error?.stack,
      });
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al crear historia clinica'
      );
    }
  }
  //empieza crear historia clinica
  //*************************************************************************
  //  */
  //
  //*************************************************************************************** */
  //  */
  //
  //*************************************************************************************** */
  //  */
  //
  //*************************************************************************************** */
  //  */
  //
  //*************************************************************************************** */
}
