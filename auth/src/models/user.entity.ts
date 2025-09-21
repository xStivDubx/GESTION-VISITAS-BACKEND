import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('ADM_USER')
export class AdmUser {
  @PrimaryGeneratedColumn({ name: 'USER_ID' })
  userId: number;

  @Column({ name: 'NAME', length: 100 })
  name: string;

  @Column({ name: 'LASTNAME', length: 100, nullable: true })
  lastname: string;

  @Column({ name: 'EMAIL', length: 150, unique: true, nullable: true })
  email: string;

  @Column({ name: 'PHONE', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'USERNAME', length: 50, unique: true })
  username: string;

  @Column({ name: 'PASSWORD', length: 500 })
  password: string;

  @Column({ name: 'STATE', type: 'tinyint', default: 1 })
  state: number;

  @UpdateDateColumn({ name: 'LAST_UPDATE', type: 'timestamp' })
  lastUpdate: Date;

  @CreateDateColumn({ name: 'CREATED_DATE', type: 'timestamp' })
  createdDate: Date;

  // Relación con rol
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'ROLE_ID' })
  role: Role;
}
