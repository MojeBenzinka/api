import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetrolCompany } from "./petrolCompany";
import { PetrolType } from "./petrolType";

@Entity("station_petrols")
export class StationPetrolRel {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column("uuid", { name: "company_id" })
  companyId: string;

  @ManyToOne(() => PetrolCompany, (petrolStation) => petrolStation.petrols, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: PetrolCompany;

  @Column("uuid", { name: "petrol_type_id" })
  petrolTypeId: string;

  @ManyToOne(() => PetrolType, (petrolType) => petrolType.petrols, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "petrol_type_id", referencedColumnName: "id" }])
  petrolType: PetrolType;
}
