import { Logger } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolType } from "src/db/petrolType";
import { EntityManager, Repository } from "typeorm";

@Resolver("Price")
export class PriceResolver {
  private readonly logger = new Logger(PriceResolver.name);

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

  private isSameDay(date1: Date, date2: Date) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  @ResolveField("type")
  async type(@Parent() price: Price) {
    const type = await this.petrolTypeRepo.findOneBy({
      id: price.petrolTypeId,
    });
    return type;
  }

  @Mutation("updatePrice")
  async updatePrice(
    @Args("stationId") id: string,
    @Args("petrolTypeId") typeId: string,
    @Args("price") price: number,
  ): Promise<boolean> {
    const now = new Date();
    // if already exist with updated_at
    // get latest
    try {
      const latest = await this.pricesRepo.findOne({
        where: { stationId: id, petrolTypeId: typeId },
        order: { updatedAt: "DESC" },
      });

      if (latest && this.isSameDay(latest.updatedAt, now)) {
        // update
        latest.price = price;
        latest.updatedAt = now;
        await this.pricesRepo.save(latest);
        return true;
      }

      const newPrice = new Price();
      newPrice.stationId = id;
      newPrice.petrolTypeId = typeId;
      newPrice.price = price;
      newPrice.updatedAt = now;
      await this.pricesRepo.save(newPrice);
      return true;
    } catch (e) {
      this.logger.error(e);
    }
    return false;
  }
}
