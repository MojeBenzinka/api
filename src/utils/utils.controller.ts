import {
  Controller,
  Get,
  Param,
  Query,
  StreamableFile,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { UtilsService } from "./utils.service";

@Controller("utils")
@ApiTags("utils")
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  // @Post("removeDupes")
  // async uploadFile() {
  //   return await this.utilsService.removeDuplicateStations();
  // }

  // @Post("checkPrices")
  // async priceCheck() {
  //   return await this.utilsService.checkPrices();
  // }
}
