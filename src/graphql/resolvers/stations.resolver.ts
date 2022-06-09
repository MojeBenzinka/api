import { Logger } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { EntityManager, Repository } from "typeorm";

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
    @InjectRepository(Price)
    private readonly pricesRepo: Repository<Price>,
  ) {}

  @ResolveField("company")
  async place(@Parent() station: PetrolStation) {
    const cId = station.companyId;
    const place = await this.companyRepo.findOneBy({ id: cId });
    return place;
  }

  @Query("stations")
  async stations(): Promise<PetrolStation[]> {
    return await this.stationsRepo.find();
  }

  @Query("station")
  async station(@Args("id") id: string): Promise<PetrolStation> {
    return await this.stationsRepo.findOneBy({ id });
  }

  @ResolveField("latestPrice")
  async price(@Parent() station: PetrolStation): Promise<Price[]> {
    const pId = station.id;

    // find latest price for each petrol type
    const prices = await this.pricesRepo.find({
      where: { stationId: pId },
      order: { createdAt: "DESC" },
    });

    return prices;
  }

  @ResolveField("prices")
  async prices(@Parent() station: PetrolStation): Promise<Price[]> {
    // select last 10 price updates for station

    const prices = await this.pricesRepo.find({
      where: { stationId: station.id },
      order: { updatedAt: "DESC" },
      take: 10,
    });
    return prices ?? [];
  }
}
