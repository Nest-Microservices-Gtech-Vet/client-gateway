import { IsInt, IsString } from "class-validator";

export class CreateEspecieDto {
    @IsString()
    esp_nombre: string;

    @IsInt()
    empresa_id: number;
}
