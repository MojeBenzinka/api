import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { UtilsController } from "./utils.controller";
import { UtilsService } from "./utils.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      PetrolCompany,
      PetrolSuperType,
      PetrolStation,
      Price,
    ]),
  ],
  providers: [UtilsService],
  controllers: [UtilsController],
})
export class UtilsModule {}
