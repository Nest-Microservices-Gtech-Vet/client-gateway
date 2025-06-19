import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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

}
