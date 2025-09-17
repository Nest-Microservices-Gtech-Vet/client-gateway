import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return '¡Felicidades! El servidor HTTPS está funcionando correctamente.';
  }
}