import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('The FourB backend')
    .setDescription('FourB API 설명 테스트')
    .setVersion('0.1')
    .build();
  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/dev', app, document);

  await app.listen(3000);
}
bootstrap();
