import { Controller, Get, Inject, InternalServerErrorException, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';


@Controller('especie')
export class EspecieController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy,) {}

  @Get()
  async findEspecies (){
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'findAll_especie'},{})
      )
    } catch (error) {
      console.error('Error al obtener clientes:', error);
            throw new InternalServerErrorException('No se pudo obtener la lista de clientes');
    }
  }


}
