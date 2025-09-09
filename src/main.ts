import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { rcExceptionFilter } from './common';
import { join } from 'path';


async function bootstrap() {

  const logger = new Logger(`Main-gateway`);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // O especifica el dominio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',

    credentials: true,
  });


  /// Para servir archivos de otras carpetas si fuera necesario
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // // Para servir los exámenes
  // app.useStaticAssets(join(__dirname, '..', 'uploads', 'examenes'), {
  //   prefix: '/examenes',
  // });

  //  // Para servir las fotos de las mascotas
  // app.useStaticAssets(join(__dirname, '..', 'uploads', 'perfil'), {
  //   prefix: '/perfil',
  // });







  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
      enableImplicitConversion: true, // 🔹 convierte strings a number/boolean si el DTO lo espera
    },

    })
  );

  app.useGlobalFilters(new rcExceptionFilter())
  await app.listen(envs.port)

  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
