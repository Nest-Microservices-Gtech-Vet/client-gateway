import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { USER_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(
    @Inject(USER_SERVICE) private readonly usersClient: ClientProxy,
  ) { }
  //---------------Empieza Crear usuario-------------
  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() createUserDto: CreateUserDto, @Req() request) {
    const authToken = request.headers.authorization; // 🔥 Extrae el token del header

    if (!authToken) {
      console.error('❌ No Authorization header en la solicitud a usuarios-ms');
      throw new UnauthorizedException('Token de autorización faltante');
    }

    console.log(`➡️ Enviando creación de usuario a usuarios-ms con createdBy: ${request.user.userId}`);

    return this.usersClient.send('create_users', {
      createUserDto,
      createdBy: request.user.userId, // 🔥 Se envía el usuario autenticado
      authorization: authToken, // 🔥 Se envía el token en la petición TCP
    }).toPromise();
  }
  //--------------Fin crear usuario----------------
  //---------------empieza obtener todos los usuarios--------------------------------------------------
  @Get()
  @UseGuards(JwtAuthGuard) // ⬅️ Protege la ruta en el Gateway
  async findAll(@Query() paginationDto, @Req() request) {
    const authToken = request.headers.authorization; // Extrae el token del header
    console.log('➡️ Enviando solicitud a usuarios-ms:', paginationDto, 'con token:', authToken);

    if (!authToken) {
      console.error('❌ No Authorization header en la solicitud');
      throw new Error('No Authorization header');
    }

    return this.usersClient.send('findAll_users', {
      pagination: paginationDto, // 🔄 Enviar paginación correctamente
      authorization: authToken
    }).toPromise();
  }
  //--------------Fin obtener usuarios-------------

  //--------------empieza obtener usuarios por id-------------
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') usua_id: string, @Req() request) {
    const authToken = request.headers.authorization; // ⬅️ Extraemos el token del header
    if (!authToken) {
      console.error('❌ No Authorization header en la solicitud');
      throw new Error('No Authorization header');
    }

    return this.usersClient.send({ cmd: 'findOne_users' }, {
      usua_id: Number(usua_id),
      authorization: authToken,
    }).toPromise();
  }
  //---------------fin de obtener usuario por id--------------

  //---------------Empieza borrado logico de usuarios--------------
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') usua_id: number, @Req() request) {
    const authToken = request.headers.authorization;
    const user = request.user;
    console.log(`➡️ Enviando solicitud a usuarios-ms para eliminar usuario con ID: ${usua_id}, con token:`, authToken);

    if (!authToken) {
      console.error('❌ No Authorization header en la solicitud');
      throw new Error('No Authorization header');
    }

    
    return this.usersClient.send({ cmd: 'delete_users' }, { 
      usua_id: Number(usua_id), 
      updatedBy: user.userId,
      authorization: authToken, 
    }).toPromise();

  }
  //---------------fin borralo logico usuarios---------------
  
  //---------------Empieza actualizar un usuario-------------
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request,
  ) {

    const authToken = request.headers.authorization //extrae el token del header
    const updatedBy = request.user.userId;

    console.log(`➡️ Enviando actualización de usuario a usuarios-ms con updatedBy: ${updatedBy}`);
    console.log(`➡️ Datos enviados:`, updateUserDto);

    return this.usersClient.send('update_users', {
      usua_id,
      updateUserDto,
      updatedBy,
      authorization: authToken,
    }).toPromise();

  }
  //-----------termina actualizacion ------------

}
