import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';


@Controller('mascotas')
export class MascotasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  //inicia crear mascotas
  @Post()
  async createMascotas(){
    
  }
  //fin crear mascotas
  //************************************************************************************************** */
}
