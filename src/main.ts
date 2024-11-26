import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //数据校验,将此选项设置为 true，ValidationPipe 会自动移除所有 non-whitelisted 属性，“non-whitelisted” 意思是没有任何验证装饰器的属性。重要的是要注意该选项将会过滤所有没有验证装饰器的属性，即使是 DTO 中定义的属性也不例外。
  app.useGlobalPipes(new ValidationPipe({whitelist : true}));
  //添加swagger
  const config = new DocumentBuilder().setTitle('Median').setDescription('The Median API description').setVersion('0.1').build();  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app, document);
  app.enableCors({
    // origin: '<http://localhost>',
  });

  //注册全局通用异常过滤器HttpExceptionFilter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(30001);
}
bootstrap();
