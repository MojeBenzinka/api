import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { PetrolCompany } from "./db/petrolCompany";
import { PetrolStation } from "./db/petrolStation";
import { PetrolSuperType } from "./db/petrolSuperType";
import { GQLModule } from "./graphql/GQL.module";
import { OcrModule } from "./images/ocr.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      ssl: {
        rejectUnauthorized: false,
      },
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [PetrolCompany, PetrolSuperType, PetrolStation],
      //synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      typePaths: ["./**/*.gql"],
      // definitions: {
      //   path: join(process.cwd(), "src/graphql/graphql.ts"),
      // },
      // playground: true,
      introspection: true,
      // installSubscriptionHandlers: true,
      // subscriptions: {
      //   "graphql-ws": true,
      // },
      plugins: [],
    }),
    GQLModule,
    OcrModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
