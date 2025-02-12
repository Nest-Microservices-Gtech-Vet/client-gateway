import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  @Post('login')
  async login(@Body() data: { email?: string; ruc?: string; password: string }) {
    console.log('➡️ Enviando solicitud a usuarios-ms:', data);

    try {
      const response = await this.client.send('auth.login', data).toPromise();

      console.log('⬅️ Respuesta de usuarios-ms:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      throw new Error('Error interno en el gateway');
    }
  }
}
