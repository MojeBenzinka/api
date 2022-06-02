import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetrolCompany } from "./petrolCompany";

@Entity("petrol_stations")
export class PetrolStation {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "float" })
  lat: number;

  @Column({ type: "float" })
  lon: number;

  @Column("uuid", { name: "company_id" })
  companyId: string;

  @ManyToOne(() => PetrolCompany, (company) => company.stations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: PetrolCompany;
}
