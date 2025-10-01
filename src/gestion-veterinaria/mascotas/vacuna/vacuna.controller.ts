import {
  Controller, Post, UseGuards, UseInterceptors, UploadedFiles, Body, InternalServerErrorException, Get, Param, ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { firstValueFrom } from 'rxjs';
import { Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateVacunaDto } from './dto/create-vacuna.dto';
import { User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { UpdateVacunaDto } from './dto/update-vacuna.dto';

const saveFoto = (file: Express.Multer.File) => {
  const rutaPerfil = path.join(process.cwd(), 'vacunas', 'perfil');


  if (!fs.existsSync(rutaPerfil)) {
    fs.mkdirSync(rutaPerfil, { recursive: true });
  }

  console.log('📂 Ruta donde se guardará la imagen:', rutaPerfil);

  const filePath = path.join(rutaPerfil, file.filename);
  fs.writeFileSync(filePath, file.buffer);
};

@Controller('vacuna')
export class VacunaController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post('registrar')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/vacunas',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async crearVacunaConFotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateVacunaDto,

    @User() user: CurrentUser,
  ) {
    try {
      // ⚠️ Convertimos a número manualmente
      const parsedDto = {
        ...body,
        empresa_id: parseInt(body.empresa_id),
        mascota_id: parseInt(body.mascota_id),
        //numeroConsulta: parseInt(body.numeroConsulta),
      };

      // Extraemos las URLs de las fotos
      const fotos = files.map(file => ({
        url: `/uploads/vacunas/${file.filename}`,
      }));

      const payload = {
        createVacunaDto: parsedDto,
        fotos: fotos,
        user: { id: user.id },
      };

      return await firstValueFrom(
        this.client.send({ cmd: 'vacunas.crear-con-fotos' }, payload),
      );
    } catch (error) {
      console.error('Error creando vacuna con fotos:', error);
      throw new InternalServerErrorException('Error creando vacuna con fotos');
    }
  }

  @Get('consulta/:consultaId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getVacunasPorConsulta(
    @Param('consultaId', ParseIntPipe) consultaId: number,
    @User() user: CurrentUser,
  ) {
    return await firstValueFrom(
      this.client.send({ cmd: 'vacunasPorConsulta' }, { consultaId }),
    );
  }

  @Get('mascota/:mascotaId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getVacunasPorMascota(
    @Param('mascotaId', ParseIntPipe) mascotaId: number,
    @User() user: CurrentUser,
  ) {
    return await firstValueFrom(
      this.client.send({ cmd: 'vacunasPorMascota' }, { mascotaId }),
    );
  }
  //************************************************************************************************** */
  //inicio actualizar mascota
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads/vacunas',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateVacuna(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: UpdateVacunaDto,
    @User() user: CurrentUser,
  ) {
    const parsedDto = {
      ...body,
      empresa_id: body.empresa_id !== undefined ? parseInt(body.empresa_id) : undefined,
      mascota_id: body.mascota_id !== undefined ? parseInt(body.mascota_id) : undefined,
    };


    const fotos = files.map(file => ({
      url: `/uploads/vacunas/${file.filename}`,
    }));

    const payload = {
      id: parseInt(id),   // 👈 aquí se pasa el id
      updateVacunaDto: parsedDto,
      fotos,
      archivosAEliminar: body.archivosAEliminar || [],
      user: { id: user.id },
    };

    return await firstValueFrom(
      this.client.send({ cmd: 'vacunas.actualizar-con-fotos' }, payload),
    );
  }





  //fin actualiozar mascota
  //************************************************************************************************** */
}
