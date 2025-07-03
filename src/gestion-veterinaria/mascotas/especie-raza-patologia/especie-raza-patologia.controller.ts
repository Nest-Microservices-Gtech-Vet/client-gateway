import { BadRequestException, Controller, Get, Inject, InternalServerErrorException, Query } from '@nestjs/common';
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

  @Get('especie_raza')
  async findByEspecieRaza(
    @Query('especie_id') especieIdStr?: string,
    @Query('raza_id') razaIdStr?: string
  ) {
    const especieId = especieIdStr && !isNaN(+especieIdStr) ? parseInt(especieIdStr, 10) : null;
    const razaId = razaIdStr && !isNaN(+razaIdStr) ? parseInt(razaIdStr, 10) : null;

    console.log('📤 Enviando desde GATEWAY:', { especieId, razaId });

    return await firstValueFrom(
      this.client.send({ cmd: 'findByEspecieRaza' }, { especieId, razaId })
    );
  }


  @Get('/prueba')
  async test() {
    return await firstValueFrom(
      this.client.send({ cmd: 'PRUEBA_MICRO' }, { hola: 'mundo' }),
    );
  }

}
