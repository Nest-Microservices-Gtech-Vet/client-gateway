import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClienteDto {

    @IsString()
    @MinLength(10)
    @MaxLength(13)
    cli_identificacion: string;

    @IsString()
    cli_nombre: string;

    @IsString()
    cli_apellido: string;

    @IsEmail()
    cli_email: string;

    @IsString()
    @MaxLength(10)
    cli_celular: string;

    @IsString()
    cli_direccion: string;

    @IsString()
    cli_observaciones: string;

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