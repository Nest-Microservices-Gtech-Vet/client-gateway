import { IsInt, IsString } from "class-validator";

export class CreateRazaDto {
    @IsString()
    raz_nombre: string;

    @IsInt()
    especie_id: number;

    @IsInt()
    empresa_id: number;
}

