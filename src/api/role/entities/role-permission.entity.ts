import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Modules } from 'src/api/module/entities/module.entity';
import { Permission } from 'src/api/permission/entities/permission.entity';

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Modules, (module) => module.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  module: Modules;

  @ManyToOne(() => Permission, (permission) => permission.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission: Permission;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_by: Date;

  @UpdateDateColumn()
  updated_by: Date;
}
