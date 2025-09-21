import { Entity, PrimaryGeneratedColumn, Column, OneToMany, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { AdmUser } from './user.entity';
import { RolePermission } from './role-permission.entity';

@Entity('ADM_ROLE')
export class Role {
  @PrimaryGeneratedColumn({ name: 'ROLE_ID' })
  roleId: number;

  @Column({ name: 'NAME', length: 100 })
  name: string;

  @Column({ name: 'DESCRIPTION', length: 255, nullable: true })
  description: string;

  @Column({ name: 'STATE', type: 'tinyint', default: 1 })
  state: number;

  @UpdateDateColumn({ name: 'LAST_UPDATE', type: 'timestamp' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'timestamp' })
  createdDate: Date;

  // Relaciones
  @OneToMany(() => AdmUser, (user) => user.role)
  users: AdmUser[];

  @OneToMany(() => RolePermission, (rp) => rp.role)
  rolePermissions: RolePermission[];
}
