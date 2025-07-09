import { Module } from '@nestjs/common';
import { TratamientoService } from './tratamiento.service';
import { TratamientoController } from './tratamiento.controller';

@Module({
  controllers: [TratamientoController],
  providers: [TratamientoService],
})
export class TratamientoModule {}
