import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, UploadedFiles, Inject, ParseIntPipe, BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { CreateExameneDto } from './dto/create-examene.dto';
import { UpdateExameneDto } from './dto/update-examene.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { CreateExameneBodyDto } from './dto/create-examene-body.dto';

@Controller('examenes')
export class ExamenesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('subir')
  @UseInterceptors(AnyFilesInterceptor({
    storage: diskStorage({
      destination: './uploads/examenes',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateExameneBodyDto,
    @User() user: CurrentUser,
  ) {
    const archivos = files.map((file) => ({
      originalname: file.originalname,
      mimetype: file.mimetype,
      path: file.path.replace(/\\/g, '/'),
    }));

    const empresa_id = Number(body.empresa_id);
    const consulta_id = Number(body.consulta_id);

    if (isNaN(empresa_id) || isNaN(consulta_id)) {
      throw new BadRequestException('empresa_id o consulta_id no son números válidos');
    }

    const payload = {
      ...body,
      archivos,
      userId: user.id,
      empresa_id,
      consulta_id,
    };

    try {
      const respuesta = await firstValueFrom(
        this.client.send({ cmd: 'subir_examen_archivo' }, payload)
      );

      // Si el microservicio devuelve status: 'error', lanza un error
      if (respuesta?.status === 'error') {
        throw new BadRequestException(respuesta.message || 'Error en microservicio');
      }

      return respuesta;
    } catch (error) {
      console.error('❌ Error en client-gateway:', error);
      throw new InternalServerErrorException(error.message || 'Error interno');
    }
  }





  @Get('por-consulta/:consultaId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async obtenerExamenes(
    @Param('consultaId', ParseIntPipe) consultaId: number,
    @User() user: CurrentUser,
  ) {
    return await firstValueFrom(
      this.client.send({ cmd: 'obtener_examenes_por_consulta' }, {
        consultaId,
        userId: user.id,
      }),
    );
  }


}
