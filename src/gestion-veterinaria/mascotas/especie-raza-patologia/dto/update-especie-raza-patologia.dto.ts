import { PartialType } from '@nestjs/mapped-types';
import { CreateEspecieRazaPatologiaDto } from './create-especie-raza-patologia.dto';

export class UpdateEspecieRazaPatologiaDto extends PartialType(CreateEspecieRazaPatologiaDto) {
  id: number;
}
