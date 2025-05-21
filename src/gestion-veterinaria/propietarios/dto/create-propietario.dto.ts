import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePropietarioDto {

    @IsString()
    @MinLength(10)
    @MaxLength(13)
    prop_identificacion: string;

    @IsString()
    prop_nombre: string;

    @IsString()
    prop_apellido: string;

    @IsEmail()
    prop_email: string;

    @IsString()
    @MaxLength(10)
    prop_celular: string;

    @IsString()
    prop_direccion: string;

    @IsString()
    prop_observaciones: string;

    @IsInt()
    empresa_id: number; // ← para multitenencia

    @IsOptional()
    @IsBoolean()
    activo: boolean;

    @IsOptional()
    @IsInt()
    createdBy?: number;


    @IsOptional()
    @IsInt()
    updatedBy?: number;
}