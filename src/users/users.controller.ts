import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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

  @Post()
  createProduct(@Body() createUserDto: CreateUserDto) {
    return this.usersClient.send({ cmd: 'create_users' }, createUserDto);
  }

  //@UseGuards(JwtAuthGuard)
  // @Get()
  // findUsers( @Query() paginationDto: PaginationDto ){
  //   return this.usersClient.send({ cmd: 'findAll_users'}, paginationDto);
  // }

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



  @Get(':id')
  async findOne(@Param('id') usua_id: string) {
    return this.usersClient.send({ cmd: 'findOne_users' }, { usua_id: Number(usua_id) })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
    // try{
    //   const user = await firstValueFrom(
    //     this.usersClient.send({ cmd: 'findOne_users'}, {usua_id:Number(usua_id)})
    //   );
    //   return user
    // }catch (error) {
    //   throw new RpcException(error)
    // }


  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) usua_id: number) {
    return this.usersClient.send({ cmd: 'delete_users' }, { usua_id })
      .pipe(
        catchError(err => {
          console.error('Error al eliminar usuario:', err);
          return throwError(() => new RpcException('Error al eliminar el usuario'));
        }),
      );

  }

  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersClient.send({ cmd: 'update_users' }, { usua_id, ...updateUserDto })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );

  }

}
