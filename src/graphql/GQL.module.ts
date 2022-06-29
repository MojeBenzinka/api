import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { PetrolType } from "src/db/petrolType";
import { StationPetrolRel } from "src/db/stationPetrolRel";
import { CompanyResolver } from "./resolvers/company.resolver";
import { PetrolTypeResolver } from "./resolvers/petrolType.resolver";
import { PriceResolver } from "./resolvers/price.resolver";
import { SearchResolver } from "./resolvers/search.resolver";
import { StationsResolver } from "./resolvers/stations.resolver";
import { DateScalar } from "./scalars/date.scalar";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      PetrolCompany,
      PetrolSuperType,
      PetrolStation,
      Price,
      PetrolType,
      StationPetrolRel,
    ]),
  ],
  providers: [
    // Resolvers
    StationsResolver,
    CompanyResolver,
    PriceResolver,
    PetrolTypeResolver,
    PetrolTypeResolver,
    SearchResolver,
    // Services

    // Scalars
    DateScalar,
  ],
})
export class GQLModule {}
