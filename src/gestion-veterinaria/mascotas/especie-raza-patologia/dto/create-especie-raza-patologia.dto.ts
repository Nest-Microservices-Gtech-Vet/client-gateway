import { IsInt, IsOptional } from "class-validator";

export class CreateEspecieRazaPatologiaDto {
    @IsOptional()
    @IsInt()
    especie_id?: number;

    @IsOptional()
    @IsInt()
    raza_id?: number;

    @IsInt()
    patologia_id: number;

    @IsInt()
    empresa_id: number;
}

