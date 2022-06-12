import { Logger } from "@nestjs/common";
import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { Price } from "src/db/petrolPrice";
import { PetrolStation } from "src/db/petrolStation";
import { PetrolSuperType } from "src/db/petrolSuperType";
import { PetrolType } from "src/db/petrolType";
import { EntityManager, Repository } from "typeorm";

@Resolver("PetrolType")
export class PetrolTypeResolver {
  private readonly logger = new Logger(PetrolTypeResolver.name);

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
    @InjectRepository(PetrolSuperType)
    private readonly petrolSuperTypeRepo: Repository<PetrolSuperType>,
  ) {}

  @ResolveField("superType")
  async type(@Parent() price: PetrolType) {
    const type = await this.petrolSuperTypeRepo.findOneBy({
      id: price.superTypeId,
    });
    return type;
  }

  @Query("petrolTypes")
  async petrolTypes(): Promise<PetrolType[]> {
    const types = await this.petrolTypeRepo.find();
    return types;
  }
}
