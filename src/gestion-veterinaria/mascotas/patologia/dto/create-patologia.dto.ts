import { IsInt, IsOptional, IsString } from "class-validator";

export class CreatePatologiaDto {
    @IsString()
    pat_nombre: string;

    @IsOptional()
    @IsString()
    pat_desc?: string;

    @IsInt()
    empresa_id: number;
}

