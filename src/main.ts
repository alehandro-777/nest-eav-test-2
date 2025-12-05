import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //CORS  temp 
  app.enableCors({
    origin: 'http://localhost:4200', // Angular
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With'
    ],
    exposedHeaders: ['Content-Disposition'], // важно для download
    credentials: true,                       // если используете cookies
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
