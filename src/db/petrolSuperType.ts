import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PetrolType } from "./petrolType";

@Entity("petrol_super_types")
export class PetrolSuperType {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text" })
  cat: string;

  @OneToMany(() => PetrolType, (type) => type.superTypeId)
  petrolTypes: PetrolType[];
}
