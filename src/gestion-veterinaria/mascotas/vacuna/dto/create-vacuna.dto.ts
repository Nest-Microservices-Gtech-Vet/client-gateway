import { IsDateString, IsOptional, IsString } from "class-validator";

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
    vac_observacion?: string;

    // Los siguientes campos llegan como string desde form-data, los parseamos manualmente
    @IsString()
    empresa_id: string;

    @IsString()
    mascota_id: string;

    @IsString()
    numeroConsulta: string;
}
