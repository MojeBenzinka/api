import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetrolStation } from "./petrolStation";

@Entity("petrol_companies")
export class PetrolCompany {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  logo_img: string;

  @OneToMany(() => PetrolStation, (station) => station.companyId)
  stations: PetrolStation[];
}
