import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { rcExceptionFilter } from './common';
import { ProxyMiddleware } from './proxy/proxy.middleware';

async function bootstrap() {

  const logger = new Logger(`Main-gateway`);

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // O especifica el dominio permitido
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
 
    credentials: true,
  });


  // Middleware para pasar el token en cada petición
  app.use(new ProxyMiddleware().use);



  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new rcExceptionFilter())
  await app.listen(envs.port)

  logger.log(`Gateway running on port ${ envs.port }`);
}
bootstrap();
