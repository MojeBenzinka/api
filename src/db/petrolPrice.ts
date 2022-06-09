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
import { PetrolStation } from "./petrolStation";
import { PetrolSuperType } from "./petrolSuperType";
import { PetrolType } from "./petrolType";

@Entity("prices")
export class Price {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "float" })
  price: number;

  @Column({ type: "text" })
  currency: number;

  @Column("uuid", { name: "station_id" })
  stationId: string;

  @ManyToOne(() => PetrolStation, (station) => station.prices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "station_id", referencedColumnName: "id" }])
  station: PetrolStation;

  @Column("timestamptz", { name: "created_at" })
  createdAt: Date;

  @Column("timestamptz", { name: "updated_at" })
  updatedAt: Date;

  @Column("uuid", { name: "petrol_type_id" })
  petrolTypeId: string;

  @ManyToOne(() => PetrolType, (petrolType) => petrolType.prices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "petrol_type_id", referencedColumnName: "id" }])
  petrolType: PetrolType;
}
