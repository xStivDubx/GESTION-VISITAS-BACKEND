import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity('ADM_PERMISSION')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'PERMISSION_ID' })
  permissionId: number;

  @Column({ name: 'NAME', length: 100 })
  name: string;

  @Column({ name: 'DESCRIPTION', length: 255, nullable: true })
  description: string;

  @Column({ name: 'STATE', type: 'tinyint', default: 1 })
  state: number;

  @Column({ name: 'ICON', length: 100, nullable: true })
  icon: string;

  @Column({ name: 'CODE', length: 50, nullable: true })
  code: string;

  @Column({ name: 'ROUTE_FRONT', length: 200, nullable: true })
  routeFront: string;

  @UpdateDateColumn({ name: 'LAST_UPDATE', type: 'timestamp' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'timestamp' })
  createdDate: Date;

  // Relaciones
  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions: RolePermission[];
}
