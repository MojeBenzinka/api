import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { OcrController } from "./ocr.controller";
import { OcrService } from "./ocr.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([PetrolCompany, PetrolSuperType, PetrolStation]),
  ],
  providers: [OcrService],
  controllers: [OcrController],
})
export class OcrModule {}
