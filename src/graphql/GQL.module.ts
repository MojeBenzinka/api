import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { StationsResolver } from "./resolvers/stations.resolver";
import { DateScalar } from "./scalars/date.scalar";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PetrolCompany, PetrolSuperType, PetrolStation]),
  ],
  providers: [
    // Resolvers
    StationsResolver,
    // Services

    // Scalars
    DateScalar,
  ],
})
export class GQLModule {}
