import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class CreateConsultaDto {
    @IsDateString()
    con_fecha: string;

    @IsString()
    con_motivo: string;

    @IsOptional()
    @IsString()
    con_sintomas?: string;

    @IsOptional()
    @IsString()
    con_diagnostico?: string;

    @IsOptional()
    @IsString()
    con_tratamiento?: string;

    @IsOptional()
    @IsString()
    con_recomendaciones?: string;

    @IsInt()
    historiaClinica_id: number;

    @IsInt()
    empresa_id: number;
}

