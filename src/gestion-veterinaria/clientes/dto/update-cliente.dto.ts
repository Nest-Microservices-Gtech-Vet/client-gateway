import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';


export class UpdateClientesDto extends PartialType(CreateClienteDto) {
  id: number;
}
