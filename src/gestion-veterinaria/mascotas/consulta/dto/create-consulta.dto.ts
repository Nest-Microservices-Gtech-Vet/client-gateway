import { ArrayNotEmpty, ArrayUnique, IsArray, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateConsultaDto {
    @IsDateString()
    con_fecha: string;

    @IsNotEmpty()
    @IsNumber()
    mascota_id: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    con_motivo: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    con_peso?: number;

    @IsOptional()
    @IsNumber()
    @Min(35)
    @Max(42)
    con_temperaturaCorporal?: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    con_icc?: string;

    @IsOptional()
    @IsNumber()
    con_pulso?: number;

    @IsOptional()
    @IsNumber()
    con_frecuenciaRespiratoria?: number;

    @IsOptional()
    @IsNumber()
    con_frecuenciaCardiaca?: number;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_hidratacion?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_mucosas?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_campoPulmonar?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_palpacionAbdominal?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_diagnosticoPresuntivo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_observaciones?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_diagnostico?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    con_recomendaciones?: string;

    @IsNotEmpty()
    @IsNumber()
    historiaClinica_id: number;

    @IsInt()
    empresa_id: number;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    patologiasIds: number[]; // 👈 Diagnóstico real
}
