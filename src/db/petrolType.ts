import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Price } from "./petrolPrice";
import { PetrolSuperType } from "./petrolSuperType";

@Entity("petrol_types")
export class PetrolType {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  description: string;

  @OneToMany(() => Price, (price) => price.petrolTypeId)
  prices: Price[];

  @Column("uuid", { name: "super_type_id" })
  superTypeId: string;

  @ManyToOne(
    () => PetrolSuperType,
    (petrolSuperType) => petrolSuperType.petrolTypes,
    {
      onDelete: "NO ACTION",
      onUpdate: "NO ACTION",
    },
  )
  @JoinColumn([{ name: "super_type_id", referencedColumnName: "id" }])
  superType: PetrolSuperType;
}
