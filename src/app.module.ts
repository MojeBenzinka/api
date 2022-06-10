import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PetrolCompany } from "./db/petrolCompany";
import { PetrolStation } from "./db/petrolStation";
import { PetrolSuperType } from "./db/petrolSuperType";
import { GQLModule } from "./graphql/GQL.module";
import { OcrModule } from "./images/ocr.module";
import { Price } from "./db/petrolPrice";
import { PetrolType } from "./db/petrolType";
import { ApolloServerPluginCacheControl } from "apollo-server-core/dist/plugin/cacheControl";
import responseCachePlugin from "apollo-server-plugin-response-cache";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      ssl: {
        rejectUnauthorized: false,
      },
      url: process.env.DATABASE_URL,
      // host: process.env.DATABASE_HOST,
      // port: 5432,
      // username: process.env.DATABASE_USER,
      // password: process.env.DATABASE_PASSWORD,
      // database: process.env.DATABASE_NAME,
      entities: [
        PetrolCompany,
        PetrolSuperType,
        PetrolStation,
        Price,
        PetrolType,
      ],
      //synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: true,
      debug: false,
      typePaths: ["./**/*.gql"],

      // definitions: {
      //   path: join(process.cwd(), "src/graphql/graphql.ts"),
      // },
      playground: true,
      introspection: true,
      // installSubscriptionHandlers: true,
      // subscriptions: {
      //   "graphql-ws": true,
      // },
      plugins: [
        ApolloServerPluginCacheControl({ defaultMaxAge: 5 }), // optional
        responseCachePlugin(),
      ],
    }),
    GQLModule,
    OcrModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
