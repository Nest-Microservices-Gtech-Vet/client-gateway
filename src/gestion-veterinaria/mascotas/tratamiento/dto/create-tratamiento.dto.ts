import { Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, ValidateNested } from "class-validator";
import { CreateMedicamentoDto } from "../../medicamento/dto/create-medicamento.dto";


export class CreateTratamientoDto {
    @IsInt()
    consulta_id: number;

    @IsInt()
    mascota_id: number;

    @IsInt()
    empresa_id: number;

    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMedicamentoDto)
    medicamentos: CreateMedicamentoDto[];
}
