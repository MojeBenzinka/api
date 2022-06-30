import { Logger } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolType } from "src/db/petrolType";
import { EntityManager, Repository, MoreThan, In, Between } from "typeorm";

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
    @InjectRepository(PetrolType)
    private readonly petrolTypeRepo: Repository<PetrolType>,
  ) {}

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() == date2.getDate()
    );
  }

  private findBounds(
    lat: number,
    lon: number,
    zoom: number,
  ): [number, number, number, number] {
    // czech republic center
    const centerLat = 49.81759;
    const centerLon = 15.4728;

    const latDiff = (lat - centerLat) / zoom;
    const lonDiff = (lon - centerLon) / zoom;

    const latMin = lat - latDiff;
    const latMax = lat + latDiff;
    const lonMin = lon - lonDiff;
    const lonMax = lon + lonDiff;

    this.logger.log(
      `lat: ${lat}, lon: ${lon}, zoom: ${zoom}, latDiff: ${latDiff}, lonDiff: ${lonDiff}, latMin: ${latMin}, latMax: ${latMax}, lonMin: ${lonMin}, lonMax: ${lonMax}`,
    );

    return [latMin, latMax, lonMin, lonMax];
  }

  private sortPrices(prices: Price[]): Price[] {
    return prices.sort((a, b) => {
      const aName = a.petrolType.name;
      const bName = b.petrolType.name;

      const aCategory = a.petrolType.superType.cat;
      const bCategory = b.petrolType.superType.cat;

      if (aCategory == bCategory) {
        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }
      }
      return aCategory > bCategory ? 1 : -1;
    });
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
    @Args("north") north?: number,
    @Args("south") south?: number,
    @Args("east") east?: number,
    @Args("west") west?: number,
  ): Promise<PetrolStation[]> {
    let bounds = {};
    // if (lat && lon && zoom) {
    //   const [latMin, latMax, lonMin, lonMax] = this.findBounds(lat, lon, zoom);
    //   bounds = { lat: Between(latMin, latMax), lon: Between(lonMin, lonMax) };
    // }

    if (north && south && east && west) {
      bounds = {
        lat: Between(south, north),
        lon: Between(west, east),
      };
    }

    let stations = [];
    if (companyIds && companyIds.length > 0) {
      stations = await this.stationsRepo.find({
        where: { companyId: In(companyIds), ...bounds },
        cache: true,
      });
    } else {
      stations = await this.stationsRepo.find({
        where: bounds,
        cache: true,
      });
    }

    return stations;
  }

  @Query("station")
  async station(@Args("id") id: string): Promise<PetrolStation> {
    return await this.stationsRepo.findOneBy({ id });
  }

  @ResolveField("petrolTypes")
  async availableFuelTypes(
    @Parent() station: PetrolStation,
  ): Promise<PetrolType[]> {
    const pId = station.id;

    const prices = await this.pricesRepo
      .createQueryBuilder("price")
      .where({ stationId: pId })
      .select("price.petrolTypeId")
      .distinct(true)
      .leftJoinAndSelect("price.petrolType", "petrolType")
      .distinctOn(["petrolType.id"])
      .getMany();

    const types = prices.map((x) => x.petrolType);

    return types;
  }

  @ResolveField("pricesHistory", () => [Price], {
    description: "Returns prices history for last 2 months",
  })
  async pricesHistory(@Parent() station: PetrolStation): Promise<Price[][]> {
    // prices for last 2 months
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 2);

    const prices = await this.pricesRepo.find({
      where: { stationId: station.id, createdAt: MoreThan(monthAgo) },

      order: { dateStr: "DESC" },
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

    // const today = new Date();

    // for (const g of groupped) {
    //   if (g.length === 0) continue;

    //   if (
    //     !g.some(
    //       (x) =>
    //         this.isSameDate(x.date, today) ||
    //         this.isSameDate(x.updatedAt, today),
    //     )
    //   ) {
    //     const latest = g.sort(
    //       (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    //     )[0];
    //     g.push({
    //       ...latest,
    //       updatedAt: today,
    //       createdAt: today,
    //       id: uuidv4(),
    //     });
    //   }
    // }

    // const sorted = groupped.map((x) => this.sortPrices(x));

    return groupped;
  }

  @ResolveField("prices", () => [Price], {
    description: "Returns current prices",
  })
  async prices(@Parent() station: PetrolStation): Promise<Price[]> {
    // prices for last  month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let prices = await this.pricesRepo.find({
      where: { stationId: station.id, createdAt: MoreThan(monthAgo) },
      relations: ["petrolType", "petrolType.superType"],
      order: {
        dateStr: "DESC",
        // petrolType: { superType: { cat: "ASC", name: "ASC" } },
      },
    });

    // const res = await this.pricesRepo
    //   .createQueryBuilder("price")
    //   .select("*")
    //   .leftJoin("price.petrolType", "petrolType")
    //   .leftJoin("petrolType.superType", "superType")
    //   .orderBy("created_at", "DESC")
    //   .addOrderBy("cat", "ASC")
    //   .addOrderBy("superType.name", "ASC")
    //   .addOrderBy("petrolType.name", "ASC")
    //   .getSql();

    // console.log(res);

    const distinctPrices: Price[] = [];

    for (const price of prices) {
      if (distinctPrices.some((x) => x.petrolTypeId == price.petrolTypeId))
        continue;

      distinctPrices.push(price);

      prices = prices.filter((x) => x.petrolTypeId != price.petrolTypeId);
    }

    const gasDiesel = distinctPrices.filter(
      (x) =>
        x.petrolType.superType.cat === "gas" ||
        x.petrolType.superType.cat === "diesel",
    );

    const rest = distinctPrices.filter(
      (x) =>
        x.petrolType.superType.cat !== "gas" &&
        x.petrolType.superType.cat !== "diesel",
    );

    return [...this.sortPrices(gasDiesel), ...this.sortPrices(rest)];
  }
}
