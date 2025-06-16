import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMascotaDto {
    @IsString()
    mas_nombre: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    mas_fechaNac?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    mas_peso?: number;

    @IsOptional()
    @IsString()
    mas_color?: string;

    @IsOptional()
    @IsBoolean()
    mas_esterilizado?: Boolean;

    @IsOptional()
    @IsString()
    mas_microchip?: string;

    @IsOptional()
    @IsString()
    mas_foto?: string;

    @IsOptional()
    @IsString()
    mas_notas?: string;

    @IsOptional()
    @IsBoolean()
    activo: boolean;

    @IsInt()
    cliente_id: number;

    @IsInt()
    especie_id: number;

    @IsInt()
    raza_id: number;

    @IsInt()
    empresa_id: number;

    @IsOptional()
    @IsInt()
    createdBy?: number;


    @IsOptional()
    @IsInt()
    updatedBy?: number;
}
