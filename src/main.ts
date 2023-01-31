import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'yaml';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { fastifyCookie } from '@fastify/cookie';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET
  });

  const config = new DocumentBuilder()
    .setTitle('Cryptodiscrict API')
    .setDescription('Cryptodiscrict API documentation')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('/api');

  const document = SwaggerModule.createDocument(app, config);
  const yamlString = yaml.stringify(document, {});

  fs.writeFileSync('./docs/swagger-spec.yaml', yamlString);
  fs.writeFileSync('./docs/swagger-spec.json', JSON.stringify(document));

  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
})();
