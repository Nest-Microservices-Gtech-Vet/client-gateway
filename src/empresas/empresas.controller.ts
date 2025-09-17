import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, Request, UseGuards, InternalServerErrorException, BadRequestException, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { EMPRESAS_SERVICE, NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, throwError } from 'rxjs';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { Token, User } from 'src/auth/decorators';
import { CreateEmpresaUsuarioDto } from './dto/create-empresa-usuario.dto';
import { PaginationDto } from 'src/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { fotoLogoUploadOptions } from 'src/gestion-veterinaria/mascotas/utils/foto-upload.options';

const saveFoto = (file: Express.Multer.File) => {
  const rutaLogo = path.join(process.cwd(), 'uploads', 'logos');


<<<<<<< Updated upstream
  if (!fs.existsSync(rutaLogo)) {
    fs.mkdirSync(rutaLogo, { recursive: true });
  }

  console.log('📂 Ruta donde se guardará la imagen:', rutaLogo);

  const filePath = path.join(rutaLogo, file.filename);
  fs.writeFileSync(filePath, file.buffer);
};

=======
>>>>>>> Stashed changes
@Controller('empresas')
export class EmpresasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
<<<<<<< Updated upstream
  @UseInterceptors(FileInterceptor('foto', fotoLogoUploadOptions))
  createEmp(@UploadedFile() foto: Express.Multer.File, @Body() createEmpresaDto: CreateEmpresaDto, @User() user: CurrentUser, @Token() token: string) {
    console.log('Enviando mensaje a create_empresa', createEmpresaDto);

    let fileName: string | undefined;

    if (foto) {
      fileName = foto.filename;
    }

    const payload = {
      createEmpresaDto: {
        ...createEmpresaDto,
        emp_foto: fileName,
      },
      user,
    };

=======
  createEmp(@Body() createEmpresaDto: CreateEmpresaDto, @User() user: CurrentUser, @Token() token: string) {
    const payload = { ...createEmpresaDto, createdBy: user.id };
>>>>>>> Stashed changes
    return this.client.send({ cmd: 'create_empresa' }, payload);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
<<<<<<< Updated upstream
  findAllEmpresas(
    @Query() paginationDto: PaginationDto,
    @User() user: CurrentUser,
    @Token() token: string
  ) {
    const payload = {
      paginationDto,


    }
    return this.client.send({ cmd: 'findAll_empresas' }, payload);
=======
  findAllEmpresas(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAll_empresas' }, { paginationDto });
>>>>>>> Stashed changes
  }

  @Get('inactivas')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
<<<<<<< Updated upstream
  findAllEmpresasInactivas(
    @Query() paginationDto: PaginationDto,
    @User() user: CurrentUser,
    @Token() token: string
  ) {
    const payload = {
      paginationDto,


    }
    return this.client.send({ cmd: 'findAll_empresas.inac' }, payload);
  }

  // @Get(':id')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('SUPERADMIN', 'ADMIN')
  // async findOne(@Param('id') emp_id: string,
  //   user: CurrentUser,
  //   @Token() token: string
  // ) {
  //   return this.client.send({ cmd: 'findOne_empresa' }, { emp_id: Number(emp_id) })
  //     .pipe(
  //       catchError(err => { throw new RpcException(err) })
  //     );
  // }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @UseInterceptors(FileInterceptor('foto', fotoLogoUploadOptions))
  updateEmpresa(
    @Param('id', ParseIntPipe) emp_id: number,
    @UploadedFile() foto: Express.Multer.File,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @User() user: CurrentUser, @Token() token: string) {
    let fileName: string | undefined = updateEmpresaDto.emp_foto;

    if (foto) {
      fileName = foto.filename; // ✅ si viene nueva foto, reemplaza
    }

    const payload = {
      emp_id,
      updatedBy: user.id,
      updateEmpresaDto: {
        ...updateEmpresaDto,
        emp_foto: fileName,
      },
    };

    return this.client.send({ cmd: 'update_empresa' }, payload).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
=======
  findAllEmpresasInactivas(@Query() paginationDto: PaginationDto) {
    return this.client.send({ cmd: 'findAll_empresas.inac' }, { paginationDto });
  }

  @Post('asignar-usuarios')
  async asignarUsuarios(@Body() dto: CreateEmpresaUsuarioDto) {
    return this.client.send({ cmd: 'asignar-usuarios-empresa' }, dto)
      .pipe(catchError(err => { throw new RpcException(err) }));
>>>>>>> Stashed changes
  }

  @Get('mis-empresas/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN', 'USUARIO')
  async obtenerEmpresasPorId(@Param('id') id: string) {
    const user = { id: parseInt(id) };
    return this.client.send('empresas.mis-empresas', { user }).toPromise();
  }

  @Post(':id/asignar-usuarios')
  async asignarUsuariosEmpresa(@Param('id', ParseIntPipe) id: number, @Body() body: { usuarioIds: number[] }) {
    return this.client.send(
      { cmd: 'asignar-usuarios-empresa' },
      { empresaId: id, usuarioIds: body.usuarioIds }
    ).toPromise();
  }

<<<<<<< Updated upstream

=======
  @Get(':id')
  async findEmpresa(@Param('id', ParseIntPipe) id: number) {
    const empresa = await this.client.send('empresas.findById', id).toPromise();
    const usuarioIds = empresa.empresaUsuario.map((eu) => eu.usuarioId);
    const admins = usuarioIds.length
      ? await this.client.send('usuarios.getByIds', { ids: usuarioIds }).toPromise()
      : [];
    return { ...empresa, admins };
  }
>>>>>>> Stashed changes

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  updateEmpresa(@Param('id', ParseIntPipe) emp_id: number, @Body() updateEmpresaDto: UpdateEmpresaDto, @User() user: CurrentUser) {
    return this.client.send({ cmd: 'update_empresa' }, { emp_id, updatedBy: user.id, updateEmpresaDto })
      .pipe(catchError(err => { throw new RpcException(err) }));
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  removeEmpresa(@Param('id', ParseIntPipe) emp_id: number, @User() user: CurrentUser) {
    return this.client.send({ cmd: 'delete_empresa' }, { emp_id, updatedBy: user.id })
      .pipe(catchError(err => throwError(() => new RpcException('Error al querer eliminar la empresa'))));
  }

  // 👇 ESTA VA AL FINAL

}












