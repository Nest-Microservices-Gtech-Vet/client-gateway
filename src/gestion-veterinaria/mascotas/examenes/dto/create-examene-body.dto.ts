import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsString } from "class-validator";

export class CreateExameneBodyDto {
    @IsInt()
    @Type(() => Number)
    consulta_id: number;

    @IsInt()
    @Type(() => Number)
    empresa_id: number;

    @IsString()
    tipo: string;

    @IsEnum(['solicitud', 'resultado'])
    @Transform(({ value }) => value?.trim()) // 🔥 limpia espacios/tabulaciones
    categoria: 'solicitud' | 'resultado';

    @IsString()
    descripcion: string;
}