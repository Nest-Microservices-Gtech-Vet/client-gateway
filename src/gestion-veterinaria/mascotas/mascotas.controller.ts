import { Body, Controller, Delete, Get, Inject, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateMascotaDto, MascotaBusquedaDto } from './dto/create-mascota.dto';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { fotoUploadOptions } from './utils/foto-upload.options';
import * as fs from 'fs';
import * as path from 'path';
import { PaginationDto } from 'src/common';


const saveFoto = (file: Express.Multer.File) => {
  const rutaPerfil = path.join(process.cwd(), 'uploads', 'perfil');


  if (!fs.existsSync(rutaPerfil)) {
    fs.mkdirSync(rutaPerfil, { recursive: true });
  }

  console.log('📂 Ruta donde se guardará la imagen:', rutaPerfil);

  const filePath = path.join(rutaPerfil, file.filename);
  fs.writeFileSync(filePath, file.buffer);
};


@Controller('mascotas')
export class MascotasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  //inicia crear mascotas
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('foto', fotoUploadOptions))
  async createMascotas(
    @UploadedFile() foto: Express.Multer.File,
    @Body() createMascotaDto: any,
    @User() user: CurrentUser,
  ) {
    let fileName: string | undefined;

    if (foto) {
      fileName = foto.filename;
    }

    const payload = {
      ...createMascotaDto,
      mas_foto: fileName,
    };

    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'crear_mascota' }, {
          createMascotaDto: payload,
          user: { id: user.id },
        }),
      );
    } catch (error) {
      console.error('Error al crear mascota:', error);
      throw new InternalServerErrorException(
        error?.response?.message || 'Error al crear mascota',
      );
    }
  }
  //fin crear mascotas
  //************************************************************************************************** */
  //inicio obtener mascotas se gun empresa
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(
    @User() user: CurrentUser,
    //@Query('empresa_id') empresaId: string,
    @Query() query: MascotaBusquedaDto,
  ) {
    const { empresa_id, ...paginationDto } = query;
    try {
      return await firstValueFrom(
        this.client.send(
          { cmd: 'findAll_mascotas' },
          {
            adminId: user.id,
            empresaId: empresa_id,
            paginationDto
          })
      );
    } catch (error) {
      console.error('Error al obtener mascotas:', error);
      throw new InternalServerErrorException('No se pudo obtener la lista de mascotas');
    }
  }

  //fin obtener mascotas se gun empresa
  //************************************************************************************************** */
  //inicio obtener mascota por id se gun empresa
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findMascotaById(
    @Param('id', ParseIntPipe) id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'mascotaById' }, {
          id,
          user: { id: user.id }
        })
      )
    } catch (error) {
      console.error('Error al obtener mascota con id', error);
      throw new InternalServerErrorException('Error al listar clientes');
    }
  }
  //fin obtener mascotas por id se gun empresa
  //************************************************************************************************** */
  //inicio actualizar mascota
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(AnyFilesInterceptor())
  async updateMascota(
    @Param('id', ParseIntPipe) mas_id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
    @User() user: CurrentUser,
  ) {
    try {
      console.log('Archivos recibidos:', files); // ✅ ¿Se imprime algo?
      console.log('Body keys:', Object.keys(body));
      const foto = files?.find((file) => file.fieldname === 'mas_foto');

      console.log('body instanceof FormData?', body instanceof FormData);
      console.log('body keys:', Object.keys(body));

      const updateMascotaDto: any = {
        mas_nombre: body.mas_nombre,
        mas_fechaNac: body.mas_fechaNac,
        mas_peso: parseFloat(body.mas_peso),
        mas_color: body.mas_color,
        mas_esterilizado: body.mas_esterilizado === 'true',
        mas_microchip: body.mas_microchip,
        mas_notas: body.mas_notas,
        activo: body.activo === 'true',
        empresa_id: parseInt(body.empresa_id),
        especie: { connect: { esp_id: parseInt(body.especie_id) } },
        raza: { connect: { raz_id: parseInt(body.raza_id) } },
        propietario: { connect: { cli_id: parseInt(body.cliente_id) } },
      };

      if (foto && foto.buffer) {
        const ext = path.extname(foto.originalname);
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        foto.filename = nombreUnico;

        // Usar la función helper
        saveFoto(foto);

        updateMascotaDto.mas_foto = nombreUnico;
      }


      return await firstValueFrom(
        this.client.send({ cmd: 'mascota_update' }, {
          mas_id,
          updateMascotaDto,
          updatedBy: user.id,
          user: { id: user.id },
          files,
        })
      );
    } catch (error) {
      console.error('❌ Error al actualizar mascota:', error);
      throw new InternalServerErrorException('No se pudo actualizar la mascota');
    }
  }



  //fin actualiozar mascota
  //************************************************************************************************** */
  //inicio borrado logico
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async removeMacota(
    @Param('id', ParseIntPipe) mas_id: number,
    @User() user: CurrentUser,
  ) {
    try {
      return await firstValueFrom(
        this.client.send({ cmd: 'mascota_delete' }, {
          mas_id,
          user: { id: user.id },
          updatedBy: user.id
        })
      );
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      throw new InternalServerErrorException('No se pudo eliminar el mascota');
    }
  }
  //fin borrado logico
  //************************************************************************************************************** */

}
