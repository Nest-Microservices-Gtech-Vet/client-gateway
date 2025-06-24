import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles, User } from 'src/auth/decorators';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';

@Controller('consulta')
export class ConsultaController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

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
        { createConsultaDto:{
          ...createConsultaDto,
        }, user: { id: user.id } },
      ),
    );
  }
}
