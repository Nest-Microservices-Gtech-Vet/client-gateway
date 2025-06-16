import { Body, Controller, Inject, InternalServerErrorException, Post, UseGuards } from '@nestjs/common';
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
}
