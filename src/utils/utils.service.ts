import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PetrolStation } from "src/db/petrolStation";
import { Repository } from "typeorm";
import { getDistance } from "geolib";
import { Price } from "src/db/petrolPrice";

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);
  constructor(
    @InjectRepository(PetrolStation)
    private readonly stationsRepo: Repository<PetrolStation>,
  ) {}

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    return getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 },
    );
  }

  async removeDuplicateStations() {
    const tresholdM = 24;

    const toRemove: PetrolStation[] = [];

    const stations = await this.stationsRepo.find({});

    // calculate distance between stations
    for (let i = 0; i < stations.length; i++) {
      const station1 = stations[i];
      for (let j = i + 1; j < stations.length; j++) {
        const station2 = stations[j];

        if (station1.id == station2.id) {
          continue;
        }
        const distance = this.calculateDistance(
          station1.lat,
          station1.lon,
          station2.lat,
          station2.lon,
        );

        // if (distance < 1000 && station1.companyId == station2.companyId)
        //   this.logger.log(`${station1.id} ${station2.id} ${distance}`);
        if (distance <= tresholdM && station1.companyId == station2.companyId) {
          if (toRemove.some((s) => s.id == station1.id)) {
            continue;
          }
          toRemove.push(station2);
          this.logger.log(`Station: ${station2.id} (${distance}m) removed`);
        }
      }
    }

    this.logger.log(`removing ${toRemove.length} duplicate stations`);

    await this.stationsRepo.remove(toRemove);
  }
}