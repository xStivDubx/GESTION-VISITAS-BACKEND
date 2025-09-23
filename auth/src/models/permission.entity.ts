import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('ADM_PERMISSION')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'PERMISSION_ID', type: 'int' })
  permissionId: number;

  @Column({ name: 'NAME', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'DESCRIPTION', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'STATE', type: 'tinyint', default: 1 })
  state: number;

  @Column({ name: 'ICON', type: 'varchar', length: 100, nullable: true })
  icon: string;

  @Column({ name: 'CODE', type: 'varchar', length: 50, nullable: true })
  code: string;

  @Column({ name: 'ROUTE_FRONT', type: 'varchar', length: 200, nullable: true })
  routeFront: string;

  @UpdateDateColumn({ name: 'LAST_UPDATE', type: 'timestamp' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'timestamp' })
  createdDate: Date;

  // Relaciones
  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];
}
