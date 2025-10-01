import { Type } from "class-transformer";
import { IsArray, IsDateString, IsInt, IsOptional, IsString } from "class-validator";

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

    @IsString()
    empresa_id: string;

    @IsString()
    mascota_id: string;

    @IsString()
    historiaClinica_id?: string; // ✅ requerido ahora

    // Eliminar este campo si ya no lo usas:
    // @IsOptional()
    // @IsString()
    // numeroConsulta?: string;

    // 👇 Aquí aceptamos lista de IDs a eliminar
    @IsOptional()
    @IsArray()
    @Type(() => Number) // transforma los strings del form-data en number
    @IsInt({ each: true })
    archivosAEliminar?: number[];
}
