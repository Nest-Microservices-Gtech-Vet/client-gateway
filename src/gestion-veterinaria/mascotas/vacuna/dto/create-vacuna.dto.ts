import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class CreateVacunaDto {
    @IsString()
    vac_nombre: string;

    @IsDateString()
    vac_fecha: string;

    @IsOptional()
    @IsDateString()
    vac_proxima?: string;

    @IsOptional()
    @IsString()
    vac_observacion?: string;

    @IsInt()
    consulta_id: number;

    @IsInt()
    empresa_id: number;
}
