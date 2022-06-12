import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { UtilsController } from "./utils.controller";
import { UtilsService } from "./utils.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PetrolCompany, PetrolSuperType, PetrolStation]),
  ],
  providers: [UtilsService],
  controllers: [UtilsController],
})
export class UtilsModule {}
