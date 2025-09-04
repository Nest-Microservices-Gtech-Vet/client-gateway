import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { PaginationDto } from "src/common";

export class CreateMascotaDto {
  @IsString()
  mas_nombre: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  mas_fechaNac?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mas_peso?: number;

  @IsOptional()
  @IsString()
  mas_color?: string;

  @IsOptional()
  @IsBoolean()
  mas_esterilizado?: Boolean;

  @IsOptional()
  @IsString()
  mas_microchip?: string;

  @IsOptional()
  @IsString()
  mas_foto?: string;

  @IsOptional()
  @IsString()
  mas_notas?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) // Aquí la clave
  activo: boolean;

  @IsInt()
  cliente_id: number;

  @IsInt()
  especie_id: number;

  @IsInt()
  raza_id: number;

  @IsInt()
  @Type(() => Number) // ✅ Esto es lo importante
  empresa_id: number;

  @IsOptional()
  @IsInt()
  createdBy?: number;


  @IsOptional()
  @IsInt()
  updatedBy?: number;
}


export class MascotaBusquedaDto extends PaginationDto {
  @IsPositive()
  @Type(() => Number)
  empresa_id: number;

  @IsOptional()
  @IsString()
  propietario?: string;  // 🔎 buscar por nombre del propietario
}

