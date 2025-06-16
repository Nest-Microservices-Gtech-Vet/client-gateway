import { Module } from '@nestjs/common';

import { RazaController } from './raza.controller';

@Module({
  controllers: [RazaController],
  providers: [],
})
export class RazaModule {}
