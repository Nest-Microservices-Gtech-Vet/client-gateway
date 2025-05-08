import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE, USERS_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { Roles, Token, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { RolesGuard } from 'src/auth/guards/roles-guard';



@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  createUser(@Body() createUserDto: CreateUserDto, @User() user: CurrentUser, @Token() token: string) {
    const payload = {
      ...createUserDto,
      createdBy: user.id,
    }
    return this.client.send({ cmd: 'create_users' }, payload);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get()
  findUsers(@Query() paginationDto: PaginationDto, @User() user: CurrentUser, @Token() token: string) {
    console.log('🛠 Token validado en client-gateway:',);
    return this.client.send(
      { cmd: 'findAll_users' },
      paginationDto).toPromise();
  }


  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async findOne(@Param('id') usua_id: string, @User() user: CurrentUser, @Token() token: string) {
    return this.client.send({ cmd: 'findOne_users' }, { id: Number(usua_id) })
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  patchUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: CurrentUser, @Token() token: string
  ) {
    const payload = { ...updateUserDto, usua_id, updatedBy: user.id };
    console.log('🛠 Enviando datos a usuarios-ms:', payload);

    return this.client.send({ cmd: 'update_users' }, payload).toPromise();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  deleteUser(@Param('id', ParseIntPipe) usua_id: number,@User() user: CurrentUser, @Token() token: string) {
    return this.client.send({ cmd: 'delete_users' }, { usua_id ,updatedBy: user.id })
      .pipe(
        catchError(err => {
          console.error('Error al eliminar usuario:', err);
          return throwError(() => new RpcException('Error al eliminar el usuario'));
        }),
      );

  }

}
