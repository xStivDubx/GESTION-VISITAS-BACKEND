import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('ADM_ROLE_PERMISSION')
export class RolePermission {
  @PrimaryGeneratedColumn({ name: 'ROLE_PERMISSION_ID', type: 'int' })
  rolePermissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'ROLE_ID' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'PERMISSION_ID' })
  permission: Permission;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'timestamp' })
  createdDate: Date;
}
