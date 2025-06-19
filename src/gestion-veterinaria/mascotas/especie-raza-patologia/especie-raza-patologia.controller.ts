import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';


@Controller('especie-raza-patologia')
export class EspecieRazaPatologiaController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Get()
  async findEspecieRazaPat() {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_especieRazaPat' }, {})
      )
    } catch (error) {
      console.error('Error al obtener especie-raza-patologia:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de especie-raza-patologia');
    }
  }
}
