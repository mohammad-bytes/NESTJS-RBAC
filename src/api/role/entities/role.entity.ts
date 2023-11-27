import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_by: Date;

  @UpdateDateColumn()
  updated_by: Date;
}
