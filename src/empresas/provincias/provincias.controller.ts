import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';

import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('provincias')
export class ProvinciasController {
  constructor(
      @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ) { }

  @Post()
  create(@Body() createProvinciaDto: CreateProvinciaDto) {
    return this.client.send({ cmd: 'create_prov' },createProvinciaDto);
  }

  @Get()
  findAll() {
    return this.client.send({ cmd: 'getAllProv'},{});
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.provinciasService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProvinciaDto: UpdateProvinciaDto) {
  //   return this.provinciasService.update(+id, updateProvinciaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.provinciasService.remove(+id);
  // }
}
