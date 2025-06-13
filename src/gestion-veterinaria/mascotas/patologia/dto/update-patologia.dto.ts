import { PartialType } from '@nestjs/mapped-types';
import { CreatePatologiaDto } from './create-patologia.dto';

export class UpdatePatologiaDto extends PartialType(CreatePatologiaDto) {
  id: number;
}
