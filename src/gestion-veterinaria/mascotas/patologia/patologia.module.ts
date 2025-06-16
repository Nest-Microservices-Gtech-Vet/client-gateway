import { Module } from '@nestjs/common';

import { PatologiaController } from './patologia.controller';

@Module({
  controllers: [PatologiaController],
  providers: [],
})
export class PatologiaModule {}
