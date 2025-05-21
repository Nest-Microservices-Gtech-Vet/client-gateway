import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseGuards, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';

@Controller('propietarios')
export class PropietariosController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createPropietarioDto: CreatePropietarioDto,
    @User() user: CurrentUser,) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'crear_propietario' },
          {
            createPropietarioDto: {
              ...createPropietarioDto, // ← se respeta el empresa_id enviado
            },
            user: { id: adminId },
          }
        )
      );
    } catch (error) {
      console.error('Error al crear propietario:', error);
      throw new InternalServerErrorException('Error al crear propietario');
    }
  }

  @Get()
  findAll() {
    return this.client.send({ cmd: 'findAll_propietarios' }, {})
  }


}
