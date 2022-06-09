import { Logger } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { PetrolCompany } from "src/db/petrolCompany";
import { PetrolStation } from "src/db/petrolStation";
import { EntityManager, Repository } from "typeorm";

@Resolver("Company")
export class CompanyResolver {
  private readonly logger = new Logger(CompanyResolver.name);

  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectRepository(PetrolStation)
    private readonly stationsRepo: Repository<PetrolStation>,
    @InjectRepository(PetrolCompany)
    private readonly companyRepo: Repository<PetrolCompany>,
  ) {}

  @Query("companies")
  async companies(): Promise<PetrolCompany[]> {
    return await this.companyRepo.find();
  }

  @ResolveField("imgUrl")
  async imgUrl(@Parent() company: PetrolCompany) {
    this.logger.log(company);
    // TODO: Fix to production
    return `https://dev.kdenatankuju.cz/stations/${company.logo_img}`;
  }
}
