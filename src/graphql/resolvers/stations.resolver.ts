import { Logger } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { EntityManager, Repository, MoreThan, In } from "typeorm";
import { v4 as uuidv4 } from "uuid";

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

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }

  @ResolveField("company")
  async place(@Parent() station: PetrolStation) {
    const cId = station.companyId;
    const place = await this.companyRepo.findOneBy({ id: cId });
    return place;
  }

  @Query("stations")
  async stations(
    @Args("companyIds") companyIds?: string[],
  ): Promise<PetrolStation[]> {
    let stations = [];
    if (companyIds && companyIds.length > 0) {
      stations = await this.stationsRepo.find({
        where: { companyId: In(companyIds) },
      });
    } else {
      stations = await this.stationsRepo.find();
    }

    return stations;
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

  @ResolveField("pricesHistory")
  async pricesHistory(@Parent() station: PetrolStation): Promise<Price[][]> {
    // prices for last 2 months
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 2);

    const prices = await this.pricesRepo.find({
      where: { stationId: station.id, createdAt: MoreThan(monthAgo) },
      order: { updatedAt: "DESC" },
    });

    const groupped: Price[][] = [];

    for (const price of prices) {
      const existing = groupped.find((x) =>
        x.some((y) => y.petrolTypeId == price.petrolTypeId),
      );

      if (existing) {
        existing.push(price);
        continue;
      }

      groupped.push([price]);
    }

    const today = new Date();

    for (const g of groupped) {
      if (g.length === 0) continue;

      if (
        !g.some(
          (x) =>
            this.isSameDate(x.createdAt, today) ||
            this.isSameDate(x.updatedAt, today),
        )
      ) {
        const latest = g.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        )[0];
        g.push({
          ...latest,
          updatedAt: today,
          createdAt: today,
          id: uuidv4(),
        });
      }
    }

    return groupped;
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
