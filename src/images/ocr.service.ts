import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import * as tesseract from "node-tesseract-ocr";

const opt = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  //   constructor() {}

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const res = await tesseract.recognize(file.buffer as Buffer, opt);
      return res;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(e);
    }
  }
}
