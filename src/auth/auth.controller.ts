import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { USERS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(USERS_SERVICE) private readonly userClient: ClientProxy,
    private readonly authService: AuthService) { }

  @Post('login-superadmin')
  loginSuperAdmin(@Body() body: { email: string, password: string }) {
    return this.userClient.send({ cmd: 'login-superadmin' }, body).toPromise();
  }

  @Post('login-admin')
  loginAdmin(@Body() body: { ruc: string, password: string }) {
    return this.userClient.send({ cmd: 'login-admin' }, body).toPromise();
  }

}
