import { IsString } from "class-validator";

export class CreateMedicamentoDto {
    @IsString()
    nombre: string;

    @IsString()
    dosis: string;
}
