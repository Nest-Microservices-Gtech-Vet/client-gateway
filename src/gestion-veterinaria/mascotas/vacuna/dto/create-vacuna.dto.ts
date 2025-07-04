

import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class CreateVacunaDto {
    @IsString()
    vac_nombre: string;

    @IsString()
    vac_tipo: string;

    @IsDateString()
    vac_fecha: string;

    @IsOptional()
    @IsDateString()
    vac_proxima?: string;

    @IsOptional()
    @IsString()
    vac_lote?: string;

    @IsOptional()
    @IsString()
    vac_foto?: string;

    @IsOptional()
    @IsString()
    vac_observacion?: string;

    @IsInt()
    consulta_id: number;

    @IsInt()
    empresa_id: number;

    @IsInt()
    mascota_id: number;

    @IsInt()
    numeroConsulta: number;

    @IsOptional()
    @IsInt()
    createdBy?: number;


    @IsOptional()
    @IsInt()
    updatedBy?: number;
}
