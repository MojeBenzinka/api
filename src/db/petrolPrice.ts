import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PetrolStation } from "./petrolStation";
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
  // @CreateDateColumn()
  createdAt: Date;

  @Column("timestamptz", { name: "updated_at" })
  // @UpdateDateColumn()
  updatedAt: Date;

  @Column("uuid", { name: "petrol_type_id" })
  petrolTypeId: string;

  @ManyToOne(() => PetrolType, (petrolType) => petrolType.prices, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "petrol_type_id", referencedColumnName: "id" }])
  petrolType: PetrolType;

  // @Column("date", { name: "valid_from" })
  // validFromStr: string;

  @Column("date", { name: "date", nullable: true })
  dateStr?: string;

  // // getter validFrom
  // get validFrom(): Date {
  //   return new Date(this.validFromStr);
  // }

  // set validFrom(value: Date) {
  //   // set YYYY-MM-DD
  //   this.validFromStr = value.toISOString().split("T")[0];
  // }

  // // setter
  // set validTo(value: Date | null) {
  //   if (!value) {
  //     this.validToStr = null;
  //   } else {
  //     // set YYYY-MM-DD
  //     this.validToStr = value.toISOString().split("T")[0];
  //   }
  // }

  // // getter validToStr
  // get validTo(): Date | null {
  //   if (!this.validToStr) return null;
  //   return new Date(this.validToStr);
  // }
}
