import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, InternalServerErrorException, UseGuards } from '@nestjs/common';

import { CreateMedicamentoDto } from './dto/create-medicamento.dto';
import { UpdateMedicamentoDto } from './dto/update-medicamento.dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';

@Controller('medicamento')
export class MedicamentoController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('crear')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createMedicamentoDto: CreateMedicamentoDto,
    @User() user: CurrentUser,
  ) {
    const adminId = user.id;
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'crear_medicamento' }, {
          createMedicamentoDto: {
            ...createMedicamentoDto
          },
          user: { id: adminId }
        })
      );
    } catch (error) {
      console.error('Error al crear medicamento:', {
        message: error?.message,
        response: error?.response,
        cause: error?.cause,
        stack: error?.stack,
      });
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al crear medicamento'
      );
    }
  }

  @Get()
  findAll() {
    return 'this.medicamentoService.findAll()';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'this.medicamentoService.findOne(+id)';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicamentoDto: UpdateMedicamentoDto) {
    return 'this.medicamentoService.update(+id, updateMedicamentoDto)';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'this.medicamentoService.remove(+id)';
  }
}
