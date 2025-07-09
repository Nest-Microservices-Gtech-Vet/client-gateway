import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateMedicamentoDto {
    @IsString()
    nombre: string;

    @IsString()
    dosis: string;

    @IsInt()
    empresa_id: number;



    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsOptional()
    @IsInt()
    updatedBy?: number;
}
