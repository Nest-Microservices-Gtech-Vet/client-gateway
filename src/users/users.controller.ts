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
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createProduct(@Body() createUserDto: CreateUserDto, @Request() req ) {
    return this.usersClient.send({cmd: 'create_users'}, {createUserDto, user: req.user,});
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findUsers( @Query() paginationDto: PaginationDto, @Request() req ){
    console.log('🛠 Token validado en client-gateway:', req.user);
    return this.usersClient.send(
      { cmd: 'findAll_users'}, 
      {paginationDto, user: req.user,}).toPromise();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') usua_id: string, @Request() req) {
    return this.usersClient.send({ cmd: 'findOne_users'}, {usua_id:Number(usua_id),user: req.user})
    .pipe(
      catchError( err => { throw new RpcException(err)})
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto, 
    @Request() req
  ) {
    console.log('🛠 Enviando datos a usuarios-ms:', { usua_id, updateUserDto, user: req.user });
    return this.usersClient.send({cmd: 'update_users'}, {usua_id, updateUserDto, user: req.user})
    .toPromise();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) usua_id: number, @Request() req) {
    return this.usersClient.send({cmd: 'delete_users'}, { usua_id, user: req.user} )
    .pipe(
      catchError(err => {
        console.error('Error al eliminar usuario:', err); 
        return throwError(() => new RpcException('Error al eliminar el usuario'));
      }),
    );

  }

}
