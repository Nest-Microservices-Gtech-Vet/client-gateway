import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { CreateMedicamentoDto } from "../../medicamento/dto/create-medicamento.dto";


// src/mascotas/tratamiento/dto/create-tratamiento.dto.ts
export class MedicamentoParaTratamientoDto {
    @IsString()
    nombre: string;

    @IsString()
    dosis: string;

    @IsInt()
    empresa_id: number;
}

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

    @IsOptional()
    @IsInt()
    @IsDateString()
    created_at: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMedicamentoDto)
    medicamentos: CreateMedicamentoDto[];
}
