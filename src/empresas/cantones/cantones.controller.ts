import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';

import { CreateCantonDto } from './dto/create-cantone.dto';
import { UpdateCantoneDto } from './dto/update-cantone.dto';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';

@Controller('cantones')
export class CantonesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }


  @Post()
  createCant(@Body() createCantonDto: CreateCantonDto) {
    return this.client.send({ cmd: 'create_cant' }, createCantonDto);
  }

  @Get()
  getCant(){
    return this.client.send({ cmd: 'getCant'},{})
  }


}
