import { Logger } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { PetrolStation } from "src/db/petrolStation";
import { EntityManager, Repository } from "typeorm";

const checkInSummaryQuery = `SELECT count(id) as "count", place_id as "placeId" FROM check_ins GROUP BY place_id;`;

@Resolver("Station")
export class StationsResolver {
  private readonly logger = new Logger(StationsResolver.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(PetrolStation)
    private readonly stationsRepo: Repository<PetrolStation>,
    @InjectRepository(PetrolCompany)
    private readonly companyRepo: Repository<PetrolCompany>,
  ) {}

  @ResolveField("company")
  async place(@Parent() station: PetrolStation) {
    const cId = station.companyId;
    const place = await this.companyRepo.findOneBy({ id: cId });
    return place;
  }

  @Query("stations")
  async checkInSummary(): Promise<PetrolStation[]> {
    return await this.stationsRepo.find();
  }
}
