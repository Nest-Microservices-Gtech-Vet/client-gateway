import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('uploads')
export class UploadsController {
  @Get('perfil/:file')
  getPerfilImage(@Param('file') file: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'perfil', file);
    if (!existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado');
    }
    return res.sendFile(filePath);
  }
}
