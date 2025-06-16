import { Module } from '@nestjs/common';

import { ConsultaController } from './consulta.controller';

@Module({
  controllers: [ConsultaController],
  providers: [],
})
export class ConsultaModule {}
