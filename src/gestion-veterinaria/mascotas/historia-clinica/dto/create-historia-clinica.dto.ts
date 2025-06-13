import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateHistoriaClinicaDto {
    @IsInt()
    mascota_id: number;

    @IsInt()
    empresa_id: number;

    @IsOptional()
    @IsString()
    hic_estado?: string;
}
