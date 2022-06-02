import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("petrol_super_types")
export class PetrolSuperType {
  @Column({ type: "uuid" })
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "text" })
  name: string;
}
