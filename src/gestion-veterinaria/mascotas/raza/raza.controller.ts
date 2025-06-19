import { Controller, Get, Inject, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';


@Controller('razas')
export class RazaController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy,) { }


  @Get()
  async findRazas() {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_razas' }, {})
      )
    } catch (error) {
      console.error('Error al obtener especies:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de especies');
    }
  }
}
