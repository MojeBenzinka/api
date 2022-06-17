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
import { PetrolStation } from "src/db/petrolStation";
import { PetrolType } from "src/db/petrolType";
import { StationPetrolRel } from "src/db/stationPetrolRel";
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
    @InjectRepository(PetrolType)
    private readonly petrolTypeRepo: Repository<PetrolType>,
    @InjectRepository(StationPetrolRel)
    private readonly petrolStationRepo: Repository<StationPetrolRel>,
  ) {}

  @Query("companies")
  async companies(): Promise<PetrolCompany[]> {
    return await this.companyRepo.find({ order: { name: "ASC" } });
  }

  @ResolveField("imgUrl")
  async imgUrl(@Parent() company: PetrolCompany) {
    // TODO: Fix to production
    return `https://dev.kdenatankuju.cz/stations/${company.logo_img}`;
  }

  @ResolveField("availablePetrols")
  async availablePetrols(
    @Parent() company: PetrolCompany,
  ): Promise<PetrolType[]> {
    const companyId = company.id;
    try {
      const petrols = await this.petrolStationRepo.find({
        where: { companyId },
        relations: ["petrolType"],
      });

      const petrolTypes = petrols.map((petrol) => petrol.petrolType);

      return petrolTypes;
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  @Mutation("addPetrolToCompany")
  async addPetrolToCompany(
    @Args("companyId") companyId: string,
    @Args("petrolTypeId") petrolTypeId: string,
  ): Promise<boolean> {
    // already exists
    const exists = await this.petrolStationRepo.findOne({
      where: { companyId, petrolTypeId },
    });
    if (exists) {
      return true;
    }

    const petrolStation = new StationPetrolRel();
    petrolStation.companyId = companyId;
    petrolStation.petrolTypeId = petrolTypeId;

    try {
      await this.petrolStationRepo.save(petrolStation);
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  @Mutation("removePetrolFromCompany")
  async removePetrolFromCompany(
    @Args("companyId") companyId: string,
    @Args("petrolTypeId") petrolTypeId: string,
  ): Promise<boolean> {
    // already exists
    const exists = await this.petrolStationRepo.findOne({
      where: { companyId, petrolTypeId },
    });
    if (exists) {
      try {
        await this.petrolStationRepo.delete({ companyId, petrolTypeId });
        return true;
      } catch (e) {
        this.logger.error(e);
        return false;
      }
    }

    return false;
  }
}
