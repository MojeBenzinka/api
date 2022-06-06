import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

const desc = `
<div>
  The Palivo API description<br/>
  <ul>
    <li><a href='/graphql' target="_blank" rel="noreferer noopener">GraphQL</a></li>
    <li><a href='https://studio.apollographql.com/sandbox/explorer?endpoint=https%3A%2F%2Fapi.kdenatankuju.cz%2Fgraphql' target="_blank" rel="noreferer noopener">GraphQL Sandbox</a></li>
  </ul>
</div>
`;

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Palivo API")
    .setDescription(desc)
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document);

  await app.listen(process.env.PORT ?? 3000);
};

bootstrap();
