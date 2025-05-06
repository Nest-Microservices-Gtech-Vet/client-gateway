import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { USERS_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) { }


  @Post()
  createProduct(@Body() createUserDto: CreateUserDto,) {
    return this.usersClient.send({ cmd: 'create_users' }, createUserDto);
  }


  @Get()
  findUsers(@Query() paginationDto: PaginationDto,) {
    console.log('🛠 Token validado en client-gateway:',);
    return this.usersClient.send(
      { cmd: 'findAll_users' },
      paginationDto).toPromise();
  }


  @Get(':id')
  async findOne(@Param('id') usua_id: string,) {
    return this.usersClient.send({ cmd: 'findOne_users' }, { id: Number(usua_id) })
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


  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto,

  ) {
    const payload = { ...updateUserDto, usua_id };
    console.log('🛠 Enviando datos a usuarios-ms:', payload);

    return this.usersClient.send({ cmd: 'update_users' }, payload).toPromise();
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

}
