import { Controller, Get, Inject, InternalServerErrorException, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Roles, User } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { NATS_SERVICE } from 'src/config';


@Controller('patologias')
export class PatologiaController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy,) { }

  @Get()
  async findEspecies() {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_patologias' }, {})
      )
    } catch (error) {
      console.error('Error al obtener patologias:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de patologias');
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findPatologiaById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'patologiaById'},{
          id,
          user: { id: user.id}
        })
      )
    } catch (error) {
      
    }

  }

}
