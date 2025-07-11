import { Type } from "class-transformer";
import { IsEnum, IsInt, IsString } from "class-validator";

export class CreateExameneDto {
    @IsInt()
    @Type(() => Number)
    consulta_id: number;

    @IsInt()
    @Type(() => Number)
    empresa_id: number;

    @IsString()
    tipo: string;

    @IsEnum(['solicitud', 'resultado'])
    categoria: 'solicitud' | 'resultado';

    @IsString()
    descripcion: string;
}
