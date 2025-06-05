import {
  Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { Roles, Token, User } from 'src/auth/decorators';
import { CurrentUser } from 'src/auth/interfaces/current-user';
import { RolesGuard } from 'src/auth/guards/roles-guard';


@Controller('users')
export class UsersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }




  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  createUser(
    @Body() createUserDto: CreateUserDto,
    @User() user: CurrentUser,
    @Token() token: string,
  ) {
    const payload = {
      ...createUserDto,
      createdBy: user.id,
    };
    return this.client.send({ cmd: 'create_users' }, payload);
  }



  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get()
  findUsers(
    @Query() paginationDto: PaginationDto,
    @User() user: CurrentUser,
    @Token() token: string,


  ) {
    const payload = {
      paginationDto,


    }
    console.log('🛠 Token validado en client-gateway:');
    return this.client
      .send({ cmd: 'findAll_users' }, payload)
      .toPromise();
  }

  @Get('por-rol')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  findUsuariosPorRolTest(@Query('rol') roles: string | string[]) {
    //const roles = rol.split(',');
    const rolArray = Array.isArray(roles) ? roles : [roles]
    console.log('🧪 Recibido rol plano:', roles);
    return this.client.send({ cmd: 'findAll_users.byRole' }, { usua_rol: roles }).toPromise();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get('inactivos')
  findUsersInactive(
    @Query() paginationDto: PaginationDto,
    @User() user: CurrentUser,
    @Token() token: string,
  ) {

    const payload = {
      paginationDto,


    }
    console.log('🛠 Token validado en client-gateway:');
    return this.client
      .send({ cmd: 'findAll_users.inactive' }, payload)
      .toPromise();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN', 'ADMIN')
  async findOne(
    @Param('id') usua_id: string,
    @User() user: CurrentUser,
    @Token() token: string,
  ) {
    return this.client
      .send({ cmd: 'findOne_users' }, { id: Number(usua_id) })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  patchUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: CurrentUser,
    @Token() token: string,
  ) {
    const payload = { ...updateUserDto, usua_id, updatedBy: user.id };
    console.log('🛠 Enviando datos a usuarios-ms:', payload);

    return this.client.send({ cmd: 'update_users' }, payload).toPromise();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  deleteUser(
    @Param('id', ParseIntPipe) usua_id: number,
    @User() user: CurrentUser,
    @Token() token: string,
  ) {
    return this.client
      .send({ cmd: 'delete_users' }, { usua_id, updatedBy: user.id })
      .pipe(
        catchError((err) => {
          console.error('Error al eliminar usuario:', err);
          return throwError(
            () => new RpcException('Error al eliminar el usuario'),
          );
        }),
      );
  }
  //********************************************************************** */

  //************************************************************************************************* */

  //********************************************************************************************** */

  @Get('ping-test')
  async pingTest() {
    console.log('📤 [client-gateway] Enviando ping_test...');
    const response = await this.client
      .send({ cmd: 'ping_test' }, { prueba: '123' })
      .toPromise();
    console.log('✅ [client-gateway] Respuesta recibida:', response);
    return response;
  }



}
